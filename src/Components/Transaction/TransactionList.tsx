import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { TRANSACTION_LIST_DROPPABLE_ID } from "../../shared/Constants";
import { Transaction } from "../../shared/Types";
import Button from "../shared-components/Button";
import TransactionElem from "./TransactionElem";

interface TransactionListProps {
  transactions: Transaction[];
  transactionOrder: number[];
  numberOfAccounts: number;
  hideTitleAndButton?: boolean;
  dropDisabled?: boolean;
  emptyText: string;
  droppableId: string;
  formsDisabled?: boolean;
  onAddTransaction?: () => void;
  onUpdateTransaction?: (transaction: Transaction) => void;
  onSign?: (transaction: Transaction) => void;
  onRemoveSignature?: (id: number) => void;
}

export default function TransactionList({
  dropDisabled,
  hideTitleAndButton,
  numberOfAccounts,
  transactionOrder,
  emptyText,
  transactions,
  droppableId,
  formsDisabled,
  onAddTransaction,
  onUpdateTransaction,
  onRemoveSignature,
  onSign,
}: TransactionListProps) {
  return (
    <div className="h-full relative flex-1 flex flex-col overflow-hidden items-stretch">
      <div
        className={
          "flex-1 px-2 overflow-y-scroll overflow-x-hidden flex flex-col items-stretch gap-2 " +
          (hideTitleAndButton ? "" : "pb-16")
        }
      >
        {!hideTitleAndButton && (
          <div className="sticky top-0 w-full text-center text-2xl py-2 bg-base">
            transactions
          </div>
        )}
        <Droppable droppableId={droppableId} isDropDisabled={dropDisabled}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={
                "relative flex-1 p-2 rounded-md flex flex-col items-stretch gap-2 bg-white transition-colors " +
                (snapshot.isDraggingOver ? "bg-opacity-10" : "bg-opacity-0")
              }
            >
              {transactionOrder?.length === 0 && emptyText && (
                <div className="absolute top-0 w-full text-center opacity-50">
                  {emptyText}
                </div>
              )}
              {transactionOrder.map((arrayIndex, index) => {
                return (
                  <TransactionElem
                    transaction={transactions[arrayIndex]}
                    numberOfAccounts={numberOfAccounts}
                    key={arrayIndex}
                    signFunction={onSign}
                    removeSignatureFunction={onRemoveSignature}
                    onUpdateTransaction={onUpdateTransaction}
                    formsDisabled={formsDisabled ?? false}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      {!hideTitleAndButton && (
        <div className="absolute w-full flex flex-row justify-center bottom-3">
          <Button
            text="Add"
            onClick={onAddTransaction}
            extraClasses="btn-success"
          ></Button>
        </div>
      )}
    </div>
  );
}
