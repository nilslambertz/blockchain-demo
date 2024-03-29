import React from "react";

interface FooterProps {
  logsVisible: boolean;
  toggleLogs: () => void;
}

export default function Footer({ toggleLogs, logsVisible }: FooterProps) {
  return (
    <div className="px-20 h-12 flex flex-row items-center justify-between border-t border-t-pink-500">
      <a
        href="https://github.com/nilslambertz/BlockchainDemo"
        target="_blank"
        rel="noreferrer"
        className="font-bold no-underline transition-colors hover:text-white"
      >
        source code
      </a>
      <span>
        by{" "}
        <a
          href="https://nilslambertz.de"
          target="_blank"
          rel="noreferrer"
          className="font-bold no-underline transition-colors hover:text-white"
        >
          nils lambertz
        </a>
      </span>
      <div className="w-20 cursor-pointer" onClick={toggleLogs}>
        Logs: <b>{logsVisible ? "ON" : "OFF"}</b>
      </div>
    </div>
  );
}
