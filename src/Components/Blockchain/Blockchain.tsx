import React from "react";
import "./Blockchain.css";
import { Block, Transaction } from "../../Utils/Interfaces";
import BlockElem from "./BlockElem";
import { ReactComponent as Arrow } from "../../res/arrowright.svg";

interface BlockchainProps {
  blocks: Block[];
  transactions: Transaction[];
  confirmFunction: any;
  addLogFunction: any;
}

class Blockchain extends React.Component<BlockchainProps, {}> {
  render() {
    return <div className={"blockchain"}>{this.printBlocks()}</div>;
  }
  printBlocks = () => {
    let transactions = this.props.transactions;
    let confirmFunction = this.props.confirmFunction;
    let addLogFunction = this.props.addLogFunction;

    return this.props.blocks.map(function (value, index, array) {
      return (
        <React.Fragment key={index}>
          <BlockElem
            block={value}
            transactions={transactions}
            confirmFunction={confirmFunction}
            addLogFunction={addLogFunction}
          />
          {index !== array.length - 1 ? (
            <div className={"arrows"}>
              <Arrow />
            </div>
          ) : (
            ""
          )}
        </React.Fragment>
      );
    });
  };
}

export default Blockchain;
