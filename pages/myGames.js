import Head from 'next/head';
// import { css } from '@emotion/react';
// import Link from 'next/link';
import Cookies from 'js-cookie';
// import { createNewRental } from '../util/database';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function MyGames(props) {
  const router = useRouter();

  const [showRentalSuccess, setShowRentalSuccess] = useState(false);

  function handleClickToRemove(gameId) {
    const newCookie = props.userBookings.filter(
      (game) => game.gameId !== gameId,
    );
    Cookies.set('bookings', JSON.stringify(newCookie));

    router.push('/myGames');

    return false; // returns nothing, function is supposed just to filter and set the cookie anew
  }

  async function rentGames() {
    props.userBookings.forEach((game) => {
      fetch(`/api/gameId/${game.gameId}`);
    });

    Cookies.remove('bookings');
    setShowRentalSuccess(true);
  }

  return (
    <>
      <Head>
        <title>My Cart</title>
      </Head>
      {showRentalSuccess ? (
        <div className="alert alert-success mb-5" role="alert">
          The games are yours - have fun!{' '}
          <span role="img" aria-label="Smiley">
            😊
          </span>
        </div>
      ) : (
        <>
          <h2>Cart:</h2>

          {props.userBookings.length === 0 ? (
            <div className="alert alert-info" role="alert">
              Your cart is empty. Pick a game and add it.
            </div>
          ) : (
            <>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Game name</th>
                    <th scope="col"></th>
                  </tr>
                </thead>

                <tbody>
                  {props.userBookings.map((gameFromCookie) => (
                    <tr key={gameFromCookie.gameId}>
                      <td>{gameFromCookie.name}</td>

                      <td>
                        <span
                          className="btn-group"
                          role="group"
                          aria-label="Basic example"
                        >
                          <button
                            type="button"
                            className="btn btn-small btn-danger"
                            onClick={() =>
                              handleClickToRemove(gameFromCookie.gameId)
                            }
                            value="Remove"
                          >
                            Remove
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                className="btn btn-primary mb-5"
                disabled={showRentalSuccess}
                onClick={() => rentGames()}
                value="Rent"
              >
                Rent All
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const {
    getAllGames,
    getUserIdFromSessions,
    getUserById,
    canUserReserve,
  } = await import('../util/database');
  const games = await getAllGames();

  const token = context.req.cookies.session;
  const userId = await getUserIdFromSessions(token);
  const id = userId.userId;

  const user = await getUserById(id);

  const isReservationPossible = await canUserReserve(id);

  const bookings = context.req.cookies.bookings;
  const bookingsList = bookings ? JSON.parse(bookings) : [];

  const userBookings = [];

  bookingsList.forEach((gameFromCookie) => {
    const singleGame = games.find((game) => game.id === gameFromCookie.gameId);

    if (singleGame !== undefined) {
      const gameInfo = {
        gameId: gameFromCookie.gameId,
        name: singleGame.name,
      };
      userBookings.push(gameInfo);
    }
  });

  return {
    props: {
      games: games,
      user: user,
      userBookings: userBookings,
      canUserReserve: isReservationPossible,
    },
  };
}
