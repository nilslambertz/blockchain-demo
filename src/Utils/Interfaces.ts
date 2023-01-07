export const validStartHash = "0".repeat(3);
export const maxInitialBalance = 1000;

export interface Account {
  id: number;
  idString: string;
  privateKey?: string;
  privateKeyArray?: Uint8Array;
  address?: string;
  addressArray?: Uint8Array;
  balanceBeforeBlock: number[];
}

export interface Transaction {
  id: number;
  idString: string;
  from?: number;
  to?: number;
  amount?: number;
  signed: boolean;
  signature?: string;
  signatureArray?: Uint8Array;
}

export interface KeyAddressPair {
  privateKey: string;
  privateKeyArray?: Uint8Array;
  address: string;
  addressArray: Uint8Array;
}

export interface SignaturePair {
  signature: string;
  signatureArray: Uint8Array;
}

export interface Block {
  id: number;
  prevHash?: string;
  transactions: number[];
  nonce?: number;
  hash?: string;
  confirmed: boolean;
}

export interface LogElem {
  time?: string;
  type: "error" | "warning" | "success" | "info";
  message: string;
}
