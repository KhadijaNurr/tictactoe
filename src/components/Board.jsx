import { useState, useEffect } from "react";
import { Cell } from "./Cell";
import { calculateWinner, minimaxMove } from "../logic/ticTacToeGameLogic";
import checkWinner from "../logic/Connect4GameLogic";
import victorySound from "../assets/Victory-sound.mp3";
import losingSound from "../assets/Losing-sound.mp3";

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
  //Display winner
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
      <span className={playerName + "-player"}>{playerName}</span>,
    ];
  }

  //ai logic
  useEffect(() => {
    if (winner || isNext || rows == 6 || mode === "player") return;

    // ai turn logic
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
  }, [winner, mode]);

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
///  const timeoutI = setTimeout(() => {
///  }, 500);
///return () => clearTimeout(timeoutId);
