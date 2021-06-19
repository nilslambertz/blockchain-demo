import React from 'react';
import {transcation} from "../../Utils/Interfaces";
import "./Transaction.scss"
import "../UpperList/UpperList.scss";
import Select from "react-select";
import NumericInput from "react-numeric-input";

interface TransactionProps {
    transaction: transcation,
    numberOfAccounts: number,
    signFunction: any
}

const selectStyle = {
    option: (provided : any, state : any) =>  ({
        ...provided,
        color: "black",
        fontSize: "110%",
        backgroundColor: state.isFocused ? "#3d73e2" : "white"
    })
}

const inputStyle = {
    input: {
        width: "100%",
        height: "100%"
    }
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
        })

        return <div className={"transaction listElement"}>
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
                                        let newValue = -1;
                                        if(value != null) {
                                            newValue = value.value;
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
                                        let newValue = -1;
                                        if(value != null) {
                                            newValue = value.value;
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
                                <NumericInput
                                    min={0}
                                    max={1000}
                                    precision={0}
                                    style={inputStyle}
                                    defaultValue={0}
                                    onChange={value => {
                                        let newValue = -1;
                                        if(value != null) {
                                            newValue = value;
                                        }

                                        this.setState({amount: newValue});
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
        </div>;
    }
}

export default Transaction;