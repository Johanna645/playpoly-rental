// so this particular page is /api and it shows then what is inside  res.jsons {}
// here this is at the moment just update name, since no real info to update is yet made at the database

import { deleteGameById, updateGameNameById } from '../../util/database';

export default async function handler(req, res) {
  // check if user has a valid session token
  // no cookies built in yet, therefore still commented out
  // const user = await getUserBySessionToken(req.cookie.session);
  // if (!user) {
  //   return res.status(401).send({ message: 'Unauthorized'})
  // }
  // // is user allowed to delete, i.e. is user admin
  // if (req.method === 'DELETE'){
  //   const action = await deleteGameByIdAndUserId(req.query.id, user.id);
  //   res.send(action);
  // }

  const id = req.query.gameId;

  // if (req.method === 'PATCH') {
  //   const updatedGame = await updateGameNameId(id, req.body.name);
  //   res.json(updatedGame);
  // }

  if (req.method === 'DELETE') {
    const deletedGame = await deleteGameById(id);
    res.json(deletedGame);
  }
}
