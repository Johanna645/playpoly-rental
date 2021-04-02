const argon2 = require('argon2');

exports.up = async (sql) => {
  const passwordHash = await argon2.hash(process.env.ADMIN_PASSWORD);

  await sql`
     INSERT INTO users
       (username, password_hash, is_admin)
     VALUES
       ('admin', ${passwordHash}, true)
   `;
};

exports.down = async (sql) => {
  await sql`
    DELETE FROM users
  `;
};
