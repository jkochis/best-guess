import LZString from "lz-string";

// Configuration for STUN servers (needed for connectivity, though we are local mostly)
const rtcConfig = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ],
};

function compress(data) {
    return LZString.compressToBase64(JSON.stringify(data));
}

function decompress(str) {
    const json = LZString.decompressFromBase64(str);
    return JSON.parse(json);
}

export class SyncHost {
    constructor(onSignal, onConnect, onData) {
        this.peerConnection = new RTCPeerConnection(rtcConfig);
        this.dataChannel = this.peerConnection.createDataChannel("sync-channel");
        this.onSignal = onSignal; // Callback when a signal (Offer) is ready to be shown
        this.onConnect = onConnect;
        this.onData = onData;

        this.setupDataChannel(this.dataChannel);
        this.setupPeerConnection();
    }

    setupDataChannel(channel) {
        channel.onopen = () => {
            console.log("Data channel open");
            if (this.onConnect) this.onConnect();
        };
        channel.onmessage = (event) => {
            if (this.onData) this.onData(JSON.parse(event.data));
        };
    }

    setupPeerConnection() {
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate === null) {
                // Gathering finished, essentially.
                // For manual signaling, we wait until we have a complete description (offer + candidates)
                // or just use the localDescription if we assume trickle ICE isn't viable manually (it isn't).
                // WE WAIT FOR ALL CANDIDATES before generating the final QR code string.
                const offer = this.peerConnection.localDescription;
                const code = compress(offer);
                console.log("Offer generated, size:", code.length);
                if (this.onSignal) this.onSignal(code);
            }
        };
    }

    async createOffer() {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        // We wait for onicecandidate (null) to trigger the onSignal callback with the full SDP
    }

    async handleAnswer(answerCode) {
        const answer = decompress(answerCode);
        await this.peerConnection.setRemoteDescription(answer);
    }

    sendData(data) {
        if (this.dataChannel.readyState === "open") {
            this.dataChannel.send(JSON.stringify(data));
        }
    }
}

export class SyncClient {
    constructor(onSignal, onConnect, onData) {
        this.peerConnection = new RTCPeerConnection(rtcConfig);
        this.onSignal = onSignal; // Callback when a signal (Answer) is ready
        this.onConnect = onConnect;
        this.onData = onData;

        this.peerConnection.ondatachannel = (event) => {
            this.setupDataChannel(event.channel);
        };

        this.setupPeerConnection();
    }

    setupDataChannel(channel) {
        this.dataChannel = channel;
        channel.onopen = () => {
            console.log("Data channel open");
            if (this.onConnect) this.onConnect();
        };
        channel.onmessage = (event) => {
            if (this.onData) this.onData(JSON.parse(event.data));
        };
    }

    setupPeerConnection() {
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate === null) {
                // Gathering finished.
                const answer = this.peerConnection.localDescription;
                const code = compress(answer);
                console.log("Answer generated, size:", code.length);
                if (this.onSignal) this.onSignal(code);
            }
        };
    }

    async handleOffer(offerCode) {
        const offer = decompress(offerCode);
        await this.peerConnection.setRemoteDescription(offer);
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        // Wait for ICE gathering to complete before onSignal triggers
    }

    sendData(data) {
        if (this.dataChannel && this.dataChannel.readyState === "open") {
            this.dataChannel.send(JSON.stringify(data));
        }
    }
}
