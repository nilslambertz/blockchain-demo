export interface accountArray {
    [index: number]: account
}

interface account {
    id: number,
    privateKey: string,
    publicKey: string,
    balance: number
}

export interface transcation {
    id: number,
    from?: string,
    to?: string,
    amount?: number,
    signature?: string
}

