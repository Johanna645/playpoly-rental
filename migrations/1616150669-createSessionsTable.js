// expiry timestamp is a reference that when this thing should expire, have a default value, it is not allowed to be null, so user will be logged in 24h in this case

// this session keeps track for everything the user does, session stored to the cookie, if cookie expires the user is no sending session information and therefore no more authenticated and needs to go to login page again

exports.up = async (sql) => {
  await sql`
    CREATE TABLE IF NOT EXISTS sessions(
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      token VARCHAR(40) UNIQUE,
      expiry TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '24 hours'

    );
    `;
};

exports.down = async (sql) => {
  await sql`
    DROP TABLE IF EXISTS sessions;
    `;
};
