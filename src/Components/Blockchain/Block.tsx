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
                <div className={"prevHash"}>{this.props.block?.prevHash}</div>
                <div className={"transactions"}>test</div>
                <div className={"nonce"}>{this.props.block?.nonce}</div>
                <div className={"confirmed"}>{confirmed}</div>
            </div>
        </div>;
    }
}

export default Block;