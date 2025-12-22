import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core";
import { createLibp2p } from "libp2p";
import { kadDHT } from "@libp2p/kad-dht";
import { webSockets } from "@libp2p/websockets";
import { webRTC } from "@libp2p/webrtc";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { bootstrap } from "@libp2p/bootstrap";
import { circuitRelayTransport } from "@libp2p/circuit-relay-v2";
import { identify } from "@libp2p/identify";
import { ping } from "@libp2p/ping";
import CryptoJS from "crypto-js";

// Singleton instance
let heliaNode = null;
let fs = null;

export async function initHelia() {
    if (heliaNode) return { helia: heliaNode, fs };

    try {
        const blockstore = new MemoryBlockstore();

        // Create a custom libp2p node with browser-friendly config
        const libp2p = await createLibp2p({
            transports: [
                webSockets(),
                webRTC(),
                circuitRelayTransport(),
            ],
            connectionEncrypters: [noise()],
            streamMuxers: [yamux()],
            peerDiscovery: [
                bootstrap({
                    list: [
                        "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
                        "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
                        "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
                        "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjdEP8kQE56",
                    ],
                }),
            ],
            services: {
                dht: kadDHT({ clientMode: true }),
                identify: identify(),
                ping: ping(),
            },
        });

        heliaNode = await createHelia({
            blockstore,
            libp2p,
        });

        fs = unixfs(heliaNode);
        console.log("Helia node started with ID:", heliaNode.libp2p.peerId.toString());
        return { helia: heliaNode, fs };
    } catch (err) {
        console.error("Failed to start Helia", err);
        throw err;
    }
}

export async function getPeerCount() {
    if (!heliaNode) return 0;
    // helia.libp2p.getPeers() returns a list of connections/peers
    return heliaNode.libp2p.getPeers().length;
}

// Encrypt data with password and return Ciphertext
function encryptData(data, password) {
    const jsonStr = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonStr, password).toString();
    return encrypted;
}

// Decrypt data with password and return original object
function decryptData(ciphertext, password) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) throw new Error("Decryption failed (wrong password?)");
    return JSON.parse(decryptedStr);
}

export async function uploadToIPFS(data, password) {
    const { fs } = await initHelia();
    const encrypted = encryptData(data, password);

    // Convert string to bytes
    const encoder = new TextEncoder();
    const bytes = encoder.encode(encrypted);

    // Add to IPFS
    const cid = await fs.addBytes(bytes);
    return cid.toString();
}

export async function downloadFromIPFS(cidString, password) {
    const { fs } = await initHelia();

    // Helia/UnixFS usually handles string CIDs, but explicit parsing is safer
    const { CID } = await import("multiformats/cid");
    const cid = CID.parse(cidString);

    // Read content
    let text = "";
    const decoder = new TextDecoder();

    for await (const chunk of fs.cat(cid)) {
        text += decoder.decode(chunk, { stream: true });
    }
    // Flush
    text += decoder.decode();

    const data = decryptData(text, password);
    return data;
}
