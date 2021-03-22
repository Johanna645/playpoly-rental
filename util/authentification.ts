// password is hashed using library called argon2
// csrf cryptography uses short time token what it then transfers into a secret
// it adds to the end a secret line (like this sort of: 'sldkfjosid89?!' so that secret = sessionToken + process.env.CSRF_SECRET_SALT;)
// that is then saved to the .env-file (that is .gitinored) as a 'secret salt' and it needs to be deployed extra to heroku as an environment variable
// csrfToken = tokens.create(secret);
// this is a security matter that assures that no-one from the outside can create the token, since secret salt is only on the server

import argon2 from 'argon2';
import Tokens from 'csrf';

const tokens = new Tokens();

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

export async function doesPasswordMatchPasswordHash(
  password: string,
  passwordHash: string,
) {
  return argon2.verify(passwordHash, password);
}

function createCsrfSecret(sessionToken: string) {
  return sessionToken + process.env.CSRF_SECRET_SALT;
}

// getting the secret and creating a token based on that
export function createCsrfToken(sessionToken: string) {
  const secret = createCsrfSecret(sessionToken);
  return tokens.create(secret);
}

export function doesCsrfTokenMatchSessionToken(
  csrfToken: string,
  sessionToken: string,
) {
  const secret = createCsrfSecret(sessionToken);
  return tokens.verify(secret, csrfToken);
}
