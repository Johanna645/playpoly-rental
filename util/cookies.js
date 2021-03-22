import cookie from 'cookie';
import Cookies from 'js-cookie';

// notice: 'js-cookie' is setting the cookie for the browser and 'coookie' on the server

// lots of security stuff is put in - most of the stuff has to be done in api-routes, so that the cookie is set to the api route instead and this will be then moved into a separate function inside cookies.js file

export function serializeSecureCookieServerSide(
  name,
  value,
  maxAge = 60 * 60 * 24,
) {
  // 24hours time for the cookie to expire, seconds * minutes * hours

  // Detect whether we're in production environment like Heroku
  const isProduction = process.env.NODE_ENV === 'production';

  return cookie.serialize(name, value, {
    // these lines above create the cookie that will expire after the maxAge, and that inside the browser the cookie will disappear then too

    maxAge,

    expires: new Date(Date.now() + maxAge * 1000),

    // Important! Deny cookies access from frontend JavaScript, access possible only server side
    httpOnly: true,

    // Set secure cookies on production, where they are encrypted; the site needs to be https to work, otherwise none of the logins etc. works
    secure: isProduction,

    // cookie is available the whole website
    path: '/',

    // a thing for newer versions of chrome and firefox https://web.dev/samesite-cookies-explained/
    sameSite: 'lax',
  });
}

export function serializeEmptyCookieServerSide(name) {
  return cookie.serialize(name, '', {
    maxAge: -1,
    path: '/',
  });
}

// for js-cookie, i.e. cookie client side
export function setBookingCookieClientSide(newBooking) {
  Cookies.set('bookings', newBooking);
}

export function addGameToBookings(bookingsCookieValue, gameId) {
  const idInArray = bookingsCookieValue.some(
    (gameBookings) => gameBookings.id === gameId,
  );

  if (!idInArray) {
    return [
      ...bookingsCookieValue,
      {
        gameId: gameId,
        bookings: 1,
      },
    ];
  }
}
