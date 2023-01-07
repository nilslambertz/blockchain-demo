import React from "react";

interface ButtonProps {
  text: string;
  extraClasses?: string;
  onClick?: () => void;
}

export default function Button({ text, onClick, extraClasses }: ButtonProps) {
  return (
    <div className={"btn " + extraClasses} onClick={onClick}>
      {text}
    </div>
  );
}
