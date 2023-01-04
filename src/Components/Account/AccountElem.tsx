import React from "react";
import { BORDER_COLOR } from "../../shared/Colors";
import { Account } from "../../Utils/Interfaces";
import GridElem from "../shared-components/GridElem";

interface AccountElemProps {
  account: Account;
  lastConfirmedBlock: number;
}

export default function AccountElem({
  account,
  lastConfirmedBlock,
}: AccountElemProps) {
  return (
    <div className={"w-full grid grid-cols-6 border " + BORDER_COLOR}>
      <GridElem content={account.idString}></GridElem>
      <GridElem
        extraClasses="col-span-2 text-2xs"
        content={account.privateKey}
      ></GridElem>
      <GridElem
        extraClasses="col-span-2 text-2xs"
        content={account.address}
      ></GridElem>
      <GridElem
        content={account.balanceBeforeBlock[lastConfirmedBlock + 1]}
        hideBorder={true}
      ></GridElem>
      <div
        className={"col-span-6 h-0 border-b border-opacity-50 " + BORDER_COLOR}
      ></div>
      <GridElem extraClasses="text-xs text-opacity-50" content="ID"></GridElem>
      <GridElem
        extraClasses="col-span-2 text-xs text-opacity-50"
        content="Private Key"
      ></GridElem>
      <GridElem
        extraClasses="col-span-2 text-xs text-opacity-50"
        content="Address"
      ></GridElem>
      <GridElem
        extraClasses="text-xs text-opacity-50"
        content="Balance"
        hideBorder={true}
      ></GridElem>
    </div>
  );
}
