import {
  createReservation,
  getUserIdFromSessions,
  canUserReserve,
  handleReservationPullback,
} from '../../../util/database';

export default async function handler(req, res) {
  const token = req.cookies.session;

  if (!token) {
    return res
      .status(401)
      .send({ message: 'Unauthorized, please login first' });
  }

  const gameId = req.query.idReservation;
  console.log('test to see what gameId in reservation is', gameId);

  if (!gameId) {
    return res.status(404).send({ message: 'No match found' });
  }

  if (req.method === 'PATCH') {
    const updatedGame = await handleReservationPullback(gameId);
    res.json(updatedGame);
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
