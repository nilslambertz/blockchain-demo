import React from "react";
import "./Blockchain.scss";
import { block, transaction, validStartHash } from "../../Utils/Interfaces";
import UpperList from "../UpperList/UpperList";

interface BlockProps {
  block: block;
  transactions: transaction[];
  confirmFunction: any;
  addLogFunction: any;
}

class Block extends React.Component<BlockProps, {}> {
  printTransactionList = () => {
    return (
      <UpperList
        droppableId={"block" + this.props.block.id}
        title={"transactions"}
        transactions={this.props.transactions}
        transactionOrder={this.props.block.transactions}
        className={"transactionListContainer"}
        emptyText={"Drag and drop transactions here!"}
        blockList={true}
        addLogFunction={this.props.addLogFunction}
      />
    );
  };

  confirmFunction = () => {
    this.props.confirmFunction(this.props.block.id);
  };

  render() {
    return (
      <div className={"blockContainer"}>
        <div className={"block"}>
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
          <div className={"confirmContainer"}>
            {this.props.block.confirmed ? (
              <span className={"confirmedString"}>confirmed</span>
            ) : (
              <div
                className={"confirmButton button"}
                onClick={() => this.confirmFunction()}
              >
                Confirm
              </div>
            )}
            <div className={"blockDescription"}>Confirmation</div>
          </div>
          <div className={"hash blockSmallText"}>
            {this.props.block.confirmed ? (
              <span>
                <span className={"confirmedString"}>{validStartHash}</span>
                {this.props.block?.hash?.substr(validStartHash.length)}
              </span>
            ) : (
              this.props.block?.hash
            )}
            <div className={"blockDescription"}>Hash</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Block;
