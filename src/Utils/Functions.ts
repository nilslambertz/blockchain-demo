import {keyAddressPair, signaturePair, transcation} from "./Interfaces";
import nacl, {BoxKeyPair} from "tweetnacl";
import util from "tweetnacl-util";
import {encode} from "@stablelib/utf8";

function getStringfromArray(array : Uint8Array) {
    return Buffer.from(util.encodeBase64(array), "base64").toString("hex");
}

function getArrayfromString(str : string) : Uint8Array {
    return encode(str);
}

export function generateKeyAddressPair() : keyAddressPair {
    let pair : BoxKeyPair = nacl.sign.keyPair();

    let privateKey = getStringfromArray(pair.secretKey);
    let address = getStringfromArray(pair.publicKey);

    return {
        privateKey: privateKey,
        privateKeyArray: pair.secretKey,
        address: address,
        addressArray: pair.publicKey
    }
}

export function signTransaction(t : transcation, privateKeyArray : Uint8Array) : signaturePair {
    let message : string = transactionToString(t);
    let messageArr = getArrayfromString(message);

    let sig : Uint8Array = nacl.sign.detached(messageArr, privateKeyArray);

    return {
        signature: getStringfromArray(sig),
        signatureArray: sig
    };
}

export function verifyTransaction(t: transcation, signatureArray : Uint8Array, addressArray : Uint8Array) : boolean {
    let message : string = transactionToString(t);
    let messageArr = getArrayfromString(message);

    return nacl.sign.detached.verify(messageArr, signatureArray, addressArray);
}

function transactionToString(t :transcation) : string {
    let obj = {
        id: t.id,
        from: t.from,
        to: t.to,
        amount: t.amount
    }

    return JSON.stringify(obj);
}