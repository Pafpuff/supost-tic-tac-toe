import React from "react";
import { Sour_Gummy } from "next/font/google";

const sourGummy = Sour_Gummy({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

interface BoardSquareProps {
  value: "X" | "O" | null;
  onClick: () => void;
  isWinning: boolean;
  disabled?: boolean;
}

export default function BoardSquare({
  value,
  onClick,
  isWinning,
  disabled,
}: BoardSquareProps) {
  return (
    <button
      className={`
            ${sourGummy.className} 
            w-20 h-20 text-7xl font-normal
            transition-all duration-200 
            border-2 border-[#863100]
            rounded-md bg-[#4f0000]
            cursor-target cursor-none
            ${
              value === "X"
                ? "text-[#f85b53]"
                : value === "O"
                ? "text-[#68c7ff]"
                : ""
            }
            ${isWinning ? "bg-[#ffd77b]" : "hover:bg-[#ae584f]"}
            disabled:cursor-not-allowed
          `}
      style={{
        textShadow:
          value === "X"
            ? "2px 2px 4px #000"
            : value === "O"
            ? "2px 2px 4px #000"
            : "none",
      }}
      onClick={onClick}
      disabled={disabled || value !== null}
    >
      {value}
    </button>
  );
}
// focus:outline-none focus:ring-2 focus:ring-blue-500
