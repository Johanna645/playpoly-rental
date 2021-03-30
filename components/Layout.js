import Link from 'next/link';
import Head from 'next/head';

export default function Layout(props) {
  return (
    <>
      <Head>
        <title>Playpoly Boardgame Rental</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <a className="navbar-brand" href="/">
              Playpoly
            </a>
            <small>Your rental for board games</small>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link href="/">
                    <a className="nav-link active" href="/">
                      Home
                    </a>
                  </Link>{' '}
                </li>
                <li className="nav-item">
                  <Link href="/games">
                    <a className="nav-link">Games</a>
                  </Link>{' '}
                </li>
                <li className="nav-item">
                  <Link href="/search">
                    <a className="nav-link">Search</a>
                  </Link>{' '}
                </li>
                {!props.isSessionValid ? (
                  <>
                    <li className="nav-item">
                      <Link href="/register">
                        <a className="nav-link" data-cy="header-register">
                          Register
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/login">
                        <a className="nav-link" data-cy="header-login">
                          Login
                        </a>
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link href="/logout">
                        <a className="nav-link" data-cy="header-login">
                          Logout
                        </a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/myGames">
                        <a className="nav-link" data-cy="header-login">
                          My games
                        </a>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
        <div>
          {!props.isUserAdmin ? (
            <div />
          ) : (
            <Link href="/admin/games/manage">
              <a>Admin</a>
            </Link>
          )}
        </div>
      </header>

      <div className="container">{props.children}</div>

      <footer>
        <div className="container">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/terms">
                <a>Terms of use</a>
              </Link>{' '}
            </li>
            <li className="nav-item">
              <Link href="mailto:rental@playpoly.rental">
                <a>rental@playpoly.rental</a>
              </Link>{' '}
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
