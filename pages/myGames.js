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

  async function rentGame(id) {
    const response = await fetch(`/api/gameId/${id}`);
    const data = await response.json();
    console.log(data);
  }

  async function makeAReservationForGame(idReservation) {
    const response = await fetch(`/api/reservation/${idReservation}`);
    const data = await response.json();
    console.log(data);
  }

  return (
    <>
      <Head>
        <title>My Games</title>
      </Head>
      <h2>Games chosen:</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Game name</th>
            <th scope="col"></th>
            <th scope="col"></th>
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
                    class="btn btn-outline-dark"
                    onClick={() => handleClickToRemove(gameFromCookie.gameId)}
                    value="Remove"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-dark"
                    disabled={showRentalSuccess}
                    onClick={() => rentGame(gameFromCookie.gameId)}
                    value="Rent"
                  >
                    Rent
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-dark"
                    disabled={!props.canUserReserve}
                    onClick={() =>
                      makeAReservationForGame(gameFromCookie.gameId)
                    }
                    value="Reservation"
                  >
                    Reserve
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

      {/* <button
      here possible still old bookings listed and empty bookings-cookie
      Cookies.remove('bookings')

      </button> */}
    </>
  );
}

export async function getServerSideProps(context) {
  // here maybe still list of possible old bookings out of the database

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
