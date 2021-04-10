exports.up = async (sql) => {
  await sql`
    ALTER TABLE
      users
    ADD COLUMN
      email TEXT,
		ADD COLUMN
			phone TEXT
  `;
};

exports.down = async (sql) => {
  await sql`
    ALTER TABLE
      users
    DROP COLUMN
      email,
		DROP COLUMN
			phone
  `;
};
