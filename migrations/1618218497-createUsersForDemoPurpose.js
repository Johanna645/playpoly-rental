const argon2 = require('argon2');

exports.up = async (sql) => {
  const password = 'user1';
  const passwordHash = await argon2.hash(password);
  const password2 = 'user2';
  const passwordHash2 = await argon2.hash(password2);

  await sql`
     INSERT INTO users
       (username, password_hash, email)
     VALUES
       ('hans', ${passwordHash}, 'playpoly.rental+hans@gmail.com'), ('franz', ${passwordHash2}, 'playpoly.rental+franz@gmail.com')
			 `;

  await sql`
			UPDATE games
			SET user_id_rental = 3
			WHERE id = 6

   `;

  await sql`
			UPDATE games
			SET user_id_reservation = 4
			WHERE id = 6

	`;
};

exports.down = async (sql) => {
  await sql`
    DELETE FROM users
		WHERE id in (3, 4)
		`;

  await sql`
		UPDATE games
		SET
			user_id_rental = null,
			user_id_reservation = null
		WHERE id = 6
  `;
};
