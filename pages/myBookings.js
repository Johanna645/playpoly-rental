import Head from 'next/head';
// import { css } from '@emotion/react';
// import Link from 'next/link';
import Cookies from 'js-cookie';
// import { createNewRental } from '../util/database';
// import { useState } from 'react';

export default function MyBookings(props) {
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

  return (
    <>
      <Head>
        <title>My Bookings</title>
      </Head>

      <table>
        <thead>
          <tr>
            <th>Games you chose:</th>
          </tr>
        </thead>
        <tbody>
          {props.userBookings.map((gameFromCookie) => (
            <tr key={gameFromCookie.gameId}>
              <td>{gameFromCookie.name}</td>
              <td>
                <button
                  onClick={() => handleClickToRemove(gameFromCookie.gameId)}
                  value="Remove"
                >
                  Remove game
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    // createNewRental(props.user.id, gameFromCookie.gameId)
                    rentGame(gameFromCookie.gameId)
                  }
                  value="Rent"
                >
                  Rent game
                </button>
              </td>
            </tr>
          ))}
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

  const { getAllGames } = await import('../util/database');
  const games = await getAllGames();

  const { getUserIdFromSessions } = await import('../util/database');
  const token = context.req.cookies.session;
  const userId = await getUserIdFromSessions(token);
  const id = userId.userId;

  const { getUserById } = await import('../util/database');
  const user = await getUserById(id);

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

  return { props: { games: games, user: user, userBookings: userBookings } };
}
