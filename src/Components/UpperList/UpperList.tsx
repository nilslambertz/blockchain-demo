import React from "react";
import "./UpperList.css";
import { Account, Transaction } from "../../Utils/Interfaces";
import AccountElem from "../Account/AccountElem";
import TransactionElem from "../Transaction/TransactionElem";
import { Droppable } from "react-beautiful-dnd";

interface UpperListProps {
  title: string;
  accounts?: Account[];
  transactions?: Transaction[];
  transactionOrder?: number[];
  numberOfAccounts?: number;
  className?: string;
  addFunction?: any;
  signFunction?: any;
  removeSignatureFunction?: any;
  blockList?: boolean;
  droppableId: string;
  dropDisabled?: boolean;
  lastConfirmedBlock?: number;
  emptyText?: string;
  addLogFunction: any;
}

class UpperList extends React.Component<UpperListProps, {}> {
  render() {
    let printFunction: any = (err: any) => {
      return <div className={"listError"}>{err}</div>;
    };
    let arg: any = "Error";
    if (this.props.accounts) {
      printFunction = this.printAccountList;
      arg = this.props.accounts;
    } else if (this.props.transactions) {
      printFunction = this.printTransactionList;
      arg = this.props.transactions;
    }

    let addFunction = this.props.addFunction;
    if (!addFunction)
      addFunction = () => {
        console.log("Error: function is not defined");
      };

    return (
      <div className={"upperListContainer " + this.props.className}>
        {this.props.blockList ? (
          ""
        ) : (
          <div className={"upperListTitle"}>{this.props.title}</div>
        )}
        <Droppable
          droppableId={this.props.droppableId}
          isDropDisabled={this.props.dropDisabled}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={"upperList"}
              style={{
                backgroundColor: snapshot.isDraggingOver
                  ? "rgba(255,255,255,0.05)"
                  : "",
              }}
            >
              {printFunction(arg)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {this.props.blockList ? (
          ""
        ) : (
          <div className={"addButtonContainer"}>
            <div className={"addButton button"} onClick={() => addFunction()}>
              Add
            </div>
          </div>
        )}
      </div>
    );
  }

  printAccountList = (accounts: Account[]) => {
    let lastConfirmedBlock = this.props.lastConfirmedBlock ?? -1;

    if (accounts.length === 0) {
      return <div style={{ color: "#575757" }}>{this.props.emptyText}</div>;
    }

    return accounts.map(function (value) {
      return (
        <AccountElem
          account={value}
          key={value.id}
          lastConfirmedBlock={lastConfirmedBlock}
        />
      );
    });
  };

  printTransactionList = (transactions: Transaction[]) => {
    let numberOfAccounts = 0;
    if (this.props?.numberOfAccounts) {
      numberOfAccounts = this.props.numberOfAccounts;
    }
    let transactionOrder = this.props.transactionOrder;
    if (transactionOrder === undefined) transactionOrder = [];
    let signFunction = this.props.signFunction;
    let removeSignatureFunction = this.props.removeSignatureFunction;

    if (transactionOrder.length === 0) {
      return <div style={{ color: "#575757" }}>{this.props.emptyText}</div>;
    }

    return transactionOrder.map(function (value, index) {
      return (
        <TransactionElem
          transaction={transactions[value]}
          numberOfAccounts={numberOfAccounts}
          key={value}
          signFunction={signFunction}
          removeSignatureFunction={removeSignatureFunction}
          index={index}
        />
      );
    });
  };
}

export default UpperList;
