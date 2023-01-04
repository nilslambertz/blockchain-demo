import React, { ReactNode } from "react";
import { BORDER_COLOR } from "../../shared/Colors";
import "./Blockchain.css";
import {
  Block,
  LogElem,
  Transaction,
  validStartHash,
} from "../../Utils/Interfaces";
import UpperList from "../UpperList/UpperList";
import Button from "../shared-components/Button";

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
        <UpperList
          droppableId={"block" + block.id}
          title={"transactions"}
          transactions={transactions}
          transactionOrder={block.transactions}
          className={"transactionListContainer"}
          emptyText={"Drag and drop transactions here!"}
          blockList={true}
          addLogFunction={onAddLog}
        />
      </BlockSection>
      <BlockSection title="Nonce">{block?.nonce}</BlockSection>
      <BlockSection title="Confirmation">
        {block.confirmed ? (
          <div className="w-full text-center text-green-500">confirmed</div>
        ) : (
          <div className="w-full flex flex-row justify-center">
            <Button
              buttonColor="orange"
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
