export const validStartHash = "0".repeat(3);
export const maxInitialBalance = 1000;

export interface account {
  id: number;
  idString: string;
  privateKey?: string;
  privateKeyArray?: Uint8Array;
  address?: string;
  addressArray?: Uint8Array;
  balanceBeforeBlock: number[];
}

export interface transaction {
  id: number;
  idString: string;
  from?: number;
  to?: number;
  amount?: number;
  signed: boolean;
  signature?: string;
  signatureArray?: Uint8Array;
  editable: boolean;
}

export interface keyAddressPair {
  privateKey: string;
  privateKeyArray?: Uint8Array;
  address: string;
  addressArray: Uint8Array;
}

export interface signaturePair {
  signature: string;
  signatureArray: Uint8Array;
}

export interface block {
  id: number;
  prevHash?: string;
  transactions: number[];
  nonce?: number;
  hash?: string;
  confirmed: boolean;
}

export interface logElem {
  time?: string;
  type: "error" | "warning" | "success" | "info";
  message: string;
}
