import {keyAddressPair, transcation} from "./Interfaces";

const crypto = require('crypto');
const secp256k1 = require('secp256k1');

export function generateKeyAddressPair() : keyAddressPair {
    let privateKey;

    do {
        privateKey = crypto.randomBytes(32);
    } while(!secp256k1.privateKeyVerify(privateKey))

    let publicKey = secp256k1.publicKeyCreate(privateKey);

    return {
        privateKey: Buffer.from(privateKey).toString("hex"),
        address: Buffer.from(publicKey).toString("hex")
    }
}

export function signTransaction(t : transcation) : string {
    return "";
}