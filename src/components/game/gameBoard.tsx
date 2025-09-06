import React, { useState } from "react";

type Player = "X" | "O";
type Square = Player | null;

interface SquareProps {
  value: Square;
  onClick: () => void;
  isWinning: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinning }) => (
  <button
    className={`
      w-20 h-20 border-2 border-gray-300 text-4xl font-bold
      transition-all duration-200 hover:bg-gray-50
      focus:outline-none focus:ring-2 focus:ring-blue-500
      ${value === "X" ? "text-blue-600" : "text-red-600"}
      ${isWinning ? "bg-green-100 border-green-400" : ""}
      disabled:cursor-not-allowed
    `}
    onClick={onClick}
    disabled={value !== null || winner !== null}
  >
    {value}
  </button>
);

interface GameBoardProps {
  //   board: Square[];
  isXNext: boolean;
  setIsXNext: React.Dispatch<React.SetStateAction<boolean>>;
  winner: Player | "Draw" | null;
  winningSquares: number[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  isXNext,
  setIsXNext,
  winner,
  winningSquares,
}) => {
  const [board, setBoard] = useState(Array(9).fill(null));

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameStats((prev) => ({
        ...prev,
        [gameWinner === "X" ? "xWins" : "oWins"]:
          prev[gameWinner === "X" ? "xWins" : "oWins"] + 1,
      }));
    } else if (isBoardFull(newBoard)) {
      setWinner("draw");
      setGameStats((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
    }
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-1 bg-gray-400 p-1 rounded-lg">
        {board.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleClick(index)}
            isWinning={winningSquares.includes(index)}
          />
        ))}
      </div>
    </div>
  );
};
