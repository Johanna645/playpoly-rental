import { generateToken } from './sessions';
import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';
import { serializeEmptyCookieServerSide } from './cookies';
import { getCookieParser } from 'next/dist/next-server/server/api-utils';
require('dotenv-safe').config();

// const camelcaseKeys = require('camelcase-keys');

// import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';

// setPostgresDefaultsOnHeroku(); and then some other lines about heroku

function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production') {
    sql = postgres({ ssl: true });
  } else {
    if (!globalThis._postgreSqlClient) {
      globalThis._postgreSqlClient = postgres();
    }
    sql = globalThis._postgreSqlClient;
  }
  return sql;
}

const sql = connectOneTimeToDatabase();

function camelcaseRecords(records) {
  return records.map((record) => camelcaseKeys(record));
}

export async function getAllGames() {
  const games = await sql`SELECT * FROM games`;
  return camelcaseRecords(games);
}

export async function getSingleGame(id) {
  const game = await sql`SELECT * FROM games WHERE id = ${id}`;
  return camelcaseRecords(game)[0];
}

export async function createNewGame(
  name,
  player_minimum,
  player_maximum,
  age,
  description,
  user_id_rental,
) {
  const game = await sql`
    INSERT INTO games(name,
	player_minimum, player_maximum,
	age,
	description, user_id_rental)
	VALUES (${name}, ${player_minimum}, ${player_maximum}, ${age}, ${description}, ${null})
  RETURNING *
  `;
  return camelcaseRecords(game)[0];
}

export async function deleteGameById(id) {
  const game = await sql`
  DELETE FROM
    games
  WHERE
    id = ${id}
  RETURNING *
  `;
  return camelcaseRecords(game)[0];
}

// this just extra for api safety
export async function deleteGameByIdAndUserId(id, userId) {
  return await sql`
   DELETE FROM
   games
   WHERE
   id = ${id} AND user_id = ${userId}
   RETURNING *
  `;
}

export async function isUserAdmin(id) {
  const user = await sql`
  SELECT
    is_admin
  FROM
    users
  WHERE
    id = ${id}
  `;

  return camelcaseRecords(user)[0].isAdmin;
}

export async function makeUserAdmin(id, isAdmin) {
  const staffMember = await sql`
    UPDATE
			users
		SET
			is_admin = ${isAdmin}
		WHERE
			id = ${id}
  `;
  return camelcaseRecords(staffMember)[0];
}

export async function isGameAvailable(gameId) {
  /*
  const game = await sql`
  SELECT
    user_id_rental
  FROM
    games
  WHERE
    id = ${gameId}
  `;

  return camelcaseRecords(game)[0] === null;

  */

  // is null -> überprüft user_id_rental und gibt true oder false zurück und erzeugt dafür eine "temporäre spalte" ohne namen
  // 'available' ist der name ('alias') für die "temporäre spalte" in der jetzt true oder false steht; wird verwendet im return für .available; name könnte auch ein anderer sein, z. B. can_rent, dann muss es auch im return [0].can_rent heissen

  const availability = await sql`
 SELECT
    (user_id_rental is null) available
  FROM
    games
  WHERE
    id = ${gameId}
    `;

  return camelcaseRecords(availability)[0].available;
}

export async function canUserReserve(gameId) {
  const game = await sql`
  SELECT
    user_id_reservation,
    user_id_rental
  FROM
    games
  WHERE
    id = ${gameId}
  `;
  // console.log(camelcaseRecords(game)[0].userIdReservation);
  if (camelcaseRecords(game)[0].userIdReservation !== null) {
    return false;
  }

  if (camelcaseRecords(game)[0].userIdRental === null) {
    return false;
  }

  return true;
}

export async function createNewRental(userId, gameId) {
  const newRental = await sql`
     UPDATE
       games
     SET
       user_id_rental = ${userId}
     WHERE
       id = ${gameId}
 `;
  return camelcaseRecords(newRental)[0];
}

export async function handleRentalReturn(gameId) {
  const game = await sql`
  UPDATE
    games
  SET
    user_id_rental = null
  WHERE
    id = ${gameId}
  `;
  return camelcaseRecords(game)[0];
}

export async function createReservation(userId, gameId) {
  const newReservation = await sql`
     UPDATE
       games
     SET
       user_id_reservation = ${userId}
     WHERE
       id = ${gameId}
 `;
  return camelcaseRecords(newReservation)[0];
}

export async function handleReservationPullback(gameId) {
  const game = await sql`
  UPDATE
    games
  SET
    user_id_reservation = null
  WHERE
    id = ${gameId}
  `;
  return camelcaseRecords(game)[0];
}

