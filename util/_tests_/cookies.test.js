import { addGameToBookings } from '../cookies';

// test for an empty array, does a game get added

test('add new game to an empty cookie', () => {
  const gameIdToAdd = 1;
  const bookingsCookieValue = [];
  const result = addGameToBookings(bookingsCookieValue, gameIdToAdd);

  expect(result).toEqual([{ gameId: gameIdToAdd, bookings: 1 }]);
});

// test for array not being empty, does the game that is not in get added

test('add new game to the cookie', () => {
  const gameIdToAdd = 1;
  const bookingsCookieValue = [{ gameId: 2, bookings: 1 }];
  const result = addGameToBookings(bookingsCookieValue, gameIdToAdd);

  expect(result).toEqual([
    ...bookingsCookieValue,
    { gameId: gameIdToAdd, bookings: 1 },
  ]);
});

// // test when game already exists in array, does it not get added another time

// test('add same game again', () => {
//   const gameIdToAdd = 1;
//   const bookingsCookieValue = [{ gameId: 1, bookings: 1 }];
//   const result = addGameToBookings(bookingsCookieValue, gameIdToAdd);

//   expect(result).toEqual([{ gameId: gameIdToAdd, bookings: 1 }]);
// });
