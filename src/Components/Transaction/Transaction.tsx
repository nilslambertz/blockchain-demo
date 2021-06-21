import React from 'react';
import {transcation} from "../../Utils/Interfaces";
import "./Transaction.scss"
import "../UpperList/UpperList.scss";
import Select from "react-select";
import {Draggable} from "react-beautiful-dnd";

interface TransactionProps {
    transaction: transcation,
    numberOfAccounts: number,
    signFunction: any,
    removeSignatureFunction: any,
    index: number
}

const selectStyle = {
    option: (provided : any, state : any) =>  ({
        ...provided,
        color: "black",
        fontSize: "110%",
        backgroundColor: state.isFocused ? "#3d73e2" : "white"
    })
}

interface transactionState {
    from: number,
    to: number
    amount: number
}

class Transaction extends React.Component<TransactionProps, {}> {
    state : transactionState = {
        from: -1,
        to: -1,
        amount: 0
    }

    sign = () => {
        if(this.state.from !== -1 && this.state.to !== -1 && this.state.amount !== -1) {
            let t = this.props.transaction;
            t.from = this.state.from;
            t.to = this.state.to;
            t.amount = this.state.amount

            this.props.signFunction(t);
        } else {
            console.log("Error: One of the transaction-values isn't set!");
            // TODO
        }
    }

    render() {
        let options = Array.from({length: this.props.numberOfAccounts}, (item, index) => {
            return {value: index, label: index};
        });

        return <Draggable draggableId={"transaction" + this.props.transaction.id} index={this.props.index}>
            {(provided, snapshot) => (
                    <div className={"transaction listElement"}
                         ref={provided.innerRef}
                         {...provided.draggableProps}
                         {...provided.dragHandleProps}>
                        <table className={"transactionTable listTable"}>
                            <tbody>
                            <tr>
                                <td className={"id"}>{this.props.transaction.id}</td>
                                <td className={"from smallText"}>
                                    {
                                        this.props.transaction.editable ?
                                            <Select
                                                options={options}
                                                styles={selectStyle}
                                                onChange={(value => {
                                                    let oldValue = this.state.from;
                                                    let newValue = -1;
                                                    if (value != null) {
                                                        newValue = value.value;
                                                    }
                                                    if (oldValue !== newValue) {
                                                        this.props.removeSignatureFunction(this.props.transaction.id);
                                                    }

                                                    this.setState({from: newValue});
                                                })}
                                            />
                                            :
                                            this.props.transaction.from
                                    }
                                </td>
                                <td className={"to smallText"}>
                                    {
                                        this.props.transaction.editable ?
                                            <Select
                                                options={options}
                                                styles={selectStyle}
                                                onChange={(value => {
                                                    let oldValue = this.state.to;
                                                    let newValue = -1;
                                                    if (value != null) {
                                                        newValue = value.value;
                                                    }
                                                    if (oldValue !== newValue) {
                                                        this.props.removeSignatureFunction(this.props.transaction.id);
                                                    }

                                                    this.setState({to: newValue});
                                                })}
                                            />
                                            :
                                            this.props.transaction.to
                                    }
                                </td>
                                <td className={"amount"}>
                                    {
                                        this.props.transaction.editable ?
                                            <input
                                                type="number"
                                                className={"amountInput"}
                                                min="0"
                                                max="1000"
                                                value={this.state.amount}
                                                onChange={(event) => {
                                                    let val = parseInt(event.target.value);

                                                    if(!isNaN(val)) {
                                                        let oldValue = this.state.amount;
                                                        if (oldValue !== val) {
                                                            this.props.removeSignatureFunction(this.props.transaction.id);
                                                        }

                                                        this.setState({amount: val});
                                                    }
                                                }}
                                            />
                                            :
                                            this.props.transaction.amount
                                    }
                                </td>
                                <td className={"signature" + (this.props.transaction.signed ? " smallText" : "")}>
                                    {
                                        this.props.transaction.signed ?
                                            this.props.transaction.signature
                                            :
                                            <div className={"signButton"} onClick={() => this.sign()}>Sign</div>
                                    }
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
        </Draggable>;
    }
}

export default Transaction;