import {keyAddressPair, transcation} from "./Interfaces";
import nacl, {BoxKeyPair} from "tweetnacl";
import util from "tweetnacl-util";

const secp256k1 = require('secp256k1');

function getStringfromArray(array : Uint8Array) {
    return Buffer.from(util.encodeBase64(array), "base64").toString("hex");
}

export function generateKeyAddressPair() : keyAddressPair {
    let pair : BoxKeyPair = nacl.box.keyPair();

    let privateKey = Buffer.from(pair.secretKey).toString("hex");
    let address = Buffer.from(pair.publicKey).toString("hex");

    return {
        privateKey: privateKey,
        privateKeyArray: pair.secretKey,
        address: address,
        addressArray: pair.publicKey
    }
}

export function signTransaction(t : transcation, privateKeyArray : Uint8Array) : string {
    return "";
}