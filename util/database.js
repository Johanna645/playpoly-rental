import { generateToken } from './sessions';
import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';
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
) {
  const game = await sql`
    INSERT INTO games(name,
	player_minimum, player_maximum,
	age,
	description)
	VALUES (${name}, ${player_minimum}, ${player_maximum}, ${age}, ${description})
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

// this might be something for an admin and reservations/bookings, to change status, so far my game doesn't have status. I just write it using update name till then (postgres update row)
export async function updateGameNameById(name, id) {
  const game = await sql`
  UPDATE
    games
  SET
    name = ${name}
  WHERE
    id = ${id}
  RETURNING *
  `;
  return camelcaseRecords(game)[0];
}

// this is something for the late phase, just mock now, for joins, change names and all then to be fitting
// SQL JOINS
export async function getTeamMemberWithRoleById(id) {
  const teamMembers = await sql`
    SELECT
      team_members.id as team_member_id,
      team_members.first_name as first_name,
      roles.name as role_name

    FROM
      team_members,
      roles
    WHERE
      team_members.id = ${id} AND
      team_members.role_id = roles.id
  `;
  return camelcaseRecords(teamMembers)[0];
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
  return camelcaseRecords(users)[0]; // returns undefined if there is nothing, this information is needed then otherplace
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
