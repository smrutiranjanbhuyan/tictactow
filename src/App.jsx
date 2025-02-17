import React, { useState, useEffect } from "react";

// Minimax algorithm to find the best move
const minimax = (board, depth, isMaximizing) => {
  const winner = checkWinner(board);
  if (winner === "X") return { score: 1 }; // Bot wins
  if (winner === "O") return { score: -1 }; // Player wins
  if (board.every(cell => cell !== "")) return { score: 0 }; // Tie

  const emptyCells = board
    .map((value, index) => (value === "" ? index : -1))
    .filter((index) => index !== -1);

  let bestMove = { score: isMaximizing ? -Infinity : Infinity };
  for (let index of emptyCells) {
    let newBoard = [...board];
    newBoard[index] = isMaximizing ? "X" : "O"; // Bot plays X, player plays O

    const result = minimax(newBoard, depth + 1, !isMaximizing);

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
      return board[a]; // 'X' or 'O'
    }
  }

  if (board.every(cell => cell !== "")) {
    return "Tie"; // Board is full and no winner, it's a tie
  }

  return null; // No winner yet
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState(false); // False for player, True for bot
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [history, setHistory] = useState([]);
  const [playerNames, setPlayerNames] = useState({ player1: "Player 1", player2: "Bot" });

  const handleClick = (index) => {
    if (board[index] || winner) return;

    let newBoard = [...board];
    newBoard[index] = "O"; // Player 1's move
    setBoard(newBoard);
    setHistory([...history, { board: newBoard, turn: !turn }]);

    const gameResult = checkWinner(newBoard);
    if (gameResult === "O") {
      setWinner("O");
    } else if (gameResult === "X") {
      setWinner("X");
    } else if (gameResult === "Tie") {
      setWinner("Tie");
    } else {
      setTurn(true); // Switch to bot's turn
    }
  };

  const botMove = async () => {
    const emptyCells = board
      .map((value, index) => (value === "" ? index : -1))
      .filter((index) => index !== -1);

    if (emptyCells.length > 0) {
      const bestMove = minimax(board, 0, true); // Bot maximizes the score
      let newBoard = [...board];
      newBoard[bestMove.index] = "X"; // Bot's move (X)
      setBoard(newBoard);
      setHistory([...history, { board: newBoard, turn: !turn }]);

      const gameResult = checkWinner(newBoard);
      if (gameResult === "X") {
        setWinner("X");
      } else if (gameResult === "O") {
        setWinner("O");
      } else if (gameResult === "Tie") {
        setWinner("Tie");
      } else {
        setTurn(false); // Switch to player's turn
      }
    }
  };

  useEffect(() => {
    if (turn && !winner) {
      botMove(); // Trigger bot move
    }
  }, [turn, board, winner]);

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
          </div>
          <button
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg"
            onClick={() => setGameStarted(true)}
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
              {winner === "Tie" ? "It's a tie!" : `Winner: ${winner === "X" ? playerNames.player2 : playerNames.player1}`}
            </div>
          )}
          <button
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
            onClick={() => {
              setBoard(Array(9).fill(""));
              setWinner(null);
              setTurn(false);
              setHistory([]);
              setGameStarted(false);
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
