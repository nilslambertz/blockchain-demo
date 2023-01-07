import React, { ReactNode } from "react";
import { BLOCK_DROPPABLE_PREFIX, BORDER_COLOR } from "../../shared/constants";
import "./Blockchain.css";
import {
  Block,
  LogElem,
  Transaction,
  validStartHash,
} from "../../Utils/Interfaces";
import Button from "../shared-components/Button";
import TransactionList from "../Transaction/TransactionList";

interface BlockElemProps {
  block: Block;
  transactions: Transaction[];
  onConfirm: (id: number) => void;
  onAddLog: (logElem: LogElem) => void;
}

export default function BlockElem({
  block,
  transactions,
  onConfirm,
  onAddLog,
}: BlockElemProps) {
  return (
    <div
      className={"h-full border flex flex-col w-full max-w-4xl " + BORDER_COLOR}
    >
      <BlockSection title="Previous hash" smallText={true}>
        {block?.prevHash}
      </BlockSection>
      <BlockSection title="Transactions" className="flex-1 overflow-y-auto">
        <TransactionList
          transactions={transactions}
          transactionOrder={block.transactions}
          droppableId={BLOCK_DROPPABLE_PREFIX + block.id}
          emptyText="Drag and drop transactions here!"
          hideTitleAndButton
        ></TransactionList>
      </BlockSection>
      <BlockSection title="Nonce">{block?.nonce}</BlockSection>
      <BlockSection title="Confirmation">
        {block.confirmed ? (
          <div className="w-full text-center text-green-500">confirmed</div>
        ) : (
          <div className="w-full flex flex-row justify-center">
            <Button
              extraClasses="btn-warning"
              onClick={() => onConfirm(block.id)}
              text="Confirm"
            ></Button>
          </div>
        )}
      </BlockSection>
      <BlockSection title="Hash" smallText={true} hideBorder={true}>
        {block.confirmed ? (
          <span>
            <b className="text-green-500">{validStartHash}</b>
            {block?.hash?.substring(validStartHash.length)}
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
  title: string;
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
    <div className={smallText ? "text-sm" : ""}>{children}</div>
    <div className="flex flex-row justify-end text-xs">{title}</div>
  </div>
);
