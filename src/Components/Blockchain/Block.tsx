import React from 'react';
import "./Blockchain.scss";
import {block} from "../../Utils/Interfaces";

interface BlockProps {
    block: block
}

class Block extends React.Component<BlockProps, {}> {
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
                        {this.props.block.transactions?.length === 0 ?
                            "Drag and drop transactions here!"
                            :
                            "Error"
                        }
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