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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>

      <div className="row gx-5">
        <div className="col-4">
          {' '}
          <h1>Register</h1>
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
                  email,
                  phoneNumber,
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
            <div className="d-grid gap-2">
              <label className="form-label">
                Username
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  minLength="1"
                  maxLength="100"
                  required
                  onChange={(event) => setUsername(event.currentTarget.value)}
                />
              </label>

              <label className="form-label">
                Password
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  minLength="1"
                  maxLength="100"
                  required
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
              </label>

              <label className="form-label">
                Email
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  required
                  onChange={(event) => setEmail(event.currentTarget.value)}
                />
              </label>

              <label className="form-label">
                Phone Number
                <input
                  type="tel"
                  className="form-control"
                  value={phoneNumber}
                  required
                  onChange={(event) =>
                    setPhoneNumber(event.currentTarget.value)
                  }
                />
              </label>

              <button
                data-cy="register-button"
                type="submit"
                className="btn btn-primary btn-lg"
              >
                Register
              </button>
            </div>

            {errors.map((error) => (
              <div
                style={{ color: 'red' }}
                key={`error-message-${error.message}`}
              >
                {error.message}
              </div>
            ))}
          </form>
        </div>
        <div className="col-md-8">
          <img
            src="/other/moneytalks.jpg"
            alt="Registration"
            width="700"
            className="mx-auto d-block"
          />
        </div>
      </div>
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
