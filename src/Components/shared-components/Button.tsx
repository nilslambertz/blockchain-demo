import React from "react";

interface ButtonProps {
  text: string;
  extraClasses?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  text,
  disabled,
  onClick,
  extraClasses,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={"btn " + extraClasses}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
