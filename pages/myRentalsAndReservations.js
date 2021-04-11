import { GetServerSidePropsContext } from 'next';
import Layout from '../components/Layout';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Profile(props) {
  const router = useRouter();

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

      <h1>My Games</h1>
      <p>
        Hello {props.user.username}, good to see you! If you are someone else,
        please log out.
      </p>

      <h2>My Rentals</h2>
      <p>These games are currently with you.</p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Game</th>
          </tr>
        </thead>
        <tbody>
          {props.rentals.map((game) => (
            <tr data-cy="rented-game" key={`game-${game.name}`}>
              <td>
                <Link href={`/games/${game.id}`}>
                  <a>{game.name}</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>My Reservations</h2>
      <p>You will be notified when any of these games is returned.</p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Game</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {props.reservations.map((game) => (
            <tr key={`game-${game.name}`}>
              <td>
                <Link href={`/games/${game.id}`}>
                  <a>{game.name}</a>
                </Link>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={async () => {
                    await fetch(`/api/reservation/${game.id}`, {
                      method: 'PATCH',
                    });

                    router.push('/myRentalsAndReservations');
                  }}
                >
                  Cancel Reservation
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

  const user = await getUserById(session.userId);

  const rentals = await getAllRentalsFromUser(user.id);

  const reservations = await getAllReservationsFromUser(user.id);

  return {
    props: { user: user, rentals: rentals, reservations: reservations },
  };
}
