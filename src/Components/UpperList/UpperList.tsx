import React from 'react';
import './UpperList.scss';
import {account, settings, transcation} from "../../Utils/Interfaces";
import Account from "../Account/Account";

interface UpperListProps {
    title: string;
    accounts?: account[],
    transactions?: transcation[],
    settings?: settings[]
}

class UpperList extends React.Component<UpperListProps, {}> {
    render() {
        console.log("XDDD");

        let printFunction : any = (err : any) => {return <div className={"listError"}>{err}</div>};
        let arg : any = "Error";
        if(this.props.accounts) {
            printFunction = this.printAccountList;
            arg = this.props.accounts;
        }

        return <div className={"upperList"}>
            <div className={"upperListTitle"}>{this.props.title}</div>
            <div>{printFunction(arg)}</div>
        </div>;
    }

    printAccountList(accounts : account[]) {
        console.log("DDXCSADC");
        return accounts.map(function (value, index, array) {
            return <Account account={value} />;
        });
    }
}

export default UpperList;