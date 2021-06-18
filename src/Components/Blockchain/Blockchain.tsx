import React from 'react';
import "./Blockchain.scss";
import {block} from "../../Utils/Interfaces";
import Block from "./Block";
import {ReactComponent as Arrow} from "../../res/arrowright.svg";

interface BlockchainProps {
    blocks: block[]
}

class Blockchain extends React.Component<BlockchainProps, {}> {
    render() {
        return <div className={"blockchain"}>
            {this.printBlocks()}
        </div>;
    }

    printBlocks = () => {
        return this.props.blocks.map(function (value, index, array) {
            return (
                <React.Fragment>
                    <Block block={value} />
                    {index !== array.length -1 ? <div className={"arrows"} ><Arrow /></div> : "" }
                </React.Fragment>
            );
        });
    }
}

export default Blockchain;