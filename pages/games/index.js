import Head from 'next/head';

import Link from 'next/link';

export async function getServerSideProps() {
  const { getAllGames } = await import('../../util/database');
  const games = await getAllGames();

  return { props: { games: games } };
}

export default function Games(props) {
  return (
    <div>
      <Head>
        <title>Games</title>
      </Head>
      <h1>Games</h1>
      <p>this page shows you all our games</p>

      <div>
        <ul>
          {props.games.map((game) => (
            <li key={`game-${game.id}`}>
              <p>{game.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
