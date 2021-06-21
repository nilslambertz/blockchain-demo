import React from 'react';
import './UpperList.scss';
import {account, settings, transcation} from "../../Utils/Interfaces";
import Account from "../Account/Account";
import Transaction from "../Transaction/Transaction";

interface UpperListProps {
    title: string;
    accounts?: account[],
    transactions?: transcation[],
    transactionOrder?: number[],
    numberOfAccounts?: number,
    settings?: settings[],
    className?: string
    addFunction?: any
    signFunction?: any,
    removeSignatureFunction?: any,
    placeholder?: any,
    innerRef?: any,
    blockList?: boolean,
    isDraggingOver?: any
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
            {
                this.props.blockList ?
                    ""
                    :
                    <div className={"upperListTitle"}>{this.props.title}</div>

            }
                        <div className={"upperList"} style={{backgroundColor: this.props.isDraggingOver ? "rgba(255,255,255,0.05)" : ""}}>
                            {printFunction(arg)}
                            {p}
                        </div>
            {
                this.props.blockList ?
                    ""
                    :
            <div className={"addButtonContainer"}>
                <div className={"addButton"} onClick={() => addFunction()}>
                    Add
                </div>
            </div>
            }
        </div>);
    }

    printAccountList(accounts : account[]) {
        return accounts.map(function (value, index, array) {
            return <Account account={value} key={value.id} />;
        });
    }

    printTransactionList = (transactions : transcation[]) => {
        let numberOfAccounts = 0;
        if(this.props?.numberOfAccounts) {
            numberOfAccounts = this.props.numberOfAccounts
        }
        let transactionOrder = this.props.transactionOrder;
        if(transactionOrder === undefined) transactionOrder = [];
        let signFunction = this.props.signFunction;
        let removeSignatureFunction = this.props.removeSignatureFunction;

        return (transactionOrder.map(function (value, index, array) {
            return <Transaction transaction={transactions[value]} numberOfAccounts={numberOfAccounts} key={value}
                                signFunction={signFunction} removeSignatureFunction={removeSignatureFunction} index={index}/>
        }));
    }
}

export default UpperList;