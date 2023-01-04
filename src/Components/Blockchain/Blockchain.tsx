import React from "react";
import { Block, LogElem, Transaction } from "../../Utils/Interfaces";
import BlockElem from "./BlockElem";
import { ReactComponent as Arrow } from "../../res/arrowright.svg";

interface BlockchainProps {
  blocks: Block[];
  transactions: Transaction[];
  onConfirm: (id: number) => void;
  onAddLog: (logElem: LogElem) => void;
}

export default function Blockchain({
  blocks,
  transactions,
  onConfirm,
  onAddLog,
}: BlockchainProps) {
  return (
    <div className="w-full overflow-x-scroll p-2 flex flex-row items-center">
      {blocks.map((block, index, array) => (
        <React.Fragment key={block.id}>
          <BlockElem
            block={block}
            transactions={transactions}
            onConfirm={onConfirm}
            onAddLog={onAddLog}
          />
          {index !== array.length - 1 && (
            <div className="h-full flex flex-row flex-shrink-0 w-20 items-center">
              <Arrow />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
