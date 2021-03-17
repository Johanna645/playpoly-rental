// so this particular page is /api and it shows then what is inside  res.jsons {}
// here this is at the moment just update name, since no real info to update is yet made at the database

import { deleteGameById, updateGameNameById } from '../../util/database';

export default async function handler(req, res) {
  const id = req.query.gameId;

  if (req.method === 'PATCH') {
    const updatedGame = await updateGameNameById(id, req.body.name);
    res.json(updatedGame);
  }

  if (req.method === 'DELETE') {
    const deletedGame = await deleteGameById(id);
    res.json(deletedGame);
  }
}
