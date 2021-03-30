import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { css } from '@emotion/react';

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

  function filterByName() {
    /*
    const text = inputValue;
    const textWithCapital = text[0].toUpperCase() + text.slice(1);
    */

    const searchStringLowerCase = inputValue.toLowerCase();

    const games = props.games;
    const result = [];

    for (let i = 0; i < games.length; i++) {
      const gameNameLowerCase = games[i].name.toLowerCase();
      const gameDescriptionLowerCase = games[i].description.toLowerCase();

      if (
        gameNameLowerCase.includes(searchStringLowerCase) ||
        gameDescriptionLowerCase.includes(searchStringLowerCase)
      ) {
        result.push(games[i]);
      }
    }

    setGamesList(result);
  }

  function filterByAge() {
    const chosenValue = Number(dropdownValue);
    const games = props.games;
    const result = [];

    for (let i = 0; i < games.length; i++) {
      if (games[i].age === chosenValue || games[i].age > chosenValue) {
        result.push(games[i]);
      }
    }
    setGamesList(result);
  }

  function filterByPlayerAmount() {
    const chosenValue = Number(dropdownPlayerAmount);
    const games = props.games;
    const result = [];

    for (let i = 0; i < games.length; i++) {
      if (
        games[i].playerMinimum === chosenValue ||
        games[i].playerMaximum === chosenValue ||
        games[i].playerMaximum > chosenValue
      ) {
        result.push(games[i]);
      }
    }
    setGamesList(result);
  }
  return (
    <>
      <Head>
        <title>Search</title>
      </Head>
      <h1>Search for games</h1>
      {/* // a search bar with game name and a filter dropdown */}
      {/* <form class="row row-cols-lg-auto g-3 align-items-center">
        <div class="col-12">
        <label class="visually-hidden" for="inlineFormInputGroupUsername">Username</label>
    <div class="input-group">
      <div class="input-group-text">@</div>
      <input type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Username">
    </div>
  </div>

  <div class="col-12">
    <label class="visually-hidden" for="inlineFormSelectPref">Preference</label>
    <select class="form-select" id="inlineFormSelectPref">
      <option selected>Choose...</option>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
    </select>
  </div>

  <div class="col-12">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="inlineFormCheck">
      <label class="form-check-label" for="inlineFormCheck">
        Remember me
      </label>
    </div>
  </div>

  <div class="col-12">
    <button type="submit" class="btn btn-primary">Submit</button>
  </div>
</form> */}
      <div>
        <input
          type="text"
          id="searchText"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={filterByName}>Search</button>
      </div>
      <div>
        <select
          className="form-select"
          type="integer"
          value={dropdownPlayerAmount}
          onChange={handleDropdownPlayerAmountChange}
        >
          <option selected>Choose amount of players</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">4+</option>
        </select>

        <label for="players">
          Choose amount of players:
          <select
            name="players"
            id="players"
            type="integer"
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
        <div>
          <button onClick={filterByPlayerAmount}>filter</button>
        </div>
      </div>
      <div>
        <label for="age">
          Choose recommended age:
          <select
            name="age"
            id="age"
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
      <div>
        <button onClick={filterByAge}>filter</button>
      </div>{' '}
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
            <tr key={game.name}>
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
