document.addEventListener("DOMContentLoaded", () => {
  const boxes = Array.from(document.querySelectorAll(".box"));
  const resetBtn = document.getElementById("reset-btn");
  const newGameBtn = document.getElementById("new-btn");
  const msgContainer = document.querySelector(".msg-container");
  const msg = document.getElementById("msg");
  const toggleModeBtn = document.getElementById("toggle-mode");
  const playerOScoreEl = document.getElementById("player-o-score");
  const playerXScoreEl = document.getElementById("player-x-score");

  let turnO = true;
  let count = 0;
  let gameMode = "user";
  let playerOScore = 0;
  let playerXScore = 0;

  const winPatterns = [
    [0, 1, 2],[0, 3, 6],[0, 4, 8],
    [1, 4, 7],[2, 5, 8],[2, 4, 6],
    [3, 4, 5],[6, 7, 8],
  ];

  const disableBoxes = () => boxes.forEach(b => b.disabled = true);
  const enableBoxes = () => boxes.forEach(b => { b.disabled = false; b.innerText = ""; });

  const updateScoreboard = () => {
    if (playerOScoreEl) playerOScoreEl.innerText = `O Wins: ${playerOScore}`;
    if (playerXScoreEl) playerXScoreEl.innerText = `X Wins: ${playerXScore}`;
  };

  const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    if (msgContainer) msgContainer.classList.add("hide");
  };

  const resetAll = () => {
    playerOScore = 0;
    playerXScore = 0;
    updateScoreboard();
    resetGame();
  };

  const showWinner = (winner) => {
    if (!winner) return;
    if (msg) msg.innerText = `Congratulations, Winner is ${winner}`;
    if (msgContainer) msgContainer.classList.remove("hide");
    disableBoxes();
    if (winner === "O") playerOScore++;
    else if (winner === "X") playerXScore++;
    updateScoreboard();
  };

  const checkWinner = () => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      const pa = boxes[a].innerText;
      const pb = boxes[b].innerText;
      const pc = boxes[c].innerText;
      if (pa !== "" && pa === pb && pb === pc) {
        showWinner(pa);
        return true;
      }
    }
    return false;
  };

  const gameDraw = () => {
    if (msg) msg.innerText = `Game was a Draw.`;
    if (msgContainer) msgContainer.classList.remove("hide");
    disableBoxes();
  };

  const computerMove = () => {
    const emptyBoxes = boxes.filter(b => b.innerText === "");
    const findBestMove = (mark) => {
      for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const vals = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
        const countMark = vals.filter(v => v === mark).length;
        const countEmpty = vals.filter(v => v === "").length;
        if (countMark === 2 && countEmpty === 1) {
          const emptyIndex = pattern[vals.indexOf("")];
          return boxes[emptyIndex];
        }
      }
      return null;
    };
    if (emptyBoxes.length === 0) return;
    let move = findBestMove("X");
    if (!move) move = findBestMove("O");
    if (!move) move = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    if (move) {
      move.innerText = "X";
      move.disabled = true;
      count++;
      setTimeout(() => {
        const isWinner = checkWinner();
        if (count === 9 && !isWinner) gameDraw();
        turnO = true;
      }, 200);
    }
  };

  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      if (box.disabled) return;
      if (turnO) {
        box.innerText = "O";
        box.disabled = true;
        count++;
        turnO = false;
        setTimeout(() => {
          const isWinner = checkWinner();
          if (count === 9 && !isWinner) {
            gameDraw();
            return;
          }
          if (gameMode === "computer" && !isWinner) {
            setTimeout(computerMove, 350);
          }
        }, 120);
      } else if (gameMode === "user") {
        box.innerText = "X";
        box.disabled = true;
        count++;
        turnO = true;
        setTimeout(() => {
          const isWinner = checkWinner();
          if (count === 9 && !isWinner) gameDraw();
        }, 120);
      }
    });
  });

  if (newGameBtn) newGameBtn.addEventListener("click", resetGame);
  if (resetBtn) resetBtn.addEventListener("click", resetAll);

  if (toggleModeBtn) {
    toggleModeBtn.addEventListener("click", () => {
      gameMode = gameMode === "user" ? "computer" : "user";
      toggleModeBtn.innerText = `Mode: ${gameMode === "user" ? "User vs User" : "User vs Computer"}`;
      resetGame();
    });
  }

  updateScoreboard();
});
