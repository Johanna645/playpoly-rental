import { NextApiRequest, NextApiResponse } from 'next';
import { getSessionByToken } from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const isSessionValid = Boolean(
    (await getSessionByToken(req.cookies.session))?.userId,
  );

  res.send({ isSessionValid: isSessionValid });
}
// to check if the person is logged in or not, if the userId is there this will be a valid session (since the short term login/registration session does not have userId) this will show on the nav bar links logout only when user is logged in
