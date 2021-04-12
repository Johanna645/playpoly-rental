import Link from 'next/link';
import Head from 'next/head';

export default function Layout(props) {
  return (
    <>
      <Head>
        <title>Playpoly Boardgame Rental</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-danger text-white mb-5">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="/">
              <img src="/logos/playpoly-logo-18.png" alt="Playpoly Logo" />
            </a>
            {/* <small>Your board game rental</small> */}
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
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link href="/search">
                    <a data-cy="header-games" className="nav-link">
                      Games
                    </a>
                  </Link>{' '}
                </li>
                {props.isSessionValid && (
                  <li className="nav-item">
                    <Link href="/myGames">
                      <a data-cy="header-cart" className="nav-link">
                        {/* embed a cart icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="bi bi-cart"
                          viewBox="0 0 16 16"
                        >
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>{' '}
                        &nbsp;Cart
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
              <ul className="navbar-nav mr-auto">
                {props.isSessionValid ? (
                  <>
                    {props.isUserAdmin && (
                      <li className="nav-item">
                        <Link href="/admin/games/manage">
                          <a data-cy="header-admin" className="nav-link">
                            Admin
                          </a>
                        </Link>
                      </li>
                    )}
                    <li className="nav-item">
                      <Link href="/myRentalsAndReservations">
                        <a data-cy="header-my-games" className="nav-link">
                          My Games
                        </a>
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link href="/logout">
                        <a className="nav-link" data-cy="header-logout">
                          Logout
                        </a>
                      </Link>
                    </li>
                  </>
                ) : (
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
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className="container">{props.children}</div>

      <footer className="container-fluid mt-5 pt-3 pb-3 bg-info text-white">
        <div className="text-center">
          &copy; 2021 Playpoly &bull;{' '}
          <Link href="/terms">
            <a className="text-white">Terms</a>
          </Link>{' '}
          &bull;&nbsp;
          <Link href="mailto:playpoly.rental@gmail.com">
            <a>Contact Us</a>
          </Link>{' '}
        </div>
      </footer>
    </>
  );
}
