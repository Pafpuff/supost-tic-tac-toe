"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BoardSquare from "@/components/game/boardSquare";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Sour_Gummy, Sono } from "next/font/google";
import TargetCursor from "@/components/react-bits/TargetCursor";
import ClickSpark from "@/components/react-bits/ClickSpark";

const sourGummy = Sour_Gummy({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const sono = Sono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Type Definitions
type SquareValue = "X" | "O" | null;

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
}

export default function TicTacToe() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<SquareValue | "draw">(null);
  const [statusKey, setStatusKey] = useState<number>(0);
  const [showSparks, setShowSparks] = useState(false);

  useEffect(() => {
    setStatusKey((prev) => prev + 1);
  }, [winner, isXNext, board]);

  const [gameStats, setGameStats] = useState<GameStats>({
    xWins: 0,
    oWins: 0,
    draws: 0,
  });
  const { theme, setTheme } = useTheme();

  // Check for winner
  const checkWinner = (squares: SquareValue[]): SquareValue => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  // Check if board is full
  const isBoardFull = (squares: SquareValue[]): boolean => {
    return squares.every((square) => square !== null);
  };

  // Handle square click
  const handleClick = (index: number): void => {
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
      setShowSparks(true);
    } else if (isBoardFull(newBoard)) {
      setWinner("draw");
      setGameStats((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
    }
  };

  // Reset game
  const resetGame = (): void => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setShowSparks(false);
  };

  // Reset all stats
  const resetStats = (): void => {
    setGameStats({
      xWins: 0,
      oWins: 0,
      draws: 0,
    });
    resetGame();
  };

  // Get status message
  const getStatusMessage = (): string => {
    if (winner === "draw") {
      return "It's a draw!";
    } else if (winner) {
      return `Player ${winner} wins!`;
    } else {
      return `Next player: ${isXNext ? "X" : "O"}`;
    }
  };

  // Get winning squares for highlighting
  const getWinningSquares = (): number[] => {
    if (!winner || winner === "draw") return [];

    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return [a, b, c];
      }
    }
    return [];
  };

  const winningSquares = getWinningSquares();

  return (
    <ClickSpark
      rate={500}
      sparkColor="#7769ff"
      sparkSize={40}
      sparkRadius={120}
      sparkCount={12}
      duration={1500}
      easing="ease-out"
      extraScale={1}
      sparking={showSparks}
    >
      <TargetCursor spinDuration={4} hideDefaultCursor={true} />

      <div
        className={`relative min-h-screen 
                      bg-[radial-gradient(circle_at_center,_#009b81,_#006550)] dark:bg-[radial-gradient(circle_at_center,_#004330,_#002a18)]
                      p-4 flex items-center justify-center`}
      >
        <div className="flex-1 relative max-w-xl min-w-sm mx-auto">
          <Card className="shadow-xl bg-[#fff6e8] dark:bg-[#1a1000]">
            <CardHeader className="text-center">
              <div className="flex justify-center items-center gap-4">
                <CardTitle
                  className={`flex-1 text-4xl font-bold text-[#062405] dark:text-[#dcfadb] ${sono.className}`}
                >
                  Tic-Tac-Toe
                </CardTitle>
                <Button
                  variant="ghost"
                  className="absolute right-7 h-12 w-12 cursor-target cursor-none"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="absolute size-8 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <Moon className="size-8 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>

              <Separator className="bg-gray-600 dark:bg-[#9ba6b5]" />

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div
                    className={`text-5xl text-[#f85b53] dark:text-[#ab0f07] ${sourGummy.className}`}
                  >
                    X
                  </div>
                  <div
                    className={`text-xl font-bold text-[#062405] dark:text-[#dcfadb] ${sono.className}`}
                  >
                    {gameStats.xWins} Wins
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className={`text-5xl text-[#a259ff] dark:text-[#4900a8] ${sourGummy.className}`}
                  >
                    &mdash;
                  </div>
                  <div
                    className={`text-xl font-bold text-[#062405] dark:text-[#dcfadb] ${sono.className}`}
                  >
                    {gameStats.draws} Draws
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className={`text-5xl text-[#68c7ff] dark:text-[#006199] ${sourGummy.className}`}
                  >
                    O
                  </div>
                  <div
                    className={`text-xl font-bold text-[#062405] dark:text-[#dcfadb] ${sono.className}`}
                  >
                    {gameStats.oWins} Wins
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status */}

              {/* Game Board */}
              <div className="relative w-fit mx-auto flex flex-col items-center gap-6">
                <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
                  <div
                    key={statusKey}
                    className={`
                    w-80 py-1 text-xl font-bold text-center shadow-2xl border-y-2
                    status-animate
                    z-5
                    ${sono.className}
                    ${
                      winner === "draw"
                        ? `text-[#ffd77b] border-[#5a15ba] 
                          bg-[linear-gradient(to_right,transparent_0%,#5a15ba_30%,#5a15ba_70%,transparent_100%)]`
                        : winner === "X"
                        ? `text-[#ffd77b] border-[#640000]
                          bg-[linear-gradient(to_right,transparent_0%,#640000_30%,#640000_70%,transparent_100%)]`
                        : winner === "O"
                        ? `text-[#ffd77b] border-[#002e5a]
                          bg-[linear-gradient(to_right,transparent_0%,#002e5a_30%,#002e5a_70%,transparent_100%)]`
                        : isXNext
                        ? `text-[#fff6e8] border-[#640000]
                          bg-[linear-gradient(to_right,transparent_0%,#870000_30%,#870000_70%,transparent_100%)]`
                        : `text-[#fff6e8] border-[#002e5a]
                          bg-[linear-gradient(to_right,transparent_0%,#005180_30%,#005180_70%,transparent_100%)]`
                    }
                  `}
                  >
                    {getStatusMessage()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 bg-[radial-gradient(circle_at_center,_#c76600,_#691500)] rounded-lg p-4 mt-12 shadow-lg border-2 border-[#4f0000]">
                  {board.map((value, index) => (
                    <BoardSquare
                      key={index}
                      value={value}
                      onClick={() => handleClick(index)}
                      isWinning={winningSquares.includes(index)}
                    />
                  ))}
                </div>

                <div className="flex w-full gap-4">
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    size="lg"
                    className={` cursor-target cursor-none  ${sono.className}`}
                  >
                    New Game
                  </Button>
                  <Button
                    onClick={resetStats}
                    variant="destructive"
                    size="lg"
                    className={`flex-1 cursor-target cursor-none  ${sono.className}`}
                  >
                    Reset Stats
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClickSpark>
  );
}
