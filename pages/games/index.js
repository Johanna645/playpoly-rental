import Head from 'next/head';
import Layout from '../../components/Layout';
import Link from 'next/link';

export async function getServerSideProps() {
  const { getAllGames } = await import('../../util/database');
  const games = await getAllGames();

  return { props: { games: games } };
}

export default function Games(props) {
  return (
    <>
      <Head>
        <title>Games</title>
      </Head>

      <h1>All our games listed</h1>

      <div>
        <ul>
          {props.games.map((game) => (
            <li key={`game-${game.id}`}>
              <Link href={`/games/${game.id}`}>
                <a>{game.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
