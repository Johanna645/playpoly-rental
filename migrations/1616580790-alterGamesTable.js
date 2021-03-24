exports.up = async (sql) => {
  await sql`
    ALTER TABLE
      games
    ADD COLUMN
      user_id_rental INTEGER
  `;
};

exports.down = async (sql) => {
  await sql`
    ALTER TABLE
      games
    DROP COLUMN
      user_id_rental
  `;
};
