import {
  createNewRental,
  getUserIdFromSessions,
  isGameAvailable,
} from '../../../util/database';

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

  const availability = await isGameAvailable(gameId);
  if (availability === false) {
    return res.status(404).send({ message: 'Game is at the moment rented' });
  }

  createNewRental(id, gameId);
  const response = JSON.stringify('Rental approved');
  res.send(response);
}
