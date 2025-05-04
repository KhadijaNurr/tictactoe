import { useState, useEffect } from "react";
import victorySound from "./assets/Victory-sound.mp3";
import losingSound from "./assets/Losing-sound.mp3";

function Cell({ value, onCellClick, disabled, className }) {
  return (
    <button className={className} onClick={onCellClick} disabled={disabled}>
      {value}
    </button>
  );
}

export default function Board({ rows, theme, mode }) {
  const sizeOfGrid = rows === 6 ? rows * 7 : rows * rows;
  const [winner, setWinner] = useState(null);
  const [isNext, setIsNext] = useState(true);
  const [cells, setCells] = useState(Array(sizeOfGrid).fill(null));
  const [player, setPlayer] = useState({ firstPlayer: "X", secondPlayer: "O" });

  // handle click on cells
  function handleClick(index) {
    if (winner) return;

    if (rows === 6) {
      //gravity
      const col = index % 7;
      const newCells = [...cells];
      for (let row = 5; row >= 0; row--) {
        const i = row * 7 + col;
        if (!newCells[i]) {
          newCells[i] = isNext ? "X" : "O";
          setCells(newCells);
          setIsNext(!isNext);
          break;
        }
      }
    } else {
      if (cells[index]) return;
      const newCells = [...cells];
      newCells[index] = isNext ? "X" : "O";
      setCells(newCells);
      setIsNext(!isNext);
    }
  }
  //check winner
  useEffect(() => {
    if (rows === 6) {
      const board = [];
      for (let i = 0; i < 6; i++) {
        board.push(cells.slice(i * 7, i * 7 + 7));
      }
      setWinner(checkWinner(board));
    } else {
      setWinner(calculateWinner(rows, cells));
    }
  }, [cells, rows]);

  //ai logic
  useEffect(() => {
    if (winner || isNext || rows == 6 || mode === "player") return;

    // ai turn logic
    const timeoutId = setTimeout(() => {
      let aiChoice;
      const newCells = [...cells];

      let depth = 3;
      if (mode === "medium") depth = 8;
      else if (mode === "hard") depth = 9;

      aiChoice = minimaxMove(depth, newCells, rows);
      if (aiChoice !== -1 && !winner) {
        newCells[aiChoice] = "O";
        setCells(newCells);
        setIsNext(true);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isNext, cells, mode, rows, winner]);

  // background sound effect for the winner
  useEffect(() => {
    if (winner && (mode === "player" || winner === "X")) {
      document.body.classList.add("winner-background");

      let audio = new Audio(victorySound);
      audio.volume = 0.3;
      audio.play();
    } else if (winner && mode !== "player" && winner == "O") {
      document.body.classList.add("winner-background");

      let audio = new Audio(losingSound);
      audio.volume = 0.3;
      audio.play();
    } else {
      document.body.classList.remove("winner-background");
    }
  }, [winner]);

  //update status
  useEffect(() => {
    if (rows === 6) {
      setPlayer({
        firstPlayer: "Blue",
        secondPlayer: "Pink",
      });
    } else {
      setPlayer({ firstPlayer: "X", secondPlayer: "O" });
    }
  }, [theme, rows]);
  let status;
  const isDraw = cells.every(Boolean) && !winner;

  let playerName;
  if (winner) {
    playerName = winner === "X" ? player.firstPlayer : player.secondPlayer;

    status = [
      "Winner: ",
      <span key="winner" className={playerName + "-player"}>
        {playerName}
      </span>,
      " 🎉",
    ];
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    playerName = isNext ? player.firstPlayer : player.secondPlayer;
    status = [
      "Next Player: ",
      <span class={playerName + "-player"}>{playerName}</span>,
    ];
  }
  //render boards
  const renderBoard = () => {
    let rowsArray = [];
    // connect 4
    if (rows === 6) {
      for (let i = 0; i < rows; i++) {
        let rowCells = [];
        for (let j = 0; j < 7; j++) {
          const index = i * 7 + j;
          rowCells.push(
            <Cell
              key={index}
              value={cells[index]}
              onCellClick={() => handleClick(index)}
              disabled={winner !== null}
              isNext={isNext}
              empty={!cells[index]}
              className={`cell connect-4-row 
    ${cells[index] ? `cell-${cells[index]}` : ""} 
    ${!cells[index] && !winner ? (isNext ? "hover-x" : "hover-o") : ""}`}
            />
          );
        }
        rowsArray.push(
          <div key={i} className="board-row connect-4-row">
            {rowCells}
          </div>
        );
      }
      return rowsArray;
    }
    // tic tac toe
    for (let i = 0; i < rows; i++) {
      let rowCells = [];
      for (let j = 0; j < rows; j++) {
        const index = i * rows + j;
        rowCells.push(
          <Cell
            key={index}
            value={cells[index]}
            onCellClick={() => handleClick(index)}
            disabled={!!winner || !!cells[index]}
            empty={!cells[index]}
            className={`cell tic-tac-toe 
    ${cells[index] ? `cell-${cells[index]}` : ""} 
    ${!cells[index] && !winner ? (isNext ? "hover-x" : "hover-o") : ""}`}
          />
        );
      }
      rowsArray.push(
        <div key={i} className="board-row">
          {rowCells}
        </div>
      );
    }
    return rowsArray;
  };
  // restart button
  function handleRestartGame() {
    document.body.classList.remove("winner-background");
    setCells(Array(sizeOfGrid).fill(null));
    setIsNext(true);
  }

  return (
    <>
      <div className="game-container">
        <h1 className={"status-title " + playerName + "-status"}>{status}</h1>
        <div className="restart-button" onClick={handleRestartGame}>
          <i className="fa-solid fa-arrow-rotate-right"></i>
        </div>
        <div
          className={
            rows === 6
              ? "connect4-board"
              : rows !== 5
              ? "tictactoe-board-small"
              : "tictactoe-board-big"
          }
        >
          {renderBoard()}
        </div>
      </div>
    </>
  );
}

function calculateWinner(size, cells) {
  let lines = getLines(size);

  for (let line of lines) {
    const first = cells[line[0]];
    if (!first) continue;

    if (line.every((index) => cells[index] === first)) {
      return first;
    }
  }
  return null;
}
function getLines(rows) {
  const lines3x3 = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const lines4x4 = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];

  const lines5x5 = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  if (rows === 3) return lines3x3;
  if (rows === 4) return lines4x4;
  if (rows === 5) return lines5x5;
  return [];
}

function checkWinner(board) {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] &&
        board[row][col] === board[row][col + 1] &&
        board[row][col] === board[row][col + 2] &&
        board[row][col] === board[row][col + 3]
      ) {
        return board[row][col];
      }
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      if (
        board[row][col] &&
        board[row][col] === board[row + 1][col] &&
        board[row][col] === board[row + 2][col] &&
        board[row][col] === board[row + 3][col]
      ) {
        return board[row][col];
      }
    }
  }

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] &&
        board[row][col] === board[row + 1][col + 1] &&
        board[row][col] === board[row + 2][col + 2] &&
        board[row][col] === board[row + 3][col + 3]
      ) {
        return board[row][col];
      }
    }
  }

  for (let row = 3; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] &&
        board[row][col] === board[row - 1][col + 1] &&
        board[row][col] === board[row - 2][col + 2] &&
        board[row][col] === board[row - 3][col + 3]
      ) {
        return board[row][col];
      }
    }
  }

  return null;
}

