// so this particular page is /api and it shows then what is inside  res.jsons {}

import {
  // deleteGameById,
  getUserIdFromSessions,
  isUserAdmin,
  makeUserAdmin,
  deleteUserById,
} from '../../../util/database';

export default async function handler(req, res) {
  const token = req.cookies.session;

  if (!token) {
    return res
      .status(401)
      .send({ message: 'Unauthorized, please login first' });
  }

  const userId = await getUserIdFromSessions(token);
  const id = userId.userId;

  // is user allowed to delete
  const isAdmin = await isUserAdmin(id);
  if (isAdmin === false) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const gameId = req.query.gameId;

  if (!gameId) {
    return res.status(404).send({ message: 'No match found' });
  }

  // if (req.method === 'PATCH') {
  //   const updatedUser = await makeUserAdmin(
  //     id,
  //     req.body.JSON.stringify({ isAdmin: isAdmin ? false : true }),
  //   );
  //   res.json(updatedUser);
  // }

  if (req.method === 'PATCH') {
    const updatedUser = await makeUserAdmin(id, req.body.isAdmin);
    res.json(updatedUser);
  }

  if (req.method === 'DELETE') {
    const deletedUser = await deleteUserById(id);
    res.json(deletedUser);
  }
}
