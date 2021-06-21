import React from 'react';
import "./Blockchain.scss";
import {block, transcation} from "../../Utils/Interfaces";
import {Droppable} from "react-beautiful-dnd";
import UpperList from "../UpperList/UpperList";

interface BlockProps {
    block: block,
    transactions: transcation[]
}

class Block extends React.Component<BlockProps, {}> {
    printTransactionList = () => {
        return  <UpperList
                        droppableId={"block" + this.props.block.id}
                        title={"transactions"}
                        transactions={this.props.transactions}
                        transactionOrder={this.props.block.transactions}
                        className={"transactionListContainer"}
                        blockList={true}/>
    }

    render() {
        let confirmed : string = this.props.block.confirmed ? "confirmed" : "unconfirmed";

        return <div className={"blockContainer"}>
            <div className={"block " + confirmed}>
                <div className={"prevHash blockSmallText"}>
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
                <div className={"hash blockSmallText"}>
                    {this.props.block?.hash}
                    <div className={"blockDescription"}>Hash</div>
                </div>
            </div>
        </div>;
    }
}

export default Block;