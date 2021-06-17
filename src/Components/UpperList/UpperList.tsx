import React from 'react';
import './UpperList.scss';
import {account, settings, transcation} from "../../Utils/Interfaces";
import Account from "../Account/Account";

interface UpperListProps {
    title: string;
    accounts?: account[],
    transactions?: transcation[],
    settings?: settings[],
    className?: string
}

class UpperList extends React.Component<UpperListProps, {}> {
    render() {
        let printFunction : any = (err : any) => {return <div className={"listError"}>{err}</div>};
        let arg : any = "Error";
        if(this.props.accounts) {
            printFunction = this.printAccountList;
            arg = this.props.accounts;
        }

        return <div className={"upperListContainer " + this.props.className}>
            <div className={"upperListTitle"}>{this.props.title}</div>
            <div className={"upperList"}>{printFunction(arg)}</div>
        </div>;
    }

    printAccountList(accounts : account[]) {
        return accounts.map(function (value, index, array) {
            return <Account account={value} />;
        });
    }
}

export default UpperList;