import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";
import {account, block, signaturePair, transcation} from "./Utils/Interfaces";
import {generateKeyAddressPair, signTransaction, verifyTransaction} from "./Utils/Functions";
import Block from "./Components/Blockchain/Block";
import Blockchain from "./Components/Blockchain/Blockchain";

interface AppProps {
}

interface AppState {
    accountIdCount: number,
    accounts: account[],
    transactionIdCount: number,
    transactions: transcation[],
    unusedTransactions: number[],
    blocks: block[]
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            accountIdCount: 0,
            accounts: [],
            transactionIdCount: 0,
            transactions: [],
            unusedTransactions: [],
            blocks: [{
                prevHash: "0000",
                nonce: 187,
                hash: "hashahsha",
                valid: false,
                confirmed: false
            },{
                prevHash: "13123123",
                nonce: 222,
                hash: "xddddd",
                valid: false,
                confirmed: false
            }]
        };
    }

    addAccount = () : void => {
        let keys = generateKeyAddressPair();
        let count = this.state.accountIdCount;

        let a : account = {
            id: count,
            privateKey: keys.privateKey,
            privateKeyArray: keys.privateKeyArray,
            address: keys.address,
            addressArray: keys.addressArray
        }
        this.setState({accountIdCount: count + 1});

        a.balance = Math.floor(Math.random() * 1001);

        let arr : account[] = this.state.accounts;
        arr.push(a);
        this.setState({accounts: arr});
    }

    addTransaction = () : void => {
        let count = this.state.transactionIdCount;

        let t : transcation = {
            id: count,
            signed: false,
            editable: true
        }
        this.setState({transactionIdCount: count + 1});

        let arr : transcation[] = this.state.transactions;
        let unusedArr : number[] = this.state.unusedTransactions;
        arr.push(t);
        unusedArr.push(t.id);
        this.setState({transactions: arr, unusedTransactions: unusedArr});
    }

    signTransaction = (t: transcation) => {
        let sender : number = -1;
        if(t.from !== undefined){
            sender = t.from;
        }

        let privateKey = this.state.accounts[sender].privateKeyArray;
        let address = this.state.accounts[sender].addressArray;

        if(sender !== -1 && privateKey !== undefined && address !== undefined) {
            let sig : signaturePair = signTransaction(t, privateKey);

            let transactionArray = this.state.transactions;
            transactionArray[t.id].signed = true;
            transactionArray[t.id].signatureArray = sig.signatureArray;
            transactionArray[t.id].signature = sig.signature;

            this.setState({transactions: transactionArray});
        }
    }


    render() {
        return <div className="App">
            <div id={"upperContent"}>
                <UpperList
                    title={"accounts"}
                    accounts={this.state.accounts}
                    className={"accountListContainer"}
                    addFunction={this.addAccount}
                />
                <UpperList
                    title={"transactions"}
                    transactions={this.state.transactions}
                    numberOfAccounts={this.state.accountIdCount}
                    className={"transactionListContainer"}
                    addFunction={this.addTransaction}
                    signFunction={this.signTransaction}
                />
            </div>
            <div id={"blockchainContent"}>
                <Blockchain blocks={this.state.blocks}></Blockchain>
            </div>
            <div id={"footer"}>
                by nils lambertz
            </div>
        </div>;
    };
}

export default App;