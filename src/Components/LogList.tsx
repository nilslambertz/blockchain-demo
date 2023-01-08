import React from "react";
import { LogElem } from "../shared/Types";

interface LogListProps {
  logElements: LogElem[];
  logsVisible: boolean;
}

export default function LogList({ logElements, logsVisible }: LogListProps) {
  const visibilityClasses = logsVisible
    ? "p-4 flex-1 border-l border-l-pink-500"
    : "w-0";

  return (
    <div
      className={
        "overflow-y-scroll flex flex-col items-stretch " + visibilityClasses
      }
    >
      {logElements.map((logElem, index) => (
        <div
          className="py-1 flex flex-row gap-5 items-start border-b border-gray-500 border-opacity-50"
          key={index}
        >
          <samp className="opacity-50">{logElem.time}</samp>
          <samp className="flex-1">{logElem.message}</samp>
        </div>
      ))}
    </div>
  );
}
