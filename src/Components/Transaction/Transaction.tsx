import React from 'react';
import {transcation} from "../../Utils/Interfaces";
import "./Transaction.scss"
import "../UpperList/UpperList.scss";
import Select from "react-select";
import NumericInput from "react-numeric-input";

interface TransactionProps {
    transaction: transcation,
    numberOfAccounts: number
}

const selectStyle = {
    option: (provided : any, state : any) =>  ({
        ...provided,
        color: "black",
        backgroundColor: state.isFocused ? "#3d73e2" : "white"
    })
}

const inputStyle = {
    input: {
        width: "130px",
        height: "100%"
    }
}

class Transaction extends React.Component<TransactionProps, {}> {
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
                                />
                                :
                                this.props.transaction.to
                        }
                    </td>
                    <td className={"amount"}>
                        {
                            this.props.transaction.editable ?
                                <NumericInput min={0} max={1000} precision={2} style={inputStyle}/>
                                :
                                this.props.transaction.amount
                        }
                    </td>
                    <td className={"signature"}>
                        {
                            this.props.transaction.signed ?
                                this.props.transaction.signature
                                :
                                <div className={"signButton"}>Sign</div>
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