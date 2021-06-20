export interface account {
    id: number,
    privateKey?: string,
    privateKeyArray?: Uint8Array
    address?: string,
    addressArray?: Uint8Array
    balance?: number
}

export interface transcation {
    id: number,
    from?: number,
    to?: number,
    amount?: number,
    signed: boolean
    signature?: string,
    signatureArray?: Uint8Array
    editable: boolean
}

export interface settings {
    name: string,
    toggle: boolean,
    possibleValues?: string[],
    currentState: string | boolean
}

export interface keyAddressPair {
    privateKey: string,
    privateKeyArray?: Uint8Array
    address: string,
    addressArray: Uint8Array
}

export interface signaturePair {
    signature: string,
    signatureArray: Uint8Array
}

export interface block {
    prevHash: string,
    transactions: transcation[],
    nonce?: number,
    hash?: string,
    valid?: boolean,
    confirmed: boolean
}