import Head from 'next/head';
import { css } from '@emotion/react';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function MyBookings(props) {
  function handleClickToRemove(gameId) {
    const newCookie = JSON.parse(Cookies.get('bookings')).filter(
      (game) => game.gameId !== gameId,
    );
    Cookies.set('bookings', JSON.stringify(newCookie));
    return false; // returns nothing, function is supposed just to filter and set the cookie anew
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* here possible still old bookings listed and then confirm bookings button to send info over to rentals / inventory table in the database */}
    </>
  );
}

export async function getServerSideProps(context) {
  // here maybe still list of possible old bookings out of the database

  const { getAllGames } = await import('../util/database');
  const games = await getAllGames();

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

  return { props: { userBookings: userBookings } };
}
