exports.up = async (sql) => {
  await sql`
		CREATE TABLE games (
			id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
			name VARCHAR(50),
			player_minimum INTEGER,
			player_maximum INTEGER,
			age INTEGER,
			description TEXT
		);
	`;
};

exports.down = async (sql) => {
  await sql`
		DROP TABLE games
	`;
};
