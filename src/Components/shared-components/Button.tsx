import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  extraClasses?: string;
}

export default function Button({ text, onClick, extraClasses }: ButtonProps) {
  return (
    <div className={"btn " + extraClasses} onClick={onClick}>
      {text}
    </div>
  );
}
