import Head from 'next/head';
// import { css } from '@emotion/react';
// import Link from 'next/link';
import Cookies from 'js-cookie';
// import { createNewRental } from '../util/database';
import { useState } from 'react';

export default function MyGames(props) {
  const [showRentalSuccess, setShowRentalSuccess] = useState(false);

  function handleClickToRemove(gameId) {
    const newCookie = JSON.parse(Cookies.get('bookings')).filter(
      (game) => game.gameId !== gameId,
    );
    Cookies.set('bookings', JSON.stringify(newCookie));
    return false; // returns nothing, function is supposed just to filter and set the cookie anew
  }

  async function rentGames() {
    props.userBookings.forEach((game) => {
      fetch(`/api/gameId/${game.gameId}`);
    });

    Cookies.remove('bookings');
  }

  return (
    <>
      <Head>
        <title>My Cart</title>
      </Head>
      <h2>Cart:</h2>

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
                <div class="btn-group" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    class="btn btn-small btn-danger"
                    onClick={() => handleClickToRemove(gameFromCookie.gameId)}
                    value="Remove"
                  >
                    x
                  </button>
                </div>
              </td>
            </tr>
          ))}
          <div>
            {showRentalSuccess && (
              <p>Rental of {props.gameFromCookie.name} accepted!</p>
            )}
          </div>
        </tbody>
      </table>

      <button
        type="button"
        class="btn btn-primary"
        disabled={showRentalSuccess}
        onClick={() => rentGames()}
        value="Rent"
      >
        Rent All
      </button>
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
