import React from "react";
import { BORDER_COLOR } from "../../shared/Colors";

interface GridElemProps {
  content?: string | number;
  extraClasses?: string;
  hideBorder?: boolean;
}

export default function GridElem({
  content,
  extraClasses,
  hideBorder,
}: GridElemProps) {
  return (
    <div
      className={
        "flex flex-row items-center p-2 break-all " +
        extraClasses +
        (!hideBorder ? " border-r " + BORDER_COLOR : "")
      }
    >
      {content}
    </div>
  );
}
