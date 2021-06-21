import React from 'react';
import "./Blockchain.scss";
import {block, transcation} from "../../Utils/Interfaces";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import UpperList from "../UpperList/UpperList";

interface BlockProps {
    block: block,
    transactions: transcation[]
}

class Block extends React.Component<BlockProps, {}> {
    printTransactionList = () => {
        let transactions : transcation[] = [];
        let blockTransactions : number[] = this.props.block.transactions;
        for(let i = 0; i < blockTransactions.length; i++) {
            transactions.push(this.props.transactions[blockTransactions[i]]);
        }

        return  <Droppable droppableId={"block" + this.props.block.id}>
                {(provided, snapshot) => (
                    <UpperList
                        innerRef={provided.innerRef}
                        {...provided.droppableProps}
                        isDraggingOver={snapshot.isDraggingOver}
                        title={"transactions"}
                        transactions={transactions}
                        transactionOrder={this.props.block.transactions}
                        className={"transactionListContainer"}
                        blockList={true}
                        placeholder={provided.placeholder}
                    />)}</Droppable>
    }

    render() {
        let confirmed : string = this.props.block.confirmed ? "confirmed" : "unconfirmed";

        return <div className={"blockContainer"}>
            <div className={"block " + confirmed}>
                <div className={"prevHash"}>
                    {this.props.block?.prevHash}
                    <div className={"blockDescription"}>Previous hash</div>
                </div>
                <div className={"transactions"}>
                    <div className={"transactionList"}>
                        {this.printTransactionList()}
                    </div>
                    <div className={"blockDescription"}>Transactions</div>
                </div>
                <div className={"nonce"}>
                    {this.props.block?.nonce}
                    <div className={"blockDescription"}>Nonce</div>
                </div>
                <div className={"confirmed"}>
                    {confirmed}
                    <div className={"blockDescription"}>Confirmation</div>
                </div>
                <div className={"hash"}>
                    {this.props.block?.hash}
                    <div className={"blockDescription"}>Hash</div>
                </div>
            </div>
        </div>;
    }
}

export default Block;