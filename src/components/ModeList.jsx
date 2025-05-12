export default function ModeList({ handleClickSetMode }) {
  return (
    <>
      <h2 className="main-subtitle">Choose a mode</h2>
      <div className="game-list mode-div">
        <div
          onClick={() => {
            handleClickSetMode("player");
          }}
          className="game-div"
        >
          <h2 className="two-people-icon">
            <i className="fi fi-ss-people-pulling"></i>{" "}
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
            <i className="fi fi-sr-walking"></i>VS{" "}
            <i className="fi fi-sr-microchip-ai"></i>
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
            <i className="fi fi-sr-walking"></i>VS{" "}
            <i className="fi fi-sr-microchip-ai"></i>
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
            <i className="fi fi-sr-walking"></i>VS{" "}
            <i className="fi fi-sr-microchip-ai"></i>
          </h2>
          <p>Hard</p>
        </div>
      </div>
    </>
  );
}
