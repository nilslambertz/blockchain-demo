import {
  Account,
  Block,
  KeyAddressPair,
  SignaturePair,
  Transaction,
} from "./Types";
import nacl, { BoxKeyPair } from "tweetnacl";
import util from "tweetnacl-util";
import { encode } from "@stablelib/utf8";
import { sha256 } from "js-sha256";
import { Buffer } from "buffer";
import { MAX_INITIAL_BALANCE } from "./constants";

/**
 * Returns hex-encoded String from array
 * @param array Array which should be converted to String
 */
function getStringFromArray(array: Uint8Array) {
  return Buffer.from(util.encodeBase64(array), "base64").toString("hex");
}

/**
 * Returns Uint8Array from String
 * @param str String which should be converted to Array
 */
function getArrayFromString(str: string): Uint8Array {
  return encode(str);
}

/**
 * Generates public-private-key pair and returns them
 * in hex-encoding and as Uint8-arrays
 */
export function generateKeyAddressPair(): KeyAddressPair {
  const pair: BoxKeyPair = nacl.sign.keyPair();
  const privateKey = getStringFromArray(pair.secretKey);
  const address = getStringFromArray(pair.publicKey);

  return {
    privateKey: privateKey,
    privateKeyArray: pair.secretKey,
    address: address,
    addressArray: pair.publicKey,
  };
}

/**
 * Signs transaction and returns signature in hex-encoding and as Uint8-arrays
 * @param t Transaction to be signed
 * @param privateKeyArray Private key to sign the transaction
 */
export function signTransactionWithPrivateKey(
  t: Transaction,
  privateKeyArray: Uint8Array
): SignaturePair {
  const message: string = transactionToString(t);
  const messageArr = getArrayFromString(message);
  const sig: Uint8Array = nacl.sign.detached(messageArr, privateKeyArray);

  return {
    signature: getStringFromArray(sig),
    signatureArray: sig,
  };
}

/**
 * Verifies a given transaction and returns whether the transaction is signed with the correct key
 * @param t Transaction to be verified
 * @param signatureArray Uint8Array of signature
 * @param addressArray Uint8Array of address (public key)
 */
export function verifyTransaction(
  t: Transaction,
  signatureArray: Uint8Array,
  addressArray: Uint8Array
): boolean {
  const message: string = transactionToString(t);
  const messageArr = getArrayFromString(message);

  return nacl.sign.detached.verify(messageArr, signatureArray, addressArray);
}

/**
 * Verifies all transactions in a given block
 * @param b Block
 * @param transactions Array of all transactions
 * @param accounts Array of all accounts
 */
export function verifyAllBlockTransactions(
  b: Block,
  transactions: Transaction[],
  accounts: Account[]
): boolean {
  for (let i = 0; i < b.transactions.length; i++) {
    let t = transactions[b.transactions[i]];

    if (t.from === undefined) return false;

    const account = accounts[t.from];
    if (!t.signatureArray || !account.addressArray) return false;

    const verified = verifyTransaction(
      t,
      t.signatureArray,
      account.addressArray
    );
    if (!verified) {
      console.log(
        `Error in block ${b.id}: Signature of transaction ${t.id} could not be verified!`
      );
      return false;
    }
  }
  return true;
}

/**
 * Generates hash for a block
 * @param b Block to be hashed
 * @param transactions Array of all transactions
 */
export function generateBlockHash(
  b: Block,
  transactions: Transaction[]
): string {
  if (b.nonce === undefined) return "";

  const blockString = blockToString(b, transactions);
  return generateBlockHashFromString(blockString, b.nonce);
}

/**
 * Generates hash for a block in string format
 * @param blockString String-representation of a block
 * @param nonce Nonce for that block
 */
export function generateBlockHashFromString(
  blockString: string,
  nonce: number
) {
  return sha256(blockString + nonce);
}

/**
 * Returns string of a given block which includes the
 * previous hash and all transactions
 * @param b Block
 * @param transactions Array of all transactions
 */
export function blockToString(b: Block, transactions: Transaction[]): string {
  const transactionArray = b.transactions.map((transactionIndex) =>
    transactionToString(transactions[transactionIndex])
  );

  const obj = {
    prevHash: b.prevHash,
    transactions: transactionArray,
  };

  return JSON.stringify(obj);
}

/**
 * Returns string of a given transaction which includes
 * the id, the sender, the receiver and the amount
 * @param t Transaction
 */
function transactionToString(t: Transaction): string {
  return JSON.stringify({
    id: t.id,
    from: t.from,
    to: t.to,
    amount: t.amount,
  });
}

export function generateAccount(
  id: number,
  lastConfirmedBlock: number
): Account {
  const keys = generateKeyAddressPair();
  const balance = Math.floor(Math.random() * (MAX_INITIAL_BALANCE + 1));

  return {
    id,
    idString: "a" + id,
    balanceBeforeBlock: Array(lastConfirmedBlock + 2).fill(balance),
    ...keys,
  };
}
