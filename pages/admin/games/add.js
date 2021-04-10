import Head from 'next/head';
import { useState } from 'react';

export default function AddNewGame() {
  const [name, setName] = useState('');
  const [playerMinimum, setPlayerMinimum] = useState();
  const [playerMaximum, setPlayerMaximum] = useState();
  const [age, setAge] = useState();
  const [description, setDescription] = useState('');
  return (
    <>
      <Head>
        <title>Add New Game</title>
      </Head>
      <h1>Add new game</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          await fetch('/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name,
              playerMinimum: playerMinimum,
              playerMaximum: playerMaximum,
              age: age,
              description: description,
            }),
          });
        }}
      >
        <label>
          Name:
          <input
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Minimum Player Amount:
          <input
            value={playerMinimum}
            onChange={(event) => {
              setPlayerMinimum(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Maximum Player Amount:
          <input
            value={playerMaximum}
            onChange={(event) => {
              setPlayerMaximum(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Recommended age:
          <input
            value={age}
            onChange={(event) => {
              setAge(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Description:
          <input
            value={description}
            onChange={(event) => {
              setDescription(event.currentTarget.value);
            }}
          />{' '}
          {/* here might be another type needed, like a textfield */}
        </label>
        <button>Add game</button>
      </form>
    </>
  );
}
