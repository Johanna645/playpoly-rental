import Head from 'next/head';
import Layout from '../components/Layout';
import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { Error } from '../util/types';
import { useRouter } from 'next/router';

type Props = { csrfToken: string };

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
              csrfToken: props.csrfToken,
            }),
          }); // here password is sent to the backend api in plain text, which is a danger if on "open wifi" or so where someone might follow the traffic

          const { user, errors: returnedErrors } = await response.json();

          if (returnedErrors) {
            setErrors(returnedErrors);
            return;
          }

          // when registration was successfull, redirect to home-page
          // here can be other options still, like `/profile/${user.id}` or so if user needs a page
          // here maybe not the id, just a profile page...
          // returnTo was added later, it is some route that needs to be written on the url-tab on the page like register?returnTo= and then the page you want to go to
          // redirecting makes sure that user that is registered or logged in cannot go to the login/register page again

          const returnTo = Array.isArray(router.query.returnTo)
            ? router.query.returnTo[0]
            : router.query.returnTo;

          router.push(returnTo || `/registrationSuccess`);
        }}
      >
        <label>
          Username:
          <input
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
        </label>
        {/* email and phone number fields are not connected with anything yet, they are not fields in the database yet, but here only as placeholders at the moment for later use */}
        <label>
          E-Mail:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
        </label>

        <label>
          Phone number:
          <input
            type="tel"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.currentTarget.value)}
          />
        </label>

        <button type="submit">Register</button>
      </form>
      {errors.map((error) => (
        <div style={{ color: 'red' }} key={`error-message-${error.message}`}>
          {error.message}
        </div>
      ))}
    </>
  );
}

// to create a user session if there is none yet, and if there is a session to use the existing one and also expire them
// setting the cookie on the server side with a cookie-package, on the response object (setHeader(set-cookie)) that is in context

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { createCsrfToken } = await import('../util/authentification');
  const { getSessionByToken, deleteAllExpiredSessions } = await import(
    '../util/database'
  );
  const { createSessionWithCookie } = await import('../util/sessions');

  let session = await getSessionByToken(context.req.cookies.session); // if this gets returned 'undefined' then there is no session

  // if user has a session already, ( a valid session cookie), then redirect to a new page (here home)
  if (session?.userId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  await deleteAllExpiredSessions();

  // if there is a cookie, it will be set to the browser too
  if (!session) {
    const result = await createSessionWithCookie();
    session = result.session;

    context.res.setHeader('Set-Cookie', result.sessionCookie);
  }

  // At this point, we have either used the existing
  // valid session token, or we have created a new one.
  //
  // We can use this to generate a CSRF token
  // to mitigate CSRF attacks
  const csrfToken = createCsrfToken(session.token);

  return { props: { csrfToken: csrfToken } };
}
