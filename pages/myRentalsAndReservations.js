import { GetServerSidePropsContext } from 'next';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';

export default function Profile(props) {
  // to prevent user from seeing other users pages
  if (!props.user) {
    return (
      <>
        <Head>
          <title>{props.errors[0].message}</title>
        </Head>

        <h1>{props.errors[0].message}</h1>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>User Profile: {props.user.username}</title>
      </Head>

      <h1>Hello {props.user.username}!</h1>
      <h2>Your current rentals are</h2>
      <div>
        <ul>
          {props.rentals.map((game) => (
            <li key={`game-${game.name}`}>
              <Link href={`/games/${game.id}`}>
                <a>{game.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <h2>Your current reservations are</h2>
      <div>
        <ul>
          {props.reservations.map((game) => (
            <li key={`game-${game.name}`}>
              <Link href={`/games/${game.id}`}>
                <a>{game.name}</a>
              </Link>

              <div class="btn-group" role="group" aria-label="Basic example">
                <button
                  type="button"
                  className="btn btn-small btn-danger"
                  value="Remove"
                  onClick={async () => {
                    const confirmed = window.confirm('Really remove?');
                    if (!confirmed) return;
                    await fetch(`/api/`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        name: game.name,
                        userIdReservation: null,
                      }),
                    });
                  }} // diese funktioniert nicht! was für ein api-route kann ich hier eingeben?! weil für nur api(index.ts) reicht nicht diese info
                >
                  x
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const {
    getUserById,
    getSessionByToken,

    getAllRentalsFromUser,
    getAllReservationsFromUser,
    handleReservationPullback,
  } = await import('../util/database');

  const session = await getSessionByToken(context.req.cookies.session);

  // if (!session || session.userId !== Number(context.query.userId)) {
  //   return {
  //     props: {
  //       user: null,
  //       errors: [{ message: 'Access denied' }],
  //     },
  //   };
  // }

  const user = await getUserById(session.userId);
  // console.log('to see what user is', user);

  const rentals = await getAllRentalsFromUser(user.id);

  const reservations = await getAllReservationsFromUser(user.id);

  return {
    props: { user: user, rentals: rentals, reservations: reservations },
  };
}
