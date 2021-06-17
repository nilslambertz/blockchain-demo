import React from 'react';
import {transcation} from "../../Utils/Interfaces";
import "./Transaction.scss"
import "../UpperList/UpperList.scss"

interface TransactionProps {
    transaction: transcation
}

class Transaction extends React.Component<TransactionProps, {}> {
    render() {
        return <div className={"transaction listElement"}>
            <table className={"transactionTable listTable"}>
                <tbody>
                <tr>
                    <td className={"id"}>{this.props.transaction.id}</td>
                    <td className={"from smallText"}>{this.props.transaction.from}</td>
                    <td className={"to smallText"}>{this.props.transaction.to}</td>
                    <td className={"balance"}>{this.props.transaction.amount}</td>
                    <td className={"balance"}>{this.props.transaction.signature}</td>
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