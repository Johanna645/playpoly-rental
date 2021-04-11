const argon2 = require('argon2');

exports.up = async (sql) => {
  const password = 'tester';
  const passwordHash = await argon2.hash(password);

  await sql`
     INSERT INTO users
       (username, password_hash, email)
     VALUES
       ('tester', ${passwordHash}, 'playpoly.rental+tester@gmail.com')
			 `;

  await sql`
			UPDATE games
			SET user_id_rental = 2
			WHERE id = 1

   `;
};

exports.down = async (sql) => {
  await sql`
    DELETE FROM users
		WHERE id = 2
		`;
  await sql`
		UPDATE games
		SET user_id_rental = null
		WHERE id = 1
  `;
};