function evaluate(board, rows) {
  const winner = calculateWinner(rows, board);
  if (winner === "O") return 100;
  if (winner === "X") return -100;

  let score = 0;
  const lines = getLines(rows);

  for (let line of lines) {
    const values = line.map((i) => board[i]);
    const oCount = values.filter((v) => v === "O").length;
    const xCount = values.filter((v) => v === "X").length;

    if (xCount === 0 && oCount > 0) {
      score += Math.pow(10, oCount);
    }
    if (oCount === 0 && xCount > 0) {
      score -= Math.pow(10, xCount);
    }
  }

  for (let line of lines) {
    const values = line.map((i) => board[i]);
    const xCount = values.filter((v) => v === "X").length;
    if (xCount === 3 && values.includes(null)) {
      score += 10;
    }
  }

  return score;
}

function minimax(
  board,
  depth,
  isMax,
  rows,
  alpha = -Infinity,
  beta = Infinity
) {
  const score = evaluate(board, rows);
  if (Math.abs(score) === 100 || depth === 0 || board.every(Boolean)) {
    return score;
  }

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "O";
        const val = minimax(board, depth - 1, false, rows, alpha, beta);
        board[i] = null;
        best = Math.max(best, val);
        alpha = Math.max(alpha, val);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "X";
        const val = minimax(board, depth - 1, true, rows, alpha, beta);
        board[i] = null;
        best = Math.min(best, val);
        beta = Math.min(beta, val);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

function minimaxMove(depth, cells, rows) {
  let bestMove = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < cells.length; i++) {
    if (!cells[i]) {
      cells[i] = "O";
      let score = minimax(cells, depth - 1, false, rows);
      cells[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}
