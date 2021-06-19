import React, {createRef, useRef} from 'react';
import './UpperList.scss';
import {account, settings, transcation} from "../../Utils/Interfaces";
import Account from "../Account/Account";
import Transaction from "../Transaction/Transaction";
import {DragDropContext, Droppable} from "react-beautiful-dnd";

interface UpperListProps {
    title: string;
    accounts?: account[],
    transactions?: transcation[],
    numberOfAccounts?: number,
    settings?: settings[],
    className?: string
    addFunction?: any
    signFunction?: any,
    removeSignatureFunction?: any,
    placeholder?: any,
    innerRef?: any
}

class UpperList extends React.Component<UpperListProps, {}> {
    setRef = (ref : any) => {
        if(this.props.innerRef) this.props.innerRef(ref);
    }

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

        let p = "";
        if(this.props.placeholder) p = this.props.placeholder;

        return (<div className={"upperListContainer " + this.props.className} ref={this.setRef}>
            <div className={"upperListTitle"}>{this.props.title}</div>
                        <div className={"upperList"}>
                            {printFunction(arg)}
                            {p}
                        </div>

            <div className={"addButtonContainer"}>
                <div className={"addButton"} onClick={() => addFunction()}>
                    Add
                </div>
            </div>
        </div>);
    }

    printAccountList(accounts : account[]) {
        return accounts.map(function (value, index, array) {
            return <Account account={value} key={value.id} />;
        });
    }

    onDragEnd = () => {
        // TODO
    }

    printTransactionList = (transactions : transcation[]) => {
        let numberOfAccounts = 0;
        if(this.props?.numberOfAccounts) {
            numberOfAccounts = this.props.numberOfAccounts
        }
        let signFunction = this.props.signFunction;
        let removeSignatureFunction = this.props.removeSignatureFunction;

        return (transactions.map(function (value, index, array) {
            return <Transaction transaction={value} numberOfAccounts={numberOfAccounts} key={value.id}
                                signFunction={signFunction} removeSignatureFunction={removeSignatureFunction} index={index}/>
        }));
    }
}

export default UpperList;