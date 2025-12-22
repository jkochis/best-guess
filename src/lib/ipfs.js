import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-memory";
import CryptoJS from "crypto-js";

// Singleton instance
let heliaNode = null;
let fs = null;

export async function initHelia() {
    if (heliaNode) return { helia: heliaNode, fs };

    try {
        const blockstore = new MemoryBlockstore();
        heliaNode = await createHelia({ blockstore });
        fs = unixfs(heliaNode);
        console.log("Helia node started");
        return { helia: heliaNode, fs };
    } catch (err) {
        console.error("Failed to start Helia", err);
        throw err;
    }
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

    // Create CID object if needed, but helia/unixfs usually takes string or CID.
    // We'll pass the CID as we got it, assuming it parsable by the lib or we convert it.
    // Actually unixfs.cat takes a CID.
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
