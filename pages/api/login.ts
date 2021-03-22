// res is usually an entity, a thing, product,... concrete, but here it will represent action, the login/registration

import { NextApiRequest, NextApiResponse } from 'next';
import {
  doesCsrfTokenMatchSessionToken,
  doesPasswordMatchPasswordHash,
} from '../../util/authentification';

import {
  createSessionByUserId,
  getUserWithHashedPasswordByUsername,
} from '../../util/database';

import { serializeSecureCookieServerSide } from '../../util/cookies';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username, password, csrfToken } = req.body;

  // check if csrfToken matches the expected. different http status codes are listed, 401 means 'unauthorized'
  const sessionToken = req.cookies.session;

  if (!doesCsrfTokenMatchSessionToken(csrfToken, sessionToken)) {
    return res.status(401).send({
      errors: [{ message: 'CSRF Token does not match' }],
      user: null,
    });
  }

  const userWithPasswordHash = await getUserWithHashedPasswordByUsername(
    username,
  );

  // here will get checked if there is no username
  if (!userWithPasswordHash) {
    return res.status(401).send({
      errors: [{ message: 'Username or password does not match' }],
      user: null,
    });
  }

  // destructuring and making userWithPasswordHash an object, here ... is rest-operator, so userWithPassworHash takes passwordHash in and whatever else is left becomes the user. by doing this there is no sensitive information left under user.
  const { passwordHash, ...user } = userWithPasswordHash;

  const passwordMatches = await doesPasswordMatchPasswordHash(
    password,
    passwordHash,
  ); // returns boolean, check is done in authentification-file with argon2

  if (!passwordMatches) {
    return res.status(401).send({
      errors: [{ message: 'Username or password does not match' }],
      user: null,
    });
  }

  // at this point authentification was successfull, session becomes an object with a token, which is then passed on to serializeSecureCookie
  const session = await createSessionByUserId(user.id);

  const sessionCookie = serializeSecureCookieServerSide(
    'session',
    session.token,
  );

  res.setHeader('Set-Cookie', sessionCookie);

  res.send({
    user: user,
  });
}
