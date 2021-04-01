import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers } from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const users = await getAllUsers();
    res.json({ users: users });
  }

  // if (req.method === 'POST') {
  //   const game = await createNewGame(
  //     req.body.name,
  //     req.body.playerMinimum,
  //     req.body.playerMaximum,
  //     req.body.age,
  //     req.body.description,
  //   );
  //   res.json(game);
  // }

  // if (req.method === 'PATCH') {
  //   const updatedUser = await updateUserAdminStatusById(id, req.body.isAdmin);
  //   res.json(updatedUser);
  // }
}
