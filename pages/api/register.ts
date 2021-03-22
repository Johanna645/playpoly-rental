// res is usually an entity, a thing, product,... concrete, but here it will represent action, the login/registration

import { NextApiRequest, NextApiResponse } from 'next';
import {
  doesCsrfTokenMatchSessionToken,
  hashPassword,
} from '../../util/authentification';
import { createUser, getUserByUsername } from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username, password, csrfToken } = req.body;
  const sessionToken = req.cookies.session;

  // to make sure people cannot register without a matching csrf token
  if (!doesCsrfTokenMatchSessionToken(csrfToken, sessionToken)) {
    return res.status(401).send({
      errors: [{ message: 'CSRF Token does not match' }],
      user: null,
    });
  }

  const userAlreadyExists =
    typeof (await getUserByUsername(username)) !== 'undefined';

  if (userAlreadyExists) {
    return res.status(409).send({
      errors: [{ message: 'User already exists' }],
      user: null,
    }); // different http status codes are listed, 409 means 'conflict'
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser(username, passwordHash);

  res.send({ user: user });
}
