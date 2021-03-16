import postgres from 'postgres';
import camelcaseKeys from 'camelcase-keys';
require('dotenv-safe').config();
//const camelcaseKeys = require('camelcase-keys');

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
