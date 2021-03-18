import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';
require('dotenv-safe').config();
// const camelcaseKeys = require('camelcase-keys');

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

//this just extra for api safety, not implemented yet
// export async function deleteGameByIdAndUserId(id, userId) {
//   return await sql`
//   DELETE FROM
//   games
//   WHERE
//   id = ${id} AND user_id = ${userId}
//   RETURNING *
//   `;
// }

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
