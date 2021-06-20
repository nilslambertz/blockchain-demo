import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";
import {account, block, signaturePair, transcation} from "./Utils/Interfaces";
import {generateKeyAddressPair, signTransaction, verifyTransaction} from "./Utils/Functions";
import Blockchain from "./Components/Blockchain/Blockchain";
import {DragDropContext, Droppable} from "react-beautiful-dnd";

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
                id: 0,
                prevHash: "0000",
                nonce: 187,
                hash: "hashahsha",
                transactions: [],
                valid: false,
                confirmed: false
            },{
                id: 1,
                prevHash: "13123123",
                nonce: 222,
                hash: "xddddd",
                transactions: [],
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
            let index = this.getIndex(transactionArray, t.id);

            transactionArray[index].signed = true;
            transactionArray[index].signatureArray = sig.signatureArray;
            transactionArray[index].signature = sig.signature;

            this.setState({transactions: transactionArray});
        }
    }

    getIndex = (transactionArray : transcation[], id : number) : number => {
        for(let i = 0; i < transactionArray.length; i++) {
            if(transactionArray[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    removeSignature = (id : number) => {
        let transactionArray : transcation[] = this.state.transactions;
        let index = this.getIndex(transactionArray, id);
        let t : transcation = transactionArray[index];

        t.signed = false;
        t.signatureArray = undefined;
        t.signature = undefined;

        transactionArray[index] = t;

        this.setState({transactions: transactionArray});
    }

    onDragEnd = (result : any) => {
        let {destination, source, draggableId} = result;

        if(result.destination === null) return;
        if(destination.droppableId === source.droppableId && destination.index  === source.index) return;

        if(result.destination.droppableId === "transactionListDroppable") {
            let firstIndex = source.index;
            let secondIndex = destination.index;

            let unusedTransactions = this.state.unusedTransactions;
            let newTransactionArray : any[] = [];
            unusedTransactions.forEach((id : number) => {
                newTransactionArray.push(this.state.transactions[id]);
            });

            let temp : transcation = newTransactionArray[firstIndex];
            newTransactionArray[firstIndex] = newTransactionArray[secondIndex];
            newTransactionArray[secondIndex] = temp;

            this.setState({transactions: newTransactionArray});
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
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId={"transactionListDroppable"}>
                        {provided => (
                <UpperList
                    innerRef={provided.innerRef}
                    {...provided.droppableProps}
                    title={"transactions"}
                    transactions={this.state.transactions}
                    numberOfAccounts={this.state.accountIdCount}
                    className={"transactionListContainer"}
                    addFunction={this.addTransaction}
                    signFunction={this.signTransaction}
                    removeSignatureFunction={this.removeSignature}
                    placeholder={provided.placeholder}
                />)}</Droppable></DragDropContext>
            </div>
            <div id={"blockchainContent"}>
                <Blockchain blocks={this.state.blocks} />
            </div>
            <div id={"footer"}>
                by nils lambertz
            </div>
        </div>;
    };
}

export default App;