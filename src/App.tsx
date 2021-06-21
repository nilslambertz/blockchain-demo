import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";
import {account, block, signaturePair, transcation} from "./Utils/Interfaces";
import {generateKeyAddressPair, signTransaction, verifyTransaction} from "./Utils/Functions";
import Blockchain from "./Components/Blockchain/Blockchain";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {showError} from "./Utils/ToastFunctions";

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

            transactionArray[t.id].signed = true;
            transactionArray[t.id].signatureArray = sig.signatureArray;
            transactionArray[t.id].signature = sig.signature;

            this.setState({transactions: transactionArray});
        }
    }

    removeSignature = (id : number) => {
        let transactionArray : transcation[] = this.state.transactions;
        let t : transcation = transactionArray[id];

        t.signed = false;
        t.signatureArray = undefined;
        t.signature = undefined;

        transactionArray[id] = t;

        this.setState({transactions: transactionArray});
    }

    onDragEnd = (result : any) => {
        let {destination, source, draggableId} = result;

        if(result.destination === null) return;
        if(destination.droppableId === source.droppableId && destination.index  === source.index) return;

        let sourceIndex = result.source.index;
        let destinationIndex = result.destination.index;
        let transactionId : number = parseInt(draggableId.replace("transaction", ""));

        if(result.destination.droppableId === "transactionList") {
            if(result.source.droppableId === "transactionList") {
                let unusedTransactions = this.state.unusedTransactions;

                unusedTransactions.splice(sourceIndex, 1);
                unusedTransactions.splice(destinationIndex, 0, transactionId);

                this.setState({unusedTransactions: unusedTransactions});
            } else {
                let transactionList = this.state.transactions;

                let source = result.source.droppableId.replace("block", "");
                let blockId = parseInt(source);

                let blocks = this.state.blocks;
                blocks[blockId].transactions.splice(sourceIndex, 1);

                let unusedTransactions = this.state.unusedTransactions;
                unusedTransactions.splice(destinationIndex, 0, transactionId);

                transactionList[transactionId].editable = true;

                this.setState({blocks: blocks, unusedTransactions: unusedTransactions, transactions: transactionList});
            }
        } else {
            if(result.source.droppableId === "transactionList") {
                let transactionList = this.state.transactions;
                if(!transactionList[transactionId].signed) {
                    showError("Transaction must be signed to be included in a block!");
                    return;
                }

                let unusedTransactions = this.state.unusedTransactions;
                unusedTransactions.splice(sourceIndex, 1);

                let blocks = this.state.blocks;
                let blockId = parseInt(result.destination.droppableId.replace("block", ""));
                let blockIndex = result.destination.index;
                blocks[blockId].transactions.splice(blockIndex, 0, transactionId);

                transactionList[transactionId].editable = false;

                this.setState({unusedTransactions: unusedTransactions, blocks: blocks, transactions: transactionList});
            }  else {
                // Source and destination are blocks
                let sourceBlockId = parseInt(result.source.droppableId.replace("block", ""));
                let destinationBlockId = parseInt(result.destination.droppableId.replace("block", ""));

                if(sourceBlockId === destinationBlockId) {
                    let blocks = this.state.blocks;
                    let transactions = blocks[sourceBlockId].transactions;

                    transactions.splice(sourceIndex, 1);
                    transactions.splice(destinationIndex, 0, transactionId);

                    blocks[sourceBlockId].transactions = transactions;
                    this.setState({blocks: blocks});
                } else {
                    let blocks = this.state.blocks;

                    let sourceTransactions = blocks[sourceBlockId].transactions;
                    sourceTransactions.splice(sourceIndex, 1);
                    blocks[sourceBlockId].transactions = sourceTransactions;

                    let destinationTransactions = blocks[destinationBlockId].transactions;
                    destinationTransactions.splice(destinationIndex, 0, transactionId);
                    blocks[destinationBlockId].transactions = destinationTransactions;

                    this.setState({blocks: blocks});
                }
            }
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
            <ToastContainer />
        </div>;
    };
}

export default App;