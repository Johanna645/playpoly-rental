import Head from 'next/head';
import Layout from '../../components/Layout';

import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useState } from 'react';
import { addGameToBookings } from '../../util/cookies';
import { isUserAdmin, canUserReserve } from '../../util/database';

export default function Game(props) {
  // 2. state variable with the value from the cookie read in getServerSideProps
  const [bookings, setBookings] = useState(props.bookingsCookieValue);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [showReservationSuccess, setShowReservationSuccess] = useState(false);

  // 3. After adding the bookings with the button, ( = every time the state variable updates,) set a new value to the cookie, sent also to server when refreshed or loaded
  useEffect(() => {
    Cookies.set('bookings', bookings);
  }, [bookings]);

  if (!props.game) {
    return <div>No such game</div>;
  }

  async function makeAReservationForGame(idReservation) {
    const response = await fetch(`/api/reservation/${idReservation}`);
    const data = await response.json();
    console.log(data);
    setShowReservationSuccess(true);
  }

  return (
    <>
      <Head>
        <title>{props.game.name}</title>
      </Head>
      <h1>{props.game.name}</h1>
      <br />
      <div class="container-sm">
        {' '}
        For {props.game.playerMinimum} - {props.game.playerMaximum} players
      </div>
      <div class="container-sm"> Recommended age: {props.game.age}+</div>
      <br />
      <div class="container-sm"> {props.game.description}</div>

      <br />
      {/*
        only show if
        - available for rent
        - currently logged in

      */}
      {props.game.userIdRental === null && props.userId !== null && (
        <button
          id="booking"
          className="btn btn-primary"
          disabled={showBookingSuccess}
          onClick={() => {
            const newBooking = addGameToBookings(bookings, props.game.id);

            setBookings(newBooking);
            setShowBookingSuccess(true);
          }}
        >
          Add to Cart
        </button>
      )}

      {props.userId == null && (
        <div className="alert alert-info" role="alert">
          Log in to rent this game.
        </div>
      )}

      {props.game.userIdRental != null &&
        props.game.userIdRental === props.userId && (
          <div className="alert alert-info" role="alert">
            You currently rent this game.
          </div>
        )}

      {props.game.userIdRental !== null &&
        props.game.userIdRental !== props.userId && (
          <>
            <div className="alert alert-warning" role="alert">
              This game is currently rented out. If you want, we can notify you
              when it is returned.
            </div>
            <br />
            <button
              disabled={!props.canUserReserve || showReservationSuccess}
              className="btn btn-primary"
              onClick={() => makeAReservationForGame(props.game.id)}
              value="Reservation"
            >
              Notify when Available
            </button>
          </>
        )}

      <br />
      {showBookingSuccess && (
        <>
          <br />
          <div className="alert alert-success" role="alert">
            Successfully added {props.game.name} to your games!
          </div>
        </>
      )}
      {showReservationSuccess && (
        <>
          <br />
          <div className="alert alert-success" role="alert">
            We will notify you when the game becomes available.
          </div>
        </>
      )}

      <br />
    </>
  );
}

export async function getServerSideProps(context) {
  const { getSingleGame, getUserIdFromSessions } = await import(
    '../../util/database'
  );

  const gameId = context.query.gameId;
  const game = await getSingleGame(gameId);

  if (!game) {
    context.res.statusCode = 404;
  }

  const token = context.req.cookies.session;
  const userId = await getUserIdFromSessions(token);

  const isAdmin = userId == null ? false : await isUserAdmin(userId.userId);
  const isReservationPossible = await canUserReserve(gameId);

  // 1. Cookie is read and if there is no cookie value yet, it will start an empty array
  const bookings = context.req.cookies.bookings;

  const bookingsCookieValue = bookings ? JSON.parse(bookings) : [];

  return {
    props: {
      bookingsCookieValue: bookingsCookieValue,
      game: game || null,
      userId: userId == null ? null : userId.userId,
      isAdmin: isAdmin,
      canUserReserve: isReservationPossible,
    },
  };
}
