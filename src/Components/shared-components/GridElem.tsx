import React, { ReactNode } from "react";
import { BORDER_COLOR } from "../../shared/constants";

interface GridElemProps {
  children?: ReactNode;
  extraClasses?: string;
  hideBorder?: boolean;
}

export default function GridElem({
  children,
  extraClasses,
  hideBorder,
}: GridElemProps) {
  return (
    <div
      className={
        "flex flex-row items-center p-2 break-all border-opacity-50 min-w-[80px] " +
        extraClasses +
        (!hideBorder ? " border-r " + BORDER_COLOR : "")
      }
    >
      {children}
    </div>
  );
}
