import React from "react";
import { transaction } from "../../Utils/Interfaces";
import "./Transaction.css";
import "../UpperList/UpperList.css";
import { Draggable } from "react-beautiful-dnd";
import { showError } from "../../Utils/ToastFunctions";

interface TransactionProps {
  transaction: transaction;
  numberOfAccounts: number;
  signFunction: any;
  removeSignatureFunction: any;
  index: number;
  addLogFunction: any;
}

interface transactionState {
  from: number;
  to: number;
  amount: number;
}

class Transaction extends React.Component<TransactionProps, {}> {
  componentDidMount() {
    let t = this.props.transaction;
    if (t.from !== undefined && t.to !== undefined && t.amount !== undefined) {
      this.setState({
        from: t.from,
        to: t.to,
        amount: t.amount,
      });
    }
  }

  state: transactionState = {
    from: 0,
    to: 0,
    amount: 0,
  };

  sign = () => {
    if (
      this.state.from !== -1 &&
      this.state.to !== -1 &&
      this.state.amount !== -1
    ) {
      let t = this.props.transaction;
      t.from = this.state.from;
      t.to = this.state.to;
      t.amount = this.state.amount;

      this.props.signFunction(t);
    } else {
      showError("All values must be set to sign a transaction!");
      this.props.addLogFunction({
        type: "error",
        message:
          "Transaction " +
          this.props.transaction.id +
          ": All values must be set to sign the transaction!",
      });
    }
  };

  render() {
    return (
      <Draggable
        draggableId={"transaction" + this.props.transaction.id}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <div
            className={
              "transaction listElement" +
              (snapshot.isDragging ? " transactionDragging" : "")
            }
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <table className={"transactionTable listTable"}>
              <tbody>
                <tr>
                  <td className={"id"}>{this.props.transaction.idString}</td>
                  <td
                    className={
                      "from" +
                      (!this.props.transaction.editable ? " biggerText" : "")
                    }
                  >
                    {this.props.transaction.editable ? (
                      <select
                        className={"selectStyle"}
                        value={this.state.from}
                        onChange={(v) => {
                          let newValue = parseInt(v.target.value);
                          if (this.state.from !== newValue) {
                            this.props.removeSignatureFunction(
                              this.props.transaction.id
                            );
                            this.setState({ from: newValue });
                          }
                        }}
                      >
                        {Array.from(
                          Array(this.props.numberOfAccounts).keys()
                        ).map((x) => {
                          return (
                            <option value={x} key={x}>
                              a{x}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      "a" + this.props.transaction.from
                    )}
                  </td>
                  <td
                    className={
                      "to" +
                      (!this.props.transaction.editable ? " biggerText" : "")
                    }
                  >
                    {this.props.transaction.editable ? (
                      <select
                        className={"selectStyle"}
                        value={this.state.to}
                        onChange={(v) => {
                          let newValue = parseInt(v.target.value);
                          if (this.state.to !== newValue) {
                            this.props.removeSignatureFunction(
                              this.props.transaction.id
                            );
                            this.setState({ to: newValue });
                          }
                        }}
                      >
                        {Array.from(
                          Array(this.props.numberOfAccounts).keys()
                        ).map((x) => {
                          return (
                            <option value={x} key={x}>
                              a{x}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      "a" + this.props.transaction.to
                    )}
                  </td>
                  <td className={"amount"}>
                    {this.props.transaction.editable ? (
                      <input
                        type="number"
                        className={"amountInput"}
                        min="0"
                        max="1000"
                        value={this.state.amount}
                        onChange={(event) => {
                          let val = parseInt(event.target.value);

                          if (!isNaN(val)) {
                            let oldValue = this.state.amount;
                            if (oldValue !== val) {
                              this.props.removeSignatureFunction(
                                this.props.transaction.id
                              );
                            }

                            this.setState({ amount: val });
                          }
                        }}
                      />
                    ) : (
                      this.props.transaction.amount
                    )}
                  </td>
                  <td
                    className={
                      "signature" +
                      (this.props.transaction.signed ? " smallText" : "")
                    }
                  >
                    {this.props.transaction.signed ? (
                      this.props.transaction.signature
                    ) : (
                      <div
                        className={"signButton button"}
                        onClick={() => this.sign()}
                      >
                        Sign
                      </div>
                    )}
                  </td>
                </tr>
                <tr className={"description"}>
                  <td>ID</td>
                  <td>From</td>
                  <td>To</td>
                  <td>Amount</td>
                  <td>Signature</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Draggable>
    );
  }
}

export default Transaction;
