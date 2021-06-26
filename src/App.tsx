import React from 'react';
import './App.scss';
import UpperList from "./Components/UpperList/UpperList";
import {account, block, signaturePair, transcation, validStartHash} from "./Utils/Interfaces";
import {
    blockToString,
    generateBlockHash,
    generateKeyAddressPair,
    signTransaction,
    verifyAllBlockTransactions
} from "./Utils/Functions";
import Blockchain from "./Components/Blockchain/Blockchain";
import {DragDropContext} from "react-beautiful-dnd";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {showError, showWarning} from "./Utils/ToastFunctions";
import {sha256} from "js-sha256";

interface AppProps {
}

interface AppState {
    accountIdCount: number,
    accounts: account[],
    transactionIdCount: number,
    transactions: transcation[],
    unusedTransactions: number[],
    blockIdCount: number,
    blocks: block[],
    lastConfirmedBlock: number,
    lastUnusedBlock: number
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
            blockIdCount: 2,
            blocks: [{
                id: 0,
                prevHash: validStartHash,
                nonce: 0,
                transactions: [],
                confirmed: false
            },{
                id: 1,
                nonce: 0,
                transactions: [],
                confirmed: false
            }],
            lastConfirmedBlock: -1,
            lastUnusedBlock: 1
        };

        this.recalculateBlocks();
    }

    addAccount = () : void => {
        let keys = generateKeyAddressPair();
        let count = this.state.accountIdCount;

        let balance = Math.floor(Math.random() * 1001);

        let a : account = {
            id: count,
            privateKey: keys.privateKey,
            privateKeyArray: keys.privateKeyArray,
            address: keys.address,
            addressArray: keys.addressArray,
            balanceBeforeBlock: Array(this.state.lastConfirmedBlock+2).fill(balance)
        }
        this.setState({accountIdCount: count + 1});

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
        if(this.state.accounts.length === 0) {
            showError("At least one account is needed to set all transaction values!");
            return;
        }

        if(t.from === undefined || t.to === undefined) {
            showError("All values have to be set to sign a transaction!");
            return;
        }

        let sender : number = t.from;

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

    recalculateBlocks = () => {
        let blocks = [...this.state.blocks];
        let transactions = [...this.state.transactions];

        let lastUnused = this.state.lastUnusedBlock;
        let nextId = this.state.blockIdCount;
        if(blocks[blocks.length-1].confirmed || blocks[blocks.length-1].transactions.length !== 0) {
            blocks.push({
                id: nextId,
                nonce: 0,
                transactions: [],
                confirmed: false
            });
            lastUnused = nextId++;
        }

        let changed = false;
        let lastConfirmed = this.state.lastConfirmedBlock;

        for(let i = 0; i < blocks.length; i++) {
            let hash = generateBlockHash(blocks[i], transactions);
            if(hash === "") {
                console.log("Error while generating hash, see previous error-messages!");
                return;
            }
            if(hash !== blocks[i].hash) {
                if(!changed && lastConfirmed > i-1) {
                    lastConfirmed = i-1;
                }

                changed = true;
            }
            if(changed) {
                blocks[i].confirmed = false;
            }

            blocks[i].hash = hash;
            if(i !== blocks.length-1) {
                blocks[i+1].prevHash = hash;
            }
        }

        this.setState({blocks: blocks, lastUnusedBlock: lastUnused, lastConfirmedBlock: lastConfirmed,blockIdCount: nextId});
    }

    confirmBlock = (id : number) => {
        let blocks = [...this.state.blocks];
        let transactions = [...this.state.transactions];
        let accounts = [...this.state.accounts];

        if(id !== 0 && !blocks[id-1].confirmed) {
            showWarning("All previous blocks need to be confirmed first!");
            return;
        }

        let transactionsValidated = verifyAllBlockTransactions(blocks[id], transactions, accounts);

        if(!transactionsValidated) {
            showError("Some transactions could not be verified!");
            return;
        }

        let balancesAfterBlock : number[] = [];
        for(let i = 0; i < accounts.length; i++) {
            balancesAfterBlock[i] = accounts[i].balanceBeforeBlock[id];
        }

        for(let i = 0; i < blocks[id].transactions.length; i++) {
            let t = transactions[blocks[id].transactions[i]];

            if(t.from === undefined || t.to === undefined || t.amount === undefined) return;

            let newFromValue = balancesAfterBlock[t.from] - t.amount;
            if(newFromValue < 0) {
                showError("Transaction " + t.id + " could not be confirmed, account " + t.from + " doesn't have enough balance for this transaction!");
                for(let j = 0; j < accounts.length; j++) {
                    accounts[j].balanceBeforeBlock = accounts[j].balanceBeforeBlock.slice(0, id+1);
                }
                this.setState({accounts: accounts});
                return;
            }

            balancesAfterBlock[t.from] = balancesAfterBlock[t.from] - t.amount;
            balancesAfterBlock[t.to] = balancesAfterBlock[t.to] + t.amount;
        }

        for(let i = 0; i < accounts.length; i++) {
            accounts[i].balanceBeforeBlock[id+1] = balancesAfterBlock[i];
        }

        let hash = "";
        let block = blocks[id];
        let nonce = -1;

        let blockString = blockToString(block, transactions);

        do {
            nonce++;
            hash = sha256(blockString + nonce);
        } while(!hash.startsWith(validStartHash) && nonce < 1000000)

        if(nonce >= 1000000 && !hash.startsWith(validStartHash)) {
            showError("Could not validate block!");
            console.log("Didn't find nonce in 10000 iterations");
            return;
        }

        block.nonce = nonce;
        block.confirmed = true;
        block.hash = hash;
        blocks[id] = block;

        this.setState({blocks: blocks, lastConfirmedBlock: block.id, accounts: accounts}, () => {
            this.recalculateBlocks();
        });
    }

    onDragEnd = (result : any) => {
        let {destination, source, draggableId} = result;

        if(result.destination === null) return;
        if(destination.droppableId === source.droppableId && destination.index  === source.index) return;

        let sourceIndex : number = result.source.index;
        let destinationIndex : number = result.destination.index;
        let transactionId : number = parseInt(draggableId.replace("transaction", ""));

        let transactionList = this.state.transactions;
        let unusedTransactions = this.state.unusedTransactions;
        let blocks = this.state.blocks;

        if(result.destination.droppableId === "transactionList") {
            if(result.source.droppableId === "transactionList") {
                unusedTransactions.splice(sourceIndex, 1);
                unusedTransactions.splice(destinationIndex, 0, transactionId);

                this.setState({unusedTransactions: unusedTransactions});
            } else {
                let source = result.source.droppableId.replace("block", "");
                let blockId = parseInt(source);

                blocks[blockId].transactions.splice(sourceIndex, 1);

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

                unusedTransactions.splice(sourceIndex, 1);

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

        this.recalculateBlocks();
    }

    render() {
        return <div className="App">
            <DragDropContext onDragEnd={this.onDragEnd}>
            <div id={"upperContent"}>
                <UpperList
                    title={"accounts"}
                    accounts={this.state.accounts}
                    droppableId={"accountList"}
                    lastConfirmedBlock={this.state.lastConfirmedBlock}
                    className={"accountListContainer"}
                    addFunction={this.addAccount}
                    emptyText={"Add some accounts!"}
                    dropDisabled={true}
                />
                <UpperList
                    title={"transactions"}
                    transactions={this.state.transactions}
                    transactionOrder={this.state.unusedTransactions}
                    numberOfAccounts={this.state.accountIdCount}
                    className={"transactionListContainer"}
                    droppableId={"transactionList"}
                    addFunction={this.addTransaction}
                    signFunction={this.signTransaction}
                    removeSignatureFunction={this.removeSignature}
                />
            </div>
            <div id={"blockchainContent"}>
                <Blockchain
                    blocks={this.state.blocks}
                    transactions={this.state.transactions}
                    confirmFunction={this.confirmBlock}
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