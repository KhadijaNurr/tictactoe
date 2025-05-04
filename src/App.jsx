import { useState, useEffect } from "react";
import "./App.css";
import image3x3 from "./assets/image3x3.png";
import image4x4 from "./assets/image4x4.png";
import image5x5 from "./assets/image5x5.png";
import connect4 from "./assets/connect4.png";

import Board from "./Board";

function GoBackButton({ setGame, setMode, setGameValue }) {
  const handleClick = (setGame, setMode) => {
    setGame(setGameValue);
    setMode(null);
    document.body.classList.remove("winner-background");
  };
  return (
    <div
      className="go-back-button"
      onClick={() => {
        handleClick(setGame, setMode);
      }}
    >
      <i className="fa-solid fa-arrow-left"></i>
    </div>
  );
}
export default function App() {
  const [game, setGame] = useState(null);
  const [mode, setMode] = useState(null);
  const [theme, setTheme] = useState("dark");

  //change theme
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  //choose a game
  const handleClick = (game) => {
    setGame(game);
  };
  const handleClickSetMode = (mode) => {
    setMode(mode);
  };

  return (
    <section className={`main-container ${theme} `}>
      <div
        className="settings-button"
        onClick={() =>
          setTheme((prev) => (prev === "light" ? "dark" : "light"))
        }
      >
        <i
          className={`${
            theme === "dark" ? "dark-theme" : "light-theme"
          } fa-solid fa-moon`}
        ></i>
        {theme === "light" ? " Dark Mode" : " Light Mode"}
      </div>

      {!mode && (
        <>
          <h1 className="main-title">Let's Play</h1>

          {!game && (
            <>
              <h2 className="main-subtitle">Choose a game</h2>
              <div className="game-list">
                <div
                  onClick={() => {
                    handleClick(3);
                  }}
                  className="game-div"
                >
                  <img src={image3x3} alt="Tic Tac Tao 3X3" />
                </div>
                <div
                  onClick={() => {
                    handleClick(4);
                  }}
                  className="game-div"
                >
                  <img src={image4x4} alt="Tic Tac Tao 4X4" />
                </div>
                <div
                  onClick={() => {
                    handleClick(5);
                  }}
                  className="game-div"
                >
                  <img src={image5x5} alt="Tic Tac Tao 5X5" />
                </div>
                <div
                  onClick={() => {
                    handleClick(6);
                    setMode("player");
                  }}
                  className="game-div"
                >
                  <img src={connect4} alt="Connect 4 Game" />
                </div>
              </div>
            </>
          )}
          {game && (
            <>
              <GoBackButton
                setGame={setGame}
                setMode={setMode}
                setGameValue={null}
              />
              <h2 className="main-subtitle">Choose a mode</h2>
              <div className="game-list mode-div">
                <div
                  onClick={() => {
                    handleClickSetMode("player");
                  }}
                  className="game-div"
                >
                  <h2 className="two-people-icon">
                    <i class="fi fi-ss-people-pulling"></i>{" "}
                  </h2>
                  <p>Team Up!</p>
                </div>
                <div
                  onClick={() => {
                    handleClickSetMode("easy");
                  }}
                  className="game-div"
                >
                  <h2>
                    <i class="fi fi-sr-walking"></i>VS{" "}
                    <i class="fi fi-sr-microchip-ai"></i>
                  </h2>
                  <p>Easy</p>
                </div>
                <div
                  onClick={() => {
                    handleClickSetMode("medium");
                  }}
                  className="game-div"
                >
                  <h2>
                    <i class="fi fi-sr-walking"></i>VS{" "}
                    <i class="fi fi-sr-microchip-ai"></i>
                  </h2>
                  <p>Medium</p>
                </div>
                <div
                  onClick={() => {
                    handleClickSetMode("hard");
                  }}
                  className="game-div"
                >
                  <h2>
                    <i class="fi fi-sr-walking"></i>VS{" "}
                    <i class="fi fi-sr-microchip-ai"></i>
                  </h2>
                  <p>Hard</p>
                </div>
              </div>
            </>
          )}
        </>
      )}
      {game && mode && (
        <>
          <GoBackButton
            setGame={setGame}
            setMode={setMode}
            setGameValue={game != 6 ? game : null}
          />
          <Board rows={game} theme={theme} mode={mode} />{" "}
        </>
      )}
    </section>
  );
}
