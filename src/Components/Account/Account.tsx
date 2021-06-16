import React from 'react';
import {account} from "../../Utils/Interfaces";
import "./Account.scss"

interface AccountProps {
    account: account
}

class Account extends React.Component<AccountProps, {}> {
    render() {
        return <div className={"account"}>
            <table className={"accountTable"}>
                <tr>
                    <td className={"id"}>{this.props.account.id}</td>
                    <td className={"privateKey"}>{this.props.account.privateKey}</td>
                    <td className={"address"}>{this.props.account.address}</td>
                    <td className={"balance"}>{this.props.account.balance}</td>
                </tr>
                <tr>
                    <td>ID</td>
                    <td>Private Key</td>
                    <td>Address</td>
                    <td>Balance</td>
                </tr>
            </table>
        </div>;
    }
}

export default Account;