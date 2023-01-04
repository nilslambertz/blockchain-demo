import React from "react";

type ButtonColors = "green" | "orange";

interface ButtonProps {
  text: string;
  onClick: () => void;
  buttonColor: ButtonColors;
}

export default function Button({ text, onClick, buttonColor }: ButtonProps) {
  return (
    <div
      className={
        "h-10 w-32 select-none text-lg rounded-md flex items-center justify-center cursor-pointer transition-colors " +
        getColorClasses(buttonColor)
      }
      onClick={onClick}
    >
      {text}
    </div>
  );
}

const getColorClasses = (color: ButtonColors) => {
  if (color === "green") return "text-white bg-green-600 hover:bg-green-700";
  if (color === "orange") return "bg-orange-700 hover:bg-orange-800";

  return "";
};
