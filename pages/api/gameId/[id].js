import { createNewRental, getUserIdFromSessions } from '../../../util/database';

export default async function handler(req, res) {
  const token = req.cookies.session;

  if (!token) {
    return res
      .status(401)
      .send({ message: 'Unauthorized, please login first' });
  }

  const gameId = req.query.id;
  if (!gameId) {
    return res.status(404).send({ message: 'No match found' });
  }

  const userId = await getUserIdFromSessions(token);
  const id = userId.userId;

  createNewRental(id, gameId);
  const response = JSON.stringify('rental approved');
  res.send(response);
}
