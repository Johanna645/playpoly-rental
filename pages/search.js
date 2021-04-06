import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export async function getServerSideProps() {
  const { getAllGames } = await import('../util/database');
  const games = await getAllGames();

  return { props: { games: games } };
}

export default function Search(props) {
  const [inputValue, setInputValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState('4');
  const [dropdownPlayerAmount, setDropdownPlayerAmount] = useState('1');
  const [gamesList, setGamesList] = useState(props.games);

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  function handleDropdownPlayerAmountChange(event) {
    setDropdownPlayerAmount(event.target.value);
  }

  function handleDropdownChange(event) {
    setDropdownValue(event.target.value);
  }

  function filterEverything(event) {
    // console.log(event);
    event.preventDefault();

    const games = props.games;
    const result = [];

    const searchStringLowerCase = inputValue.toLowerCase();
    const chosenAgeValue = Number(dropdownValue);
    const chosenPlayerAmount = Number(dropdownPlayerAmount);

    for (let i = 0; i < games.length; i++) {
      const gameNameLowerCase = games[i].name.toLowerCase();
      const gameDescriptionLowerCase = games[i].description.toLowerCase();

      if (
        (gameNameLowerCase.includes(searchStringLowerCase) ||
          gameDescriptionLowerCase.includes(searchStringLowerCase)) &&
        (games[i].age === chosenAgeValue || games[i].age > chosenAgeValue) &&
        (games[i].playerMinimum === chosenPlayerAmount ||
          games[i].playerMaximum === chosenPlayerAmount ||
          games[i].playerMaximum > chosenPlayerAmount)
      ) {
        result.push(games[i]);
      }
    }
    setGamesList(result);
  }

  function clearFilters() {
    setInputValue('');
    setDropdownValue(4);
    setDropdownPlayerAmount(1);
    setGamesList(props.games);
  }

  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <h1 data-cy="games-page-content-h1">Search for games</h1>
      <form className="row g3" onSubmit={filterEverything}>
        <div className="col-sm-4">
          <label for="searchText">
            Name or Description
            <input
              className="form-control"
              type="text"
              id="searchText"
              value={inputValue}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="col-sm-1">
          <label for="players">
            Players
            <select
              className="form-select"
              type="integer"
              id="players"
              value={dropdownPlayerAmount}
              onChange={handleDropdownPlayerAmountChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">4+</option>
            </select>
          </label>
        </div>
        <div className="col-sm-2">
          <label for="ageGroup">
            Age group
            <select
              className="form-select"
              name="age"
              id="ageGroup"
              type="integer"
              value={dropdownValue}
              onChange={handleDropdownChange}
            >
              <option value="4">4+</option>
              <option value="6">6+</option>
              <option value="8">8+</option>
              <option value="10">10+</option>
              <option value="12">12+</option>
            </select>
          </label>
        </div>
        <div className="col-sm-2 d-flex flex-column">
          <button
            className="btn btn-primary mt-auto"
            // onClick={filterEverything}
          >
            Search
          </button>
        </div>

        <div className="col-sm-2 d-flex flex-column">
          <button className="btn btn-primary mt-auto" onClick={clearFilters}>
            Show All
          </button>
        </div>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Players</th>
            <th scope="col">Age</th>
          </tr>
        </thead>
        <tbody>
          {gamesList.map((game) => (
            <tr data-cy="games-page-content-game" key={game.name}>
              <th scope="row">{game.id}</th>
              <td>
                <Link href={`/games/${game.id}`}>
                  <a>{game.name}</a>
                </Link>
              </td>
              <td>
                {game.playerMinimum} - {game.playerMaximum}
              </td>
              <td>{game.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
