import React, { useState, useEffect } from "react";

export default function TicTacToe() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const [boxes, setBoxes] = useState(Array(9).fill(""));
  const [turnO, setTurnO] = useState(true); // true: O's turn (player), false: X's turn (computer when in computer mode)
  const [gameMode, setGameMode] = useState("user"); // "user" or "computer"
  const [playerOScore, setPlayerOScore] = useState(0);
  const [playerXScore, setPlayerXScore] = useState(0);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const resetGame = () => {
    setBoxes(Array(9).fill(""));
    setTurnO(true);
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
      if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    }
    return null;
  };

  const updateScoreboard = (winner) => {
    if (winner === "O") setPlayerOScore((p) => p + 1);
    else if (winner === "X") setPlayerXScore((p) => p + 1);
  };

  // handleMove returns an object with info about the move and updated board so callers (like computer) can operate on the fresh board
  const handleMove = (index, mark, boardParam = null) => {
    const board = boardParam ? [...boardParam] : [...boxes];
    if (board[index] !== "" || gameOver) return { moved: false, board };

    board[index] = mark;

    const winner = checkWinner(board);
    const filled = board.filter((v) => v !== "").length;

    // update UI state
    setBoxes(board);

    if (winner) {
      setMessage(`🎉 Winner is ${winner}`);
      setGameOver(true);
      updateScoreboard(winner);
    } else if (filled === 9) {
      setMessage("🤝 Game was a Draw.");
      setGameOver(true);
    } else {
      // toggle turn: if X just moved -> next is O (true). if O just moved -> next is X (false)
      setTurnO(mark === "X");
      setMessage("");
    }

    return { moved: true, board, winner, gameOver: Boolean(winner) || filled === 9 };
  };

  // --- Minimax implementation for perfect-play X (computer) ---
  const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === "X") return 10 - depth; // prefer faster wins
    if (winner === "O") return depth - 10; // prefer slower losses

    if (board.every((v) => v !== "")) return 0; // draw

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = "X";
          const score = minimax(board, depth + 1, false);
          board[i] = "";
          if (score > best) best = score;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = "O";
          const score = minimax(board, depth + 1, true);
          board[i] = "";
          if (score < best) best = score;
        }
      }
      return best;
    }
  };

  const getBestMove = (board) => {
    let bestScore = -Infinity;
    let bestMove = null;

    // If empty board, prefer center
    if (board.every((v) => v === "")) return 4;

    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        const score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  // When the player clicks a box
  const handleClick = (index) => {
    if (gameOver) return;

    if (gameMode === "computer") {
      // allow player (O) only when it's O's turn
      if (!turnO) return;

      const result = handleMove(index, "O");

      // if player's move was successful and the game is not ended, let the computer respond using the fresh board from the result
      if (result.moved && !result.gameOver) {
        const best = getBestMove(result.board);
        if (best !== null && best !== undefined) {
          // small delay so it feels natural
          setTimeout(() => handleMove(best, "X", result.board), 250);
        }
      }
    } else {
      // user vs user mode
      const mark = turnO ? "O" : "X";
      handleMove(index, mark);
    }
  };

  // If you want the computer to be able to start first (when turnO is false), this effect will make it play automatically
  useEffect(() => {
    if (gameMode === "computer" && !turnO && !gameOver) {
      const best = getBestMove(boxes);
      if (best !== null && best !== undefined) {
        setTimeout(() => handleMove(best, "X", boxes), 250);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnO, gameMode, gameOver]);

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
            // toggling mode resets board so computer doesn't play on stale board
            setGameMode((m) => (m === "user" ? "computer" : "user"));
            resetGame();
          }}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl shadow transition"
        >
          Mode: {gameMode === "user" ? "User vs User" : "User vs Computer"}
        </button>
      </div>

      {/* Message */}
      {message && <div className="mb-4 text-xl font-bold text-yellow-400">{message}</div>}

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3">
        {boxes.map((value, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={value !== "" || gameOver || (gameMode === "computer" && !turnO)}
            className="w-20 h-20 bg-gray-700 rounded-xl text-3xl font-bold flex items-center justify-center shadow hover:bg-gray-600 transition disabled:opacity-50"
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}
