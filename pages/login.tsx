import Head from 'next/head';

import { Dispatch, SetStateAction, useState } from 'react'; // what is this again?
import { GetServerSidePropsContext } from 'next';
import { Error } from '../util/types';
import { useRouter } from 'next/router';

// refactor type alias, so what was csrfToken as props is now just Props
type Props = {
  csrfToken: string;
  refreshIsSessionValid: () => Promise<void>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <div className="row gx-5">
        <div className="col-4">
          <h1>Login</h1>
          <form
            onSubmit={async (event) => {
              event.preventDefault();

              const response = await fetch('/api/login', {
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

              // when login/registration was successfull, redirect to home-page
              // here can be other options still, like `/profile/${user.id}` or so if user needs a page
              // here maybe not the id, just a profile page...
              // returnTo was added later, it is some route that needs to be written on the url-tab on the page

              const returnTo = Array.isArray(router.query.returnTo)
                ? router.query.returnTo[0]
                : router.query.returnTo;

              router.push(returnTo || '/');
              props.refreshIsSessionValid();
            }}
          >
            <div className="d-grid gap-2">
              <label className="form-label">
                Username
                <input
                  data-cy="login-username"
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                />
              </label>

              <label className="form-label">
                Password
                <input
                  data-cy="login-password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
              </label>

              <button
                data-cy="login-submit-button"
                type="submit"
                className="btn btn-primary btn-block btn-lg"
              >
                Login
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
            src="https://dummyimage.com/600x400/000/fff"
            alt="Login"
            className="mx-auto d-block"
          />
        </div>
      </div>
    </>
  );
}

// to create a user session if there is none yet, and if there is a session to use the existing one and also expire them
// setting the cookie on the server side on the response object (setHeader(set-cookie)) that is in context

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { createCsrfToken } = await import('../util/authentification');
  const { getSessionByToken, deleteAllExpiredSessions } = await import(
    '../util/database'
  );
  const { createSessionWithCookie } = await import('../util/sessions');

  // to get the session, if this gets returned 'undefined' then there is no session
  let session = await getSessionByToken(context.req.cookies.session);

  // if user has a session already, ( a valid session cookie), then redirect to a new page (here home). permanent means redirect will happen every time you go to this page
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

  // At this point either existing valid session token was used or new one was created
  const csrfToken = createCsrfToken(session.token);

  return { props: { csrfToken: csrfToken } };
}
