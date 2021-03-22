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
  const [inputValue, setInputValue] = useState();
  const [dropdownValue, setDropdownValue] = useState('4');
  const [dropdownPlayerAmount, setDropdownPlayerAmount] = useState('1');
  const [gamesList, setGamesList] = useState([]);

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
    const text = inputValue;

    const games = props.games;
    const result = [];

    for (let i = 0; i < games.length; i++) {
      if (games[i].name.includes(text) || games[i].description.includes(text)) {
        result.push(games[i]);
      }
    }
    console.log(result);
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
      {gamesList.map((game) => (
        <h1 key={game.name}>
          <Link href={`/games/${game.id}`}>
            <p>{game.name}</p>
          </Link>
        </h1>
      ))}
    </>
  );
}
