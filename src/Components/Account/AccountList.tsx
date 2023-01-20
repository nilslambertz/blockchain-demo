import React from "react";
import { Account, LogElem } from "../../shared/Types";
import Button from "../shared-components/Button";
import AccountElem from "./AccountElem";

interface AccountListProps {
  accounts: Account[];
  lastConfirmedBlock: number;
  onAddAccount: () => void;
}

export default function AccountList({
  accounts,
  onAddAccount,
  lastConfirmedBlock,
}: AccountListProps) {
  return (
    <div className="relative flex-1 flex flex-col overflow-hidden items-stretch border-r border-r-pink-500">
      <div className="flex-1 px-3 overflow-y-scroll overflow-x-hidden flex flex-col items-stretch gap-2 pb-16">
        <div className="sticky top-0 w-full text-center text-2xl py-2 bg-base">
          accounts
        </div>
        {accounts.map((account) => (
          <AccountElem
            account={account}
            key={account.id}
            lastConfirmedBlock={lastConfirmedBlock}
          />
        ))}
        {accounts?.length === 0 && (
          <div className="w-full text-center opacity-50">
            Add some accounts!
          </div>
        )}
      </div>
      <div className="absolute w-full flex flex-row justify-center bottom-3 pointer-events-none">
        <Button
          text="Add"
          onClick={onAddAccount}
          extraClasses="btn-success pointer-events-auto"
        ></Button>
      </div>
    </div>
  );
}
