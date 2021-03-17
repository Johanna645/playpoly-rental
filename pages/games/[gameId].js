import Head from 'next/head';

export default function Game(props) {
  if (!props.game) {
    return <div>No such game</div>;
  }

  return (
    <>
      <Head>
        <title>{props.game.name}</title>
      </Head>
      <h1>{props.game.name}</h1>
      <p></p>
      <div>id: {props.game.id}</div>
      <div>name: {props.game.name}</div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { getSingleGame } = await import('../../util/database');
  const id = context.query.gameId;
  const game = await getSingleGame(id);

  if (!game) {
    context.res.statusCode = 404;
  }

  return { props: { game: game || null } };
}
