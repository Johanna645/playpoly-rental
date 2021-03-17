import Head from 'next/head';
import useState from 'react';

import Link from 'next/link';

export async function getServerSideProps() {
  const { getAllGames } = await import('../../util/database');
  const games = await getAllGames();

  return { props: { games: games } };
}

export default function Games(props) {
  const [games, setGames] = useState([]);

  // so this gets the info from the api, which gets it from database
  async function handleClick() {
    const response = await fetch('/api');
    const newGames = await response.json();
    setGames(newGames.games);
  }

  return (
    <div>
      <Head>
        <title>Games</title>
      </Head>
      <h1>Games</h1>
      <p>this page shows you all our games</p>
      <button>Load games</button>
      <div>
        <ul>
          {games.map((game) => (
            <li key={`game-${game.id}`}>
              <p>{game.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
