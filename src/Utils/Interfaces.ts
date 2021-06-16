export interface accountArray {
    [index: number]: account
}

export interface account {
    id: number,
    privateKey?: string,
    publicKey?: string,
    balance?: number
}

export interface transactionArray {
    [index: number]: transcation
}

export interface transcation {
    id: number,
    from?: string,
    to?: string,
    amount?: number,
    signature?: string
}

export interface settingsArray {
    [index: number]: settings
}

export interface settings {
    name: string,
    toggle: boolean,
    possibleValues?: string[],
    currentState: string | boolean
}
