exports.up = async (sql) => {
  await sql`
    ALTER TABLE
      users
    ADD COLUMN
      is_admin BOOLEAN DEFAULT false
  `;
};

exports.down = async (sql) => {
  await sql`
    ALTER TABLE
      users
    DROP COLUMN
      admin
  `;
};
