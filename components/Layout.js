import Link from 'next/link';
import Head from 'next/head';
import { css } from '@emotion/react';

const headerStyles = css`
  display: flex;
  justify-content: center;

  font-size: 24;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;

  margin-bottom: 10px;

  flex-container {
    background-color: #eb3439;
  }

  h2 {
    color: black;
    font-style: cursive;
    font-weight: bold;
  }

  a + a {
    margin-left: 15px;
  }
`;

const logoStyles = css`
  background-color: red;
  color: white;
  text-shadow: 2px 2px #263439;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-style: bold;
`;

const footerStyles = css`
  background-color: #27ebca;
  color: black;

  margin-top: 40px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20;

  p {
    margin-left: 15px;
  }

  a {
    color: #005f6a;
    margin-left: 10px;
  }
`;

export default function Layout(props) {
  return (
    <>
      <Head>
        <title>Playpoly Boardgame Rental</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div css={headerStyles}>
          <box css={logoStyles}>
            <h1>PLAYPOLY</h1>
          </box>
          <h2>your rental for board games</h2>
        </div>
        <nav>
          <div>
            <div>
              <Link href="/">
                <a>Home</a>
              </Link>{' '}
              <Link href="/games">
                <a>Games</a>
              </Link>
              <Link href="/search">
                <a>Search</a>
              </Link>{' '}
              <div>
                {/* to have a logout page and link visible after login and registration */}

                {!props.isSessionValid ? (
                  <>
                    <Link href="/register">
                      <a data-cy="header-register">Register</a>
                    </Link>
                    <Link href="/login">
                      <a data-cy="header-login">Login</a>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/logout">
                      <a data-cy="header-login">Logout</a>
                    </Link>
                    <Link href="/myBookings">
                      <a data-cy="header-login">My bookings</a>
                    </Link>
                  </>
                )}
              </div>
              <Link href="/terms">
                <a>Terms of use</a>
              </Link>{' '}
              <Link href="/admin/games/manage">
                <a>Admin</a>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {props.children}

      <footer css={footerStyles}>
        <p>rental@playpoly.rental</p>
      </footer>
    </>
  );
}
