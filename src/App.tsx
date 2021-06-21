import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";
import {account, block, signaturePair, transcation} from "./Utils/Interfaces";
import {generateKeyAddressPair, signTransaction, verifyTransaction} from "./Utils/Functions";
import Blockchain from "./Components/Blockchain/Blockchain";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

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

        let id : number = parseInt(draggableId.replace("transaction", ""));

        if(result.destination.droppableId === "transactionList") {
            if(result.source.droppableId === "transactionList") {
                let firstIndex = source.index;
                let secondIndex = destination.index;

                let unusedTransactions = this.state.unusedTransactions;

                let temp : number = unusedTransactions[firstIndex];
                unusedTransactions[firstIndex] = unusedTransactions[secondIndex];
                unusedTransactions[secondIndex] = temp;

                this.setState({unusedTransactions: unusedTransactions});
            } else {
                let source = result.source.droppableId.replace("block", "");
                let blockId = parseInt(source);
            }
        } else {
            let unusedTransactions = this.state.unusedTransactions;
            let index = -1;
            for(let i = 0; i < unusedTransactions.length; i++) {
                if(unusedTransactions[i] === id) {
                    index = i;
                }
            }

            unusedTransactions.splice(index, 1);

            let blocks = this.state.blocks;
            let blockId = parseInt(result.destination.droppableId.replace("block", ""));
            let blockIndex = result.destination.index;
            blocks[blockId].transactions.splice(blockIndex, 0, id);

            this.setState({unusedTransactions: unusedTransactions, blocks: blocks});
        }
    }

    render() {
        return <div className="App">
            <DragDropContext onDragEnd={this.onDragEnd}>
            <div id={"upperContent"}>
                <UpperList
                    title={"accounts"}
                    accounts={this.state.accounts}
                    className={"accountListContainer"}
                    addFunction={this.addAccount}
                />
                    <Droppable droppableId={"transactionList"}>
                        {(provided, snapshot) => (
                <UpperList
                    innerRef={provided.innerRef}
                    {...provided.droppableProps}
                    isDraggingOver={snapshot.isDraggingOver}
                    title={"transactions"}
                    transactions={this.state.transactions}
                    transactionOrder={this.state.unusedTransactions}
                    numberOfAccounts={this.state.accountIdCount}
                    className={"transactionListContainer"}
                    addFunction={this.addTransaction}
                    signFunction={this.signTransaction}
                    removeSignatureFunction={this.removeSignature}
                    placeholder={provided.placeholder}
                />)}</Droppable>
            </div>
            <div id={"blockchainContent"}>
                <Blockchain
                    blocks={this.state.blocks}
                    transactions={this.state.transactions}
                />
            </div>
            <div id={"footer"}>
                by nils lambertz
            </div></DragDropContext>
        </div>;
    };
}

export default App;