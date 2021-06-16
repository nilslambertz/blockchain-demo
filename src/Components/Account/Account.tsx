import React from 'react';
import {account} from "../../Utils/Interfaces";

interface AccountProps {
    account: account
}

class Account extends React.Component<AccountProps, {}> {
    render() {
        return <div className={"account"}>
            <div>{this.props.account.privateKey}</div>
        </div>;
    }
}

export default Account;