export async function getAllUsers() {
  const users = await sql`SELECT * FROM users`;
  return camelcaseRecords(users);
}

export async function getSingleUser(id) {
  const user = await sql`SELECT * FROM users WHERE id = ${id}`;
  return camelcaseRecords(user)[0];
}

export async function getAllRentalsFromUser(id) {
  const games = await sql`SELECT name FROM games WHERE user_id_rental = ${id}`;
  return camelcaseRecords(games);
}

export async function getAllReservationsFromUser(id) {
  const games = await sql`SELECT name FROM games WHERE user_id_reservation = ${id}`;
  return camelcaseRecords(games);
}

// this is something for the later phase, just mock now
// SQL JOINS
// export async function getUserWithRoleById(id) {
//   const user = await sql`
//     SELECT
//       user.id as user_id,
//       user.first_name as first_name,
//       roles.name as role_name

//     FROM
//       users,
//       roles
//     WHERE
//       user.id = ${id} AND
//       user.role_id = roles.id
//   `;
//   return camelcaseRecords(user)[0];
// }

export async function getUserIdFromSessions(sessionToken) {
  if (!sessionToken) {
    return undefined;
  } // if there is no token, then the database query will not be done

  const sessions = await sql`
    SELECT
      user_id
    FROM
      sessions
    WHERE
      token = ${sessionToken} AND
      expiry > NOW()
  `;
  return camelcaseRecords(sessions)[0];
}

export async function getSessionByToken(sessionToken) {
  if (!sessionToken) {
    return undefined;
  } // if there is no token, then the database query will not be done

  const sessions = await sql`
    SELECT
      *
    FROM
      sessions
    WHERE
      token = ${sessionToken} AND
      expiry > NOW()
  `;
  console.log(sessions);
  return camelcaseRecords(sessions)[0];
}

export async function isSessionTokenNotExpired(sessionToken) {
  const sessions = await sql`
    SELECT
      *
    FROM
      sessions
    WHERE
      token = ${sessionToken} AND
      expiry > NOW()
  `;
  // this returns an array and if the array is empty, then it means that the token is expired (isSessionCookieValid = false) and this length > 0 means the token is valid
  return sessions.length > 0;
}

export async function createSessionWithFiveMinuteExpiry() {
  const token = generateToken();
  const sessions = await sql`
    INSERT INTO sessions
    (token, expiry)
    VALUES
    (${token}, NOW() + INTERVAL '5 minutes')
    RETURNING *
  `;
  return camelcaseRecords(sessions)[0];
}

// no expiry here, it takes the default 24hours expiry from the created table in migrations1
export async function createSessionByUserId(userId) {
  const token = generateToken();

  const sessions = await sql`
    INSERT INTO sessions
    (token, user_id)
    VALUES
    (${token}, ${userId})
    RETURNING *
  `;
  return camelcaseRecords(sessions)[0];
}

export async function deleteSessionById(id) {
  const sessions = await sql`
    DELETE FROM
      sessions
    WHERE
      id = ${id}
    RETURNING *
  `;
  return camelcaseRecords(sessions)[0];
}

export async function deleteSessionByToken(token) {
  const sessions = await sql`
    DELETE FROM
      sessions
    WHERE
      token = ${token}
    RETURNING *
  `;
  return camelcaseRecords(sessions)[0];
}

export async function deleteAllExpiredSessions() {
  const sessions = await sql`
    DELETE FROM
      sessions
    WHERE
      expiry < NOW()
    RETURNING *
  `;
  return camelcaseRecords(sessions)[0];
}

// this is to check if the username already exists on the database, since username needs to be unique
export async function getUserByUsername(username) {
  const users = await sql`
    SELECT
      username
    FROM
      users
    WHERE
      username = ${username}
  `;
  return camelcaseRecords(users)[0]; // returns undefined if there is nothing
}

export async function getUserById(id) {
  const users = await sql`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      id = ${id}
  `;
  return camelcaseRecords(users)[0]; // returns undefined if there is nothing
}

export async function getUserWithHashedPasswordByUsername(username) {
  const users = await sql`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return camelcaseRecords(users)[0]; // returns undefined if there is nothing
}

// this is to create a single user, that's why also returning users[0]
export async function createUser(username, passwordHash) {
  const users = await sql`
    INSERT INTO users
      (username, password_hash)
    VALUES
      (${username}, ${passwordHash})
    RETURNING id, username
  `;
  return camelcaseRecords(users)[0];
}

export async function deleteUserById(id) {
  const user = await sql`
  DELETE FROM
    users
  WHERE
    id = ${id}
  RETURNING *
  `;
  return camelcaseRecords(user)[0];
}
