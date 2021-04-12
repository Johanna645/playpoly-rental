// so this particular page is /api and it shows then what is inside  res.jsons {}

import {
  deleteGameById,
  getUserIdFromSessions,
  isUserAdmin,
  handleRentalReturn,
  getReservation,
} from '../../util/database';

import nodemailer from 'nodemailer';

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

  if (req.method === 'PATCH') {
    // get reservation first ..
    const reservation = await getReservation(gameId);

    // .. then update the game as returned and remove the reservation
    const updatedGame = await handleRentalReturn(gameId);

    if (reservation) {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport(
        process.env.EMAIL_AUTHENTICATION_SETTINGS,
      );

      // https://support.google.com/mail/answer/7126229?hl=de
      // https://nodemailer.com/about/
      // https://nodemailer.com/usage/using-gmail/ -> 'less secure' setting in gmail

      // setup e-mail data with unicode symbols
      const mailOptions = {
        from: '"Playpoly" <playpoly.rental@gmail.com>', // sender address
        to: reservation.email, // list of receivers
        subject: reservation.name + ' is available', // Subject line
        text: reservation.name + 'is now availabe for rent!', // plaintext body
        html:
          'Hi!<br /><br />Just so you know, ' +
          reservation.name +
          ' is now available for rent!<br/><br/>If you want the game, come by our rental to pick it up anytime!<br /><br /<Have fun playing!<br/><br/>Johanna @ PlayPoly', // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });
    }

    res.json(updatedGame);
  }

  if (req.method === 'DELETE') {
    const deletedGame = await deleteGameById(gameId);
    res.json(deletedGame);
  }
}
