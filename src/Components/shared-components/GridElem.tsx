import React, { ReactNode } from "react";
import { BORDER_COLOR } from "../../shared/Colors";

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
        "flex flex-row items-center p-2 break-all border-opacity-50 " +
        extraClasses +
        (!hideBorder ? " border-r " + BORDER_COLOR : "")
      }
    >
      {children}
    </div>
  );
}
