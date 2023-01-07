import React, { useEffect, useState } from "react";
import { Transaction } from "../../Utils/Interfaces";
import { Draggable } from "react-beautiful-dnd";
import Button from "../shared-components/Button";
import GridElem from "../shared-components/GridElem";
import {
  BORDER_COLOR,
  TRANSACTION_DRAGGABLE_PREFIX,
} from "../../shared/constants";

interface TransactionElemProps {
  transaction: Transaction;
  numberOfAccounts?: number;
  index: number;
  formsDisabled: boolean;
  signFunction?: (t: Transaction) => void;
  removeSignatureFunction?: (id: number) => void;
}

export default function TransactionElem({
  transaction,
  numberOfAccounts,
  formsDisabled,
  signFunction,
  removeSignatureFunction,
  index,
}: TransactionElemProps) {
  const [from, setFrom] = useState(transaction.from);
  const [to, setTo] = useState(transaction.to);
  const [amount, setAmount] = useState(transaction.amount ?? 0);

  useEffect(() => {
    if (numberOfAccounts && numberOfAccounts > 0) {
      if (!transaction.from) setFrom(0);
      if (!transaction.to) setTo(0);
    }
  }, [numberOfAccounts]);

  const sign = () => {
    signFunction?.({ ...transaction, from, to, amount });
  };

  return (
    <Draggable
      draggableId={TRANSACTION_DRAGGABLE_PREFIX + transaction.id}
      index={index}
    >
      {(provided) => (
        <div
          className={"w-full bg-base grid grid-cols-7 border " + BORDER_COLOR}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <GridElem>{transaction.idString}</GridElem>
          <GridElem extraClasses="text-2xs">
            <TransactionSelect
              disabled={formsDisabled}
              numberOfAccounts={numberOfAccounts}
              value={from}
              onNewValue={(newValue) => {
                if (from !== newValue) {
                  removeSignatureFunction?.(transaction.id);
                  setFrom(newValue);
                }
              }}
            ></TransactionSelect>
          </GridElem>
          <GridElem extraClasses="text-2xs">
            <TransactionSelect
              disabled={formsDisabled}
              numberOfAccounts={numberOfAccounts}
              value={to}
              onNewValue={(newValue) => {
                if (to !== newValue) {
                  removeSignatureFunction?.(transaction.id);
                  setTo(newValue);
                }
              }}
            ></TransactionSelect>
          </GridElem>
          <GridElem>
            <input
              type="number"
              className="w-full input input-sm"
              min="0"
              value={amount}
              onChange={(event) => {
                let val = parseInt(event.target.value);

                if (!isNaN(val)) {
                  let oldValue = amount;
                  if (oldValue !== val) {
                    removeSignatureFunction?.(transaction.id);
                  }

                  setAmount(val);
                }
              }}
              disabled={formsDisabled}
            />
          </GridElem>
          <GridElem
            hideBorder={true}
            extraClasses="col-span-3 text-2xs text-left"
          >
            {transaction.signed ? (
              transaction.signature
            ) : (
              <Button
                extraClasses="btn-primary"
                text="Sign"
                onClick={sign}
              ></Button>
            )}
          </GridElem>
          <div
            className={
              "col-span-7 h-0 border-b border-opacity-50 " + BORDER_COLOR
            }
          ></div>
          <GridElem extraClasses="text-xs text-opacity-50">ID</GridElem>
          <GridElem extraClasses="text-xs text-opacity-50">From</GridElem>
          <GridElem extraClasses="text-xs text-opacity-50">To</GridElem>
          <GridElem extraClasses="text-xs text-opacity-50">Amount</GridElem>
          <GridElem
            extraClasses="col-span-3 text-xs text-opacity-50"
            hideBorder={true}
          >
            Signature
          </GridElem>
        </div>
      )}
    </Draggable>
  );
}

interface TransactionSelectProps {
  value?: number;
  numberOfAccounts?: number;
  onNewValue: (newValue: number) => void;
  disabled: boolean;
}

export const TransactionSelect = ({
  numberOfAccounts,
  onNewValue,
  value,
  disabled,
}: TransactionSelectProps) => (
  <select
    className="select select-sm"
    value={value}
    onChange={(v) => {
      let newValue = parseInt(v.target.value);
      if (!Number.isNaN(newValue) && newValue !== undefined) {
        onNewValue(newValue);
      }
    }}
    disabled={disabled}
  >
    {Array.from(Array(numberOfAccounts).keys()).map((x) => {
      return (
        <option value={x} key={x}>
          a{x}
        </option>
      );
    })}
  </select>
);
