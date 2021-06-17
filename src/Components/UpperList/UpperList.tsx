import React from 'react';
import './UpperList.scss';
import {account, settings, transcation} from "../../Utils/Interfaces";
import Account from "../Account/Account";
import Transaction from "../Transaction/Transaction";

interface UpperListProps {
    title: string;
    accounts?: account[],
    transactions?: transcation[],
    settings?: settings[],
    className?: string
    addFunction?: any
}

class UpperList extends React.Component<UpperListProps, {}> {
    render() {
        let printFunction : any = (err : any) => {return <div className={"listError"}>{err}</div>};
        let arg : any = "Error";
        if(this.props.accounts) {
            printFunction = this.printAccountList;
            arg = this.props.accounts;
        } else if(this.props.transactions) {
            printFunction = this.printTransactionList;
            arg = this.props.transactions
        }

        let addFunction = this.props.addFunction;
        if(!addFunction) addFunction = () => {console.log("Error: function is not defined")};

        return <div className={"upperListContainer " + this.props.className}>
            <div className={"upperListTitle"}>{this.props.title}</div>
            <div className={"upperList"}>
                {printFunction(arg)}
            </div>
            <div className={"addButtonContainer"}>
                <div className={"addButton"} onClick={() => addFunction()}>
                    Add
                </div>
            </div>
        </div>;
    }

    printAccountList(accounts : account[]) {
        return accounts.map(function (value, index, array) {
            return <Account account={value} key={value.id} />;
        });
    }

    printTransactionList(transactions : transcation[]) {
        return transactions.map(function (value, index, array) {
            return <Transaction transaction={value} key={value.id} />;
        });
    }
}

export default UpperList;