exports.up = async (sql) => {
  await sql`
    ALTER TABLE
      users
    ADD COLUMN
      email TEXT,
		ADD COLUMN
			phone TEXT
  `;

  await sql`
    UPDATE users
    SET email = 'playpoly.rental+admin@gmail.com'
    WHERE id = 1
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
