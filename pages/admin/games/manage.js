import Head from 'next/head';
import Layout from '../../../components/Layout';
import { css } from '@emotion/react';
import { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/router';

export default function Manage() {
  const [games, setGames] = useState([]);
  const [name, setName] = useState('');
  const [playerMinimum, setPlayerMinimum] = useState();
  const [playerMaximum, setPlayerMaximum] = useState();
  const [age, setAge] = useState();
  const [description, setDescription] = useState('');
  // const router = useRouter();

  async function showGames() {
    const response = await fetch('/api');
    const newGames = await response.json();
    setGames(newGames.games);
  }

  return (
    <>
      <Head>
        <title>Manage</title>
      </Head>
      <h1>Manage games and rentals</h1>

      <h2>Add new game</h2>
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
          Game name:
          <input
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Minimum player amount:
          <input
            value={playerMinimum}
            onChange={(event) => {
              setPlayerMinimum(event.currentTarget.value);
            }}
          />
        </label>
        <label>
          Maximum player amount:
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
          <textarea
            value={description}
            onChange={(event) => {
              setDescription(event.currentTarget.value);
            }}
          />{' '}
          {/* here might be another type needed, like a textfield */}
        </label>
        <button>Add game</button>
      </form>
      <h2>Edit games and rentals</h2>
      <button onClick={showGames}>See all games</button>
      <div>
        <ul>
          {games.map((game) => (
            <li key={`game-${game.id}`}>
              <Link href={`/admin/games/${game.id}`}>
                <p>{game.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { getAllGames } = await import('../../../util/database');
  const games = await getAllGames();

  return { props: { games: games } };
}
// export async function getServerSideProps(context) {
//   const {
//     getSingleUser,
//     makeUserAdmin,
//     getAllGames,
//     getSingleGame,
//   } = await import('../../../util/database');

//   const user = await getSingleUser(context.query.userId);
//   const userId = user.userId;

//   const userAdmin = await makeUserAdmin(userId);

//   const allGames = await getAllGames();
//   const gameId = context.query.gameId;

//   const game = await getSingleGame(gameId);

//   return {
//     props: { user: user, makeUserAdmin: userAdmin, game: game || null },
//   };
// }
