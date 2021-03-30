import {
  createReservation,
  getUserIdFromSessions,
  canUserReserve,
} from '../../../util/database';

export default async function handler(req, res) {
  const token = req.cookies.session;

  if (!token) {
    return res
      .status(401)
      .send({ message: 'Unauthorized, please login first' });
  }

  const gameId = req.query.idReservation;

  if (!gameId) {
    return res.status(404).send({ message: 'No match found' });
  }

  const userId = await getUserIdFromSessions(token);
  const id = userId.userId;

  const availability = await canUserReserve(gameId);

  if (availability === false) {
    return res.status(404).send({
      message: 'Game is rented and there are already reservations awaiting',
    });
  }

  createReservation(id, gameId);
  const response = JSON.stringify('reservation noted');
  res.send(response);
}
