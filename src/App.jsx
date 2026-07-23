import { useEffect, useState } from "react";
import "./App.css";

const tempGames = [
  {
    name: "Spyro",
    rating: 8,
    released: 1998,
  },
  {
    name: "Crash Bandicoot",
    rating: 9,
    released: 1996,
  },
  {
    name: "The Witcher 3: The Wild Hunt",
    rating: 10,
    released: 2025,
  },
];

export default function App() {
  const [search, setSearch] = useState("");
  const [searchRes, setSeachRes] = useState([]);
  const [curGame, setCurGame] = useState({});

  console.log(curGame);

  function handleCloseCur() {
    setCurGame({});
    console.log("Close clicked");
  }

  useEffect(
    function () {
      async function gameSearch() {
        // setIsLoading(true);

        const res = await fetch(
          `https://api.rawg.io/api/games?key=de233b45d19f4794a0550d66ca9f9ed4&search=${search}&search_precise=true`,
        );
        const data = await res.json();
        setSeachRes(data.results);
        console.log(data);
        // setIsLoading(false);
      }

      gameSearch();
    },
    [search],
  );

  return (
    <>
      <Header setSearch={setSearch} />
      <div className="boxes">
        <Box>
          {search.length > 0 ? (
            <p>Showing results for: {search}</p>
          ) : (
            <p>Searched game results will show here</p>
          )}
          <SearchList searchRes={searchRes} setCurGame={setCurGame} />
        </Box>
        <Box>
          {Object.keys(curGame).length === 0 ? (
            <GameLog />
          ) : (
            <CurGame curGame={curGame} handleCloseCur={handleCloseCur} />
          )}
        </Box>
      </div>
    </>
  );
}

function Header({ setSearch }) {
  const [resultsCount, setResultsCount] = useState(0);
  return (
    <header>
      <div className="container">
        <div className="header-wrapper">
          <div className="title">
            <h1>GameLog</h1>
          </div>
          <Search setSearch={setSearch} />
          <ResultsCount resultsCount={resultsCount} />
        </div>
      </div>
    </header>
  );
}

function Search({ setSearch }) {
  return (
    <div className="search">
      <input type="text" onChange={(e) => setSearch(e.target.value)}></input>
    </div>
  );
}

function ResultsCount({ resultsCount }) {
  return (
    <div className="results-count">
      <p>Showing {resultsCount} results</p>
    </div>
  );
}

function Box({ children }) {
  return (
    <div className="box">
      <div className="box-children">{children}</div>
    </div>
  );
}

function SearchList({ searchRes, setCurGame }) {
  return (
    <div className="searched-games-list">
      {searchRes.map(
        (game) =>
          (game.rating > 0 || game.metacritic > 0) && (
            <SingleGame setCurGame={setCurGame} game={game} key={game.id} />
          ),
      )}
    </div>
  );
}

function SingleGame({ game, setCurGame }) {
  return (
    <div
      className="single-game"
      key={game.name}
      onClick={(e) => setCurGame(game)}
    >
      <div className="single-game-image">
        <img src={game.background_image} alt={`${game.name} art`} />
      </div>

      <div className="single-game-content">
        <div className="single-game-title">
          <p>{game.name}</p>
        </div>

        <div className="single-game-info">
          {game.released && <p>🗓️ {new Date(game.released).getFullYear()}</p>}
        </div>
      </div>
    </div>
  );
}

function GameLog() {
  return <GameLogSummary />;
}

function GameLogSummary() {
  return (
    <div className="game-log-summary">
      <div className="game-log-count">
        <p>Number of rated games: X</p>
      </div>
      <div className="game-log-averages">
        <div className="game-log-user-av">
          <p>🎮 Your average rating: X</p>
        </div>
      </div>
    </div>
  );
}

function GameLogList() {}

function CurGame({ curGame, handleCloseCur }) {
  return (
    <div className="current-game">
      <div className="current-game-image">
        <img src={curGame.background_image} alt={`${curGame.name} image`} />
      </div>
      <div className="current-game-name">
        <p>{curGame.name}</p>
      </div>
      <div className="information-rating-section">
        <div className="current-game-information">
          <p>🗓️ Released in: {new Date(curGame.released).getFullYear()}</p>
          <p>
            🎮 Platforms:{" "}
            {curGame.platforms
              .map((platform) => platform.platform.name)
              .join(", ")}
          </p>
          <p>
            ⚔️ Genre: {curGame.genres.map((genre) => genre.name).join(", ")}
          </p>
          <p>⭐️ User Rating: {curGame.rating} / 5</p>
          <p>Ⓜ️ Metacritic Rating: {curGame.metacritic} / 100</p>
        </div>
        <div className="ratings-box-whole">
          <div className="ratings-box">
            <Button>Rate this game</Button>
          </div>
          <div className="close-window">
            <Button onClick={handleCloseCur}>Close window</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <p className="button" onClick={onClick}>
      {children}
    </p>
  );
}
