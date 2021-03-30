import { NextApiRequest, NextApiResponse } from 'next';
import { isUserAdmin, getUserIdFromSessions } from '../../util/database';

export default async function handler(req, res) {
  const sessionToken = req.cookies.session;
  const userId = await getUserIdFromSessions(sessionToken);
  const id = userId.userId;
  console.log(id);

  const isAdmin = await isUserAdmin(id);
  console.log(isAdmin);

  res.send({ isUserAdmin: isAdmin });
}
