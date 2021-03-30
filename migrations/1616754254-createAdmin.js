exports.up = async (sql) => {
  await sql`
    UPDATE
			users
		SET
			is_admin = true
		WHERE
			id = 1

  `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE users
  `;
};
