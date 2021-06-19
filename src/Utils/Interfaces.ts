export interface account {
    id: number,
    privateKey?: string,
    address?: string,
    balance?: number
}

export interface transcation {
    id: number,
    from?: number,
    to?: number,
    amount?: number,
    signed: boolean
    signature?: string,
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
    address: string
}

export interface block {
    prevHash: string,
    transactions?: transcation[],
    nonce?: number,
    hash?: string,
    valid?: boolean,
    confirmed: boolean
}