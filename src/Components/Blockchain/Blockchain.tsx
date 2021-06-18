import React from 'react';
import "./Blockchain.scss";
import {block} from "../../Utils/Interfaces";
import Block from "./Block";

interface BlockchainProps {
    blocks?: block[]
}

class Blockchain extends React.Component<BlockchainProps, {}> {
    render() {
        return <div className={"blockchain"}>
            <Block /><div className={"arrows"} /> <Block/>
        </div>;
    }
}

export default Blockchain;