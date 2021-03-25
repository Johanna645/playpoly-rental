import Head from 'next/head';
import Layout from '../../components/Layout';

import { css } from '@emotion/react';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useState } from 'react';
import { addGameToBookings } from '../../util/cookies';

export default function Game(props) {
  // 2. state variable with the value from the cookie read in getServerSideProps
  const [bookings, setBookings] = useState(props.bookingsCookieValue);
  // const [reservation, setReservation] = useState(props.reservation); // not there yet!!

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
  }

  function disableAndEnableButtons() {
    if (props.game.userIdRental === null) {
      document.getElementById('booking').disabled = false;
      document.getElementById('reservation').disabled = true;
    }
    if (props.game.userIdRental !== null) {
      document.getElementById('booking').disabled = true;
      document.getElementById('reservation').disabled = false;
    }
  }
  disableAndEnableButtons();

  return (
    <>
      <Head>
        <title>{props.game.name}</title>
      </Head>
      <h1>{props.game.name}</h1>

      <div>id: {props.game.id}</div>
      <div>name: {props.game.name}</div>
      <div>
        {' '}
        amount of players: {props.game.playerMinimum} -{' '}
        {props.game.playerMaximum}
      </div>
      <div> recommended age: {props.game.age}</div>
      <div> game description: {props.game.description}</div>

      <button
        id="booking"
        onClick={() => {
          const newBooking = addGameToBookings(bookings, props.game.id);

          setBookings(newBooking);
        }}
      >
        Add to My Bookings
      </button>
      <button
        onClick={() => makeAReservationForGame(props.game.id)}
        value="Reservation"
      >
        Make a reservation
      </button>
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

  // 1. Cookie is read and if there is no cookie value yet, it will start an empty array
  const bookings = context.req.cookies.bookings;

  const bookingsCookieValue = bookings ? JSON.parse(bookings) : [];

  return {
    props: {
      bookingsCookieValue: bookingsCookieValue,
      game: game || null,
    },
  };
}
