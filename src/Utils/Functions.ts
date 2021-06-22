import {account, block, keyAddressPair, signaturePair, transcation} from "./Interfaces";
import nacl, {BoxKeyPair} from "tweetnacl";
import util from "tweetnacl-util";
import {encode} from "@stablelib/utf8";
import {sha256} from "js-sha256";

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

export function verifyAllBlockTransactions(b : block, transactions: transcation[], accounts: account[]) : boolean {
    for(let i = 0; i < b.transactions.length; i++) {
        let t = transactions[b.transactions[i]];
        if (t.from !== undefined) {
            let account = accounts[t.from];

            if (t.signatureArray !== undefined && account.addressArray !== undefined) {
                let verified = verifyTransaction(t, t.signatureArray, account.addressArray);
                if (!verified) {
                    console.log("Error in block " + t.id + ": Signature in transaction " + t.id + " could not be verified!");
                    return false;
                }
            }
        }
    }
    return true;
}

export function generateBlockHash(b : block, transactions: transcation[]) : string {
    let transactionArray = [];
    for(let i = 0; i < b.transactions.length; i++) {
        let t = transactions[b.transactions[i]];
        transactionArray.push(transactionToString(t));
    }

    let obj = {
        prevHash: b.prevHash,
        transactions: transactionArray,
        nonce: b.nonce
    }

    let blockString = JSON.stringify(obj);
    return sha256(blockString);
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