import React, { useState } from "react";

const TicTacToe = () => {
  const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [3, 4, 5], [6, 7, 8],
  ];

  const [boxes, setBoxes] = useState(Array(9).fill(""));
  const [turnO, setTurnO] = useState(true);
  const [count, setCount] = useState(0);
  const [gameMode, setGameMode] = useState("user");
  const [playerOScore, setPlayerOScore] = useState(0);
  const [playerXScore, setPlayerXScore] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const updateScoreboard = (winner) => {
    if (winner === "O") setPlayerOScore(prev => prev + 1);
    else if (winner === "X") setPlayerXScore(prev => prev + 1);
  };

  const resetGame = () => {
    setBoxes(Array(9).fill(""));
    setTurnO(true);
    setCount(0);
    setMessage("");
    setGameOver(false);
  };

  const resetAll = () => {
    setPlayerOScore(0);
    setPlayerXScore(0);
    resetGame();
  };

  const checkWinner = (board) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const handleMove = (index, mark) => {
    if (boxes[index] !== "" || gameOver) return;
    const newBoxes = [...boxes];
    newBoxes[index] = mark;
    const newCount = count + 1;

    setBoxes(newBoxes);
    setCount(newCount);

    const winner = checkWinner(newBoxes);
    if (winner) {
      setMessage(`🎉 Winner is ${winner}`);
      setGameOver(true);
      updateScoreboard(winner);
      return;
    }

    if (newCount === 9) {
      setMessage("🤝 Game was a Draw.");
      setGameOver(true);
      return;
    }

    setTurnO(!turnO);
  };

  const computerMove = () => {
    const emptyIndexes = boxes.map((v, i) => (v === "" ? i : null)).filter(i => i !== null);

    const findBestMove = (mark) => {
      for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const vals = [boxes[a], boxes[b], boxes[c]];
        const countMark = vals.filter(v => v === mark).length;
        const countEmpty = vals.filter(v => v === "").length;
        if (countMark === 2 && countEmpty === 1) {
          return pattern[vals.indexOf("")];
        }
      }
      return null;
    };

    let moveIndex = findBestMove("X");
    if (moveIndex === null) moveIndex = findBestMove("O");
    if (moveIndex === null) {
      moveIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
    }

    handleMove(moveIndex, "X");
  };

  const handleClick = (index) => {
    if (turnO) {
      handleMove(index, "O");
      if (gameMode === "computer" && !gameOver) {
        setTimeout(() => computerMove(), 350);
      }
    } else if (gameMode === "user") {
      handleMove(index, "X");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      {/* Scoreboard */}
      <div className="flex gap-6 text-lg font-semibold mb-6">
        <span className="bg-gray-700 px-4 py-2 rounded-xl shadow">⭕ O Wins: {playerOScore}</span>
        <span className="bg-gray-700 px-4 py-2 rounded-xl shadow">❌ X Wins: {playerXScore}</span>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl shadow transition"
        >
          New Game
        </button>
        <button
          onClick={resetAll}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl shadow transition"
        >
          Reset All
        </button>
        <button
          onClick={() => {
            setGameMode(gameMode === "user" ? "computer" : "user");
            resetGame();
          }}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl shadow transition"
        >
          Mode: {gameMode === "user" ? "User vs User" : "User vs Computer"}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 text-xl font-bold text-yellow-400">{message}</div>
      )}

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3">
        {boxes.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={value !== "" || gameOver}
            className="w-20 h-20 bg-gray-700 rounded-xl text-3xl font-bold flex items-center justify-center shadow hover:bg-gray-600 transition disabled:opacity-50"
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;
