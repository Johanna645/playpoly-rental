import { isUserAdmin, getUserIdFromSessions } from '../../util/database';

export default async function handler(req, res) {
  const sessionToken = req.cookies.session;
  const userId = await getUserIdFromSessions(sessionToken);

  const isAdmin = userId != null && (await isUserAdmin(userId.userId));

  res.send({ isUserAdmin: isAdmin });
}
