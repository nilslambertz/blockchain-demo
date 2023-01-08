import React, { ReactNode } from "react";
import {
  BLOCK_DROPPABLE_PREFIX,
  BORDER_COLOR,
  VALID_START_HASH,
} from "../../shared/constants";
import { Block, Transaction } from "../../Utils/Interfaces";
import Button from "../shared-components/Button";
import TransactionList from "../Transaction/TransactionList";

interface BlockElemProps {
  block: Block;
  transactions: Transaction[];
  numberOfAccounts: number;
  onConfirm: (id: number) => void;
}

export default function BlockElem({
  block,
  transactions,
  numberOfAccounts,
  onConfirm,
}: BlockElemProps) {
  return (
    <div
      className={
        "flex-shrink-0 flex-grow-0 h-full border flex flex-col w-[700px] " +
        BORDER_COLOR
      }
    >
      <BlockSection title="Previous hash" smallText={true}>
        {block?.prevHash}
      </BlockSection>
      <BlockSection className="flex-1 overflow-hidden">
        <TransactionList
          transactions={transactions}
          transactionOrder={block.transactions}
          droppableId={BLOCK_DROPPABLE_PREFIX + block.id}
          numberOfAccounts={numberOfAccounts}
          emptyText="Drag and drop transactions here!"
          formsDisabled
          hideTitleAndButton
        ></TransactionList>
      </BlockSection>
      <BlockSection title="Nonce">{block?.nonce}</BlockSection>
      <BlockSection title="Confirmation">
        <div className="w-full flex flex-row justify-center">
          <Button
            extraClasses={
              block.confirmed
                ? "btn-success no-animation cursor-default"
                : "btn-warning"
            }
            onClick={() => {
              if (!block.confirmed) onConfirm(block.id);
            }}
            text={block.confirmed ? "Confirmed" : "Confirm"}
          ></Button>
        </div>
      </BlockSection>
      <BlockSection title="Hash" smallText={true} hideBorder={true}>
        {block.confirmed ? (
          <span>
            <b className="text-green-500">{VALID_START_HASH}</b>
            {block?.hash?.substring(VALID_START_HASH.length)}
          </span>
        ) : (
          block?.hash
        )}
      </BlockSection>
    </div>
  );
}

interface BlockSectionProps {
  children: ReactNode;
  title?: string;
  className?: string;
  hideBorder?: boolean;
  smallText?: boolean;
}

const BlockSection = ({
  children,
  title,
  className,
  hideBorder,
  smallText,
}: BlockSectionProps) => (
  <div
    className={
      "p-1 flex flex-col items-stretch gap-1 " +
      className +
      " " +
      (hideBorder ? "" : "border-b " + BORDER_COLOR)
    }
  >
    <div className={"h-full " + (smallText ? "text-sm" : "")}>{children}</div>
    {title && <div className="flex flex-row justify-end text-xs">{title}</div>}
  </div>
);
