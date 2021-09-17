import React from 'react';
import './UpperList.scss';
import { account, transaction } from "../../Utils/Interfaces";
import Account from "../Account/Account";
import Transaction from "../Transaction/Transaction";
import { Droppable } from "react-beautiful-dnd";

interface UpperListProps {
    title: string;
    accounts?: account[],
    transactions?: transaction[],
    transactionOrder?: number[],
    numberOfAccounts?: number,
    className?: string
    addFunction?: any
    signFunction?: any,
    removeSignatureFunction?: any,
    blockList?: boolean,
    droppableId: string,
    dropDisabled?: boolean,
    lastConfirmedBlock?: number,
    emptyText?: string,
    addLogFunction: any
}

function UpperList(props: UpperListProps) {
    const printAccountList = (accounts: account[]) => {
        let lastConfirmedBlock = props.lastConfirmedBlock ?? -1;

        if (accounts.length === 0) {
            return <div style={{ color: "#575757" }}>{props.emptyText}</div>
        }

        return accounts.map(function (value) {
            return <Account account={value} key={value.id} lastConfirmedBlock={lastConfirmedBlock} />;
        });
    }

    const printTransactionList = (transactions: transaction[]) => {
        let numberOfAccounts = 0;
        if (props?.numberOfAccounts) {
            numberOfAccounts = props.numberOfAccounts
        }
        let transactionOrder = props.transactionOrder;
        if (transactionOrder === undefined) transactionOrder = [];
        let signFunction = props.signFunction;
        let removeSignatureFunction = props.removeSignatureFunction;

        if (transactionOrder.length === 0) {
            return <div style={{ color: "#575757" }}>{props.emptyText}</div>
        }

        let addLogFunction = props.addLogFunction;

        return (transactionOrder.map(function (value, index) {
            return <Transaction transaction={transactions[value]} numberOfAccounts={numberOfAccounts} key={value}
                signFunction={signFunction} removeSignatureFunction={removeSignatureFunction} index={index} addLogFunction={addLogFunction} />
        }));
    }

        let printFunction: any = (err: any) => { return <div className={"listError"}>{err}</div> };
        let arg: any = "Error";
        if (props.accounts) {
            printFunction = printAccountList;
            arg = props.accounts;
        } else if (props.transactions) {
            printFunction = printTransactionList;
            arg = props.transactions
        }

        let addFunction = props.addFunction;
        if (!addFunction) addFunction = () => { console.log("Error: function is not defined") };

        return (<div className={"upperListContainer " + props.className}>
            {
                props.blockList ?
                    ""
                    :
                    <div className={"upperListTitle"}>{props.title}</div>

            }
            <Droppable droppableId={props.droppableId} isDropDisabled={props.dropDisabled}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={"upperList"}
                        style={{ backgroundColor: snapshot.isDraggingOver ? "rgba(255,255,255,0.05)" : "" }}
                    >
                        {printFunction(arg)}
                        {provided.placeholder}
                    </div>
                )}</Droppable>
            {
                props.blockList ?
                    ""
                    :
                    <div className={"addButtonContainer"}>
                        <div className={"addButton button"} onClick={() => addFunction()}>
                            Add
                        </div>
                    </div>
            }
        </div>);
}

export default UpperList;