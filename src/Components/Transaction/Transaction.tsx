import React, { useEffect, useState } from 'react';
import { logElem, transaction } from "../../Utils/Interfaces";
import "./Transaction.scss"
import "../UpperList/UpperList.scss";
import { Draggable } from "react-beautiful-dnd";
import { showError } from "../../Utils/ToastFunctions";

interface TransactionProps {
    transaction: transaction,
    numberOfAccounts: number,
    signFunction: (t: transaction) => void,
    removeSignatureFunction: (id: number) => void,
    index: number,
    addLogFunction: (log: logElem) => void
}

function Transaction(props: TransactionProps) {
    const [from, setFrom] = useState(props.transaction.from);
    const [to, setTo] = useState(props.transaction.to);
    const [amount, setAmount] = useState(props.transaction.amount);

    useEffect(() => {
        if(props.numberOfAccounts > 0 && from === undefined && to === undefined) {
            setFrom(0);
            setTo(0);
        }
    })

    const sign = () => {
        if (from !== -1 && to !== -1 && amount !== -1) {
            let t = props.transaction;
            t.from = from;
            t.to = to;
            t.amount = amount;

            props.signFunction(t);
        } else {
            showError("All values must be set to sign a transaction!");
            props.addLogFunction({
                type: "error",
                message: "Transaction " + props.transaction.id + ": All values must be set to sign the transaction!"
            })
        }
    }

    return (<Draggable draggableId={"transaction" + props.transaction.id} index={props.index}>
            {(provided, snapshot) => (
                <div className={"transaction listElement" + (snapshot.isDragging ? " transactionDragging" : "")}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <table className={"transactionTable listTable"}>
                        <tbody>
                            <tr>
                                <td className={"id"}>{props.transaction.idString}</td>
                                <td className={"from" + (!props.transaction.editable ? " biggerText" : "")}>
                                    {
                                        props.transaction.editable ?
                                            <select className={"selectStyle"}
                                                value={from}
                                                onChange={(v) => {
                                                    let newValue = parseInt(v.target.value);
                                                    if (from !== newValue) {
                                                        props.removeSignatureFunction(props.transaction.id);
                                                        setFrom(newValue);
                                                    }
                                                }}>
                                                {
                                                    Array.from(Array(props.numberOfAccounts).keys()).map(x => {
                                                        return <option value={x} key={x}>a{x}</option>
                                                    })}
                                            </select>
                                            :
                                            "a" + props.transaction.from
                                    }
                                </td>
                                <td className={"to" + (!props.transaction.editable ? " biggerText" : "")}>
                                    {
                                        props.transaction.editable ?
                                            <select className={"selectStyle"}
                                                value={to}
                                                onChange={(v) => {
                                                    let newValue = parseInt(v.target.value);
                                                    if (to !== newValue) {
                                                        props.removeSignatureFunction(props.transaction.id);
                                                        setTo(newValue);
                                                        console.log(newValue);
                                                    }
                                                }}>
                                                {
                                                    Array.from(Array(props.numberOfAccounts).keys()).map(x => {
                                                        return <option value={x} key={x}>a{x}</option>
                                                    })}
                                            </select>
                                            :
                                            "a" + props.transaction.to
                                    }
                                </td>
                                <td className={"amount"}>
                                    {
                                        props.transaction.editable ?
                                            <input
                                                type="number"
                                                className={"amountInput"}
                                                min="0"
                                                max="1000"
                                                value={amount}
                                                onChange={(event) => {
                                                    let val = parseInt(event.target.value);

                                                    if (!isNaN(val)) {
                                                        let oldValue = amount;
                                                        if (oldValue !== val) {
                                                            props.removeSignatureFunction(props.transaction.id);
                                                        }

                                                        setAmount(val);
                                                    }
                                                }}
                                            />
                                            :
                                            props.transaction.amount
                                    }
                                </td>
                                <td className={"signature" + (props.transaction.signed ? " smallText" : "")}>
                                    {
                                        props.transaction.signed ?
                                            props.transaction.signature
                                            :
                                            <div className={"signButton button"} onClick={() => sign()}>Sign</div>
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
                </div>
            )}
        </Draggable>);
}

export default Transaction;