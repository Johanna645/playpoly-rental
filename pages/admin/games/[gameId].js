// these pages need the authentification so that only admin can do stuff here

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function EditGame(props) {
  const router = useRouter();
  // this might be handy for the reservation stuff
  const [state, setState] = useState('');
  // example
  const [name, setName] = useState(props.game?.name);

  if (!props.game) {
    return (
      <>
        <Head>
          <title>No such game found</title>
        </Head>
        <div>No such game</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit game</title>
      </Head>
      <h1>Edit game</h1>

      <div>id: {props.game.id}</div>
      <div>name: {props.game.name} </div>
      <input
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />

      <button
        onClick={async () => {
          await fetch(`/api/${props.game.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name }),
          }); // here the information is passed on to the api-[gameId]

          //this needs to change still
          window.location.reload();
        }}
      >
        Change game name
      </button>

      <button
        onClick={async () => {
          const confirmed = window.confirm('Really remove?');
          if (!confirmed) return;
          await fetch(`/api/${props.game.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            // here is no body needed, since no new information is passed on, this is just deleting
          });
          router.push('/games'); // maybe here still admin all games page?
        }}
      >
        Remove game
      </button>
    </>
  );
}

export async function getServerSideProps(context) {
  const { getSingleGame } = await import('../../../util/database');

  const id = context.query.gameId;
  const game = await getSingleGame(id);

  if (!game) {
    context.res.statusCode = 404;
  }

  return {
    props: { game: game || null },
  };
}
