import { NextApiRequest, NextApiResponse } from 'next';
import {
  createNewGame,
  getAllGames,
  handleReservationPullback,
} from '../../util/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const games = await getAllGames();
    res.json({ games: games });
  }

  if (req.method === 'POST') {
    const game = await createNewGame(
      req.body.name,
      req.body.playerMinimum,
      req.body.playerMaximum,
      req.body.age,
      req.body.description,
    );
    res.json(game);
  }

  if (req.method === 'PATCH') {
    const updatedGame = await handleReservationPullback(
      req.body.userIdReservation,
    );
    res.json(updatedGame);
  } // funktioniert nicht, da bräuchte ich noch die genaue game davor glaube ich
}
