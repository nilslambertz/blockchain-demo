import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { TRANSACTION_LIST_DROPPABLE_ID } from "../../shared/constants";
import { Transaction } from "../../Utils/Interfaces";
import Button from "../shared-components/Button";
import TransactionElem from "./TransactionElem";

interface TransactionListProps {
  transactions: Transaction[];
  unusedTransactions: number[];
  numberOfAccounts: number;
  hideTitle?: boolean;
  dropDisabled?: boolean;
  emptyText: string;
  droppableId: string;
  onAddTransaction: () => void;
  onSign: (transaction: Transaction) => void;
  onRemoveSignature: (id: number) => void;
}

export default function TransactionList({
  dropDisabled,
  hideTitle,
  numberOfAccounts,
  unusedTransactions,
  emptyText,
  transactions,
  droppableId,
  onAddTransaction,
  onRemoveSignature,
  onSign,
}: TransactionListProps) {
  return (
    <div className="relative flex-1 flex flex-col overflow-hidden items-stretch">
      <div className="flex-1 px-2 overflow-y-scroll overflow-x-hidden flex flex-col items-stretch gap-2 pb-16">
        {!hideTitle && (
          <div className="sticky top-0 w-full text-center text-2xl py-2 bg-base">
            transactions
          </div>
        )}
        {transactions?.length === 0 && emptyText && (
          <div className="w-full text-center opacity-50">{emptyText}</div>
        )}
        <Droppable droppableId={droppableId} isDropDisabled={dropDisabled}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={
                "p-2 rounded-md flex flex-col items-stretch gap-2 bg-white transition-colors " +
                (snapshot.isDraggingOver ? "bg-opacity-10" : "bg-opacity-0")
              }
            >
              {unusedTransactions.map((arrayIndex, index) => {
                return (
                  <TransactionElem
                    transaction={transactions[arrayIndex]}
                    numberOfAccounts={numberOfAccounts}
                    key={arrayIndex}
                    signFunction={onSign}
                    removeSignatureFunction={onRemoveSignature}
                    index={index}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <div className="absolute w-full flex flex-row justify-center bottom-3">
        <Button
          text="Add"
          onClick={onAddTransaction}
          extraClasses="btn-success"
        ></Button>
      </div>
    </div>
  );
}
