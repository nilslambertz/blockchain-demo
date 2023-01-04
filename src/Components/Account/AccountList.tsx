import React from "react";
import { account, logElem } from "../../Utils/Interfaces";
import Button from "../Button";
import Account from "./Account";

interface AccountListProps {
  accounts: account[];
  addAccount: () => void;
  addLog: (elem: logElem) => void;
  lastConfirmedBlock: number;
}

export default function AccountList({
  accounts,
  addAccount,
  lastConfirmedBlock,
}: AccountListProps) {
  return (
    <div className="relative flex-1 flex flex-col overflow-hidden items-stretch border-r border-r-pink-500">
      <div className="flex-1 px-3 overflow-y-scroll overflow-x-hidden flex flex-col items-stretch gap-2 pb-16">
        <div className="sticky top-0 w-full text-center text-2xl py-2 bg-base">
          accounts
        </div>
        {accounts.map((account) => (
          <Account
            account={account}
            key={account.id}
            lastConfirmedBlock={lastConfirmedBlock}
          />
        ))}
      </div>
      <div className="absolute w-full flex flex-row justify-center bottom-3">
        <Button text="Add" onClick={addAccount} buttonColor="green"></Button>
      </div>
    </div>
  );
}
