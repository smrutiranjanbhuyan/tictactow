import React, { useState, useEffect } from "react";


const minimax = (board, depth, isMaximizing, botSymbol, playerSymbol) => {
  const winner = checkWinner(board);
  if (winner === botSymbol) return { score: 1 };
  if (winner === playerSymbol) return { score: -1 };
  if (board.every(cell => cell !== "")) return { score: 0 };

  const emptyCells = board
    .map((value, index) => (value === "" ? index : -1))
    .filter(index => index !== -1);

  let bestMove = { score: isMaximizing ? -Infinity : Infinity };
  for (let index of emptyCells) {
    let newBoard = [...board];
    newBoard[index] = isMaximizing ? botSymbol : playerSymbol;

    const result = minimax(newBoard, depth + 1, !isMaximizing, botSymbol, playerSymbol);

    if (isMaximizing) {
      if (result.score > bestMove.score) bestMove = { index, score: result.score };
    } else {
      if (result.score < bestMove.score) bestMove = { index, score: result.score };
    }
  }

  return bestMove;
};

// Check if there is a winner or a tie
const checkWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  if (board.every(cell => cell !== "")) {
    return "Tie";
  }

  return null;
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState(null); // Null until symbol is chosen
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerNames, setPlayerNames] = useState({ player1: "Player 1", player2: "Bot" });
  const [playerSymbol, setPlayerSymbol] = useState("");
  const [botSymbol, setBotSymbol] = useState("");

  // Handle cell click
  const handleClick = (index) => {
    if (board[index] || winner || turn) return;

    let newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
    } else {
      setTurn(true);
    }
  };

  // Bot's move logic
  const botMove = () => {
    const emptyCells = board
      .map((value, index) => (value === "" ? index : -1))
      .filter(index => index !== -1);

    if (emptyCells.length > 0) {
      const bestMove = minimax(board, 0, true, botSymbol, playerSymbol);
      let newBoard = [...board];
      newBoard[bestMove.index] = botSymbol;
      setBoard(newBoard);

      const gameResult = checkWinner(newBoard);
      if (gameResult) {
        setWinner(gameResult);
      } else {
        setTurn(false);
      }
    }
  };

  // Manage bot's turn
  useEffect(() => {
    if (turn && !winner) {
      botMove();
    }
  }, [turn, board, winner]);

  // Handle symbol selection
  const handleSymbolSelection = (symbol) => {
    setPlayerSymbol(symbol);
    setBotSymbol(symbol === "X" ? "O" : "X");
    setTurn(symbol === "X" ? false : true); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {!gameStarted ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Tic Tac Toe</h1>
          <div className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Player 1 Name"
              value={playerNames.player1}
              onChange={(e) => setPlayerNames({ ...playerNames, player1: e.target.value })}
              className="p-2 rounded-lg text-black w-full"
            />
            <h2 className="text-xl">Choose Your Symbol:</h2>
            <div className="flex justify-center space-x-4">
              <button
                className={`px-6 py-2 rounded-lg ${playerSymbol === "X" ? "bg-blue-500" : "bg-gray-700"}`}
                onClick={() => handleSymbolSelection("X")}
              >
                X
              </button>
              <button
                className={`px-6 py-2 rounded-lg ${playerSymbol === "O" ? "bg-blue-500" : "bg-gray-700"}`}
                onClick={() => handleSymbolSelection("O")}
              >
                O
              </button>
            </div>
          </div>
          <button
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg"
            onClick={() => setGameStarted(true)}
            disabled={!playerSymbol}
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Tic Tac Toe</h1>
          <h2 className="text-xl mb-4">Turn: {turn ? playerNames.player2 : playerNames.player1}</h2>
          <div className="grid grid-cols-3 gap-4 p-4 max-w-md w-full bg-gray-800 rounded-lg">
            {board.map((val, index) => (
              <div
                key={index}
                className={`h-20 w-20 flex items-center justify-center text-3xl font-bold rounded-lg cursor-pointer transition-all ${
                  val ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
                onClick={() => handleClick(index)}
              >
                {val}
              </div>
            ))}
          </div>
          {winner && (
            <div className="mt-4 text-2xl font-bold text-green-400">
              {winner === "Tie" ? "It's a tie!" : `Winner: ${winner === playerSymbol ? playerNames.player1 : playerNames.player2}`}
            </div>
          )}
          <button
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
            onClick={() => {
              setBoard(Array(9).fill(""));
              setWinner(null);
              setTurn(null);
              setGameStarted(false);
              setPlayerSymbol("");
              setBotSymbol("");
            }}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
