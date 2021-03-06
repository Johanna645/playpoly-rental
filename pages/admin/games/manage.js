import Head from 'next/head';
import Layout from '../../../components/Layout';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Manage(props) {
  const router = useRouter();

  const [games, setGames] = useState([]);
  const [name, setName] = useState('');
  const [playerMinimum, setPlayerMinimum] = useState(1);
  const [playerMaximum, setPlayerMaximum] = useState(8);
  const [age, setAge] = useState(1);
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState([]);
  const [isAdminStatus, setIsAdminStatus] = useState(false);
  const [showReturnSuccess, setShowReturnSuccess] = useState(false);

  async function showGames() {
    const response = await fetch('/api');
    const newGames = await response.json();
    setGames(newGames.games);
  }

  async function showUsers() {
    const response = await fetch('/api/allUsers/users');
    const newUsers = await response.json();
    setUsers(newUsers.users);
  }

  async function handleAdminStatus(id, isAdmin) {
    const response = await fetch('/api/userId/idUser');
    const updatedUser = await response.json();
    setIsAdminStatus(updatedUser.isAdmin);
  }

  return (
    <>
      <Head>
        <title>Manage</title>
      </Head>
      <h1>Manage Games and Rentals</h1>

      <h2>Add New Game</h2>

      <form
        className="row"
        onSubmit={async (event) => {
          event.preventDefault();

          await fetch('/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name,
              playerMinimum: playerMinimum,
              playerMaximum: playerMaximum,
              age: age,
              description: description,
            }),
          });
          router.push('/admin/games/manage');
        }}
      >
        <div className="col-12 mb-3">
          <label className="form-label" htmlFor="gameName">
            Game Name
          </label>
          <input
            type="text"
            className="form-control"
            value={name}
            id="gameName"
            minLength="1"
            maxLength="100"
            required
            onChange={(event) => {
              setName(event.currentTarget.value);
            }}
          />
        </div>
        <div className="col-12 col-md-4 mb-3">
          <label className="form-label" htmlFor="gamePlayerMinimum">
            Minimum Player Amount
          </label>
          <input
            type="number"
            min="1"
            max="100"
            required
            className="form-control"
            value={playerMinimum}
            id="gamePlayerMinimum"
            onChange={(event) => {
              setPlayerMinimum(event.currentTarget.value);
            }}
          />
        </div>
        <div className="col-12 col-md-4 mb-3">
          <label className="form-label" htmlFor="gamePlayerMaximum">
            Maximum Player Amount
          </label>
          <input
            type="number"
            min="1"
            max="100"
            required
            className="form-control"
            value={playerMaximum}
            id="gamePlayerMaximum"
            onChange={(event) => {
              setPlayerMaximum(event.currentTarget.value);
            }}
          />
        </div>
        <div className="col-12 col-md-4 mb-3">
          <label className="form-label" htmlFor="gameAge">
            Recommended Minimum Age
          </label>
          <input
            type="number"
            min="1"
            max="99"
            required
            className="form-control"
            value={age}
            id="gameAge"
            onChange={(event) => {
              setAge(event.currentTarget.value);
            }}
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label" htmlFor="gameDescription">
            Description
          </label>
          <textarea
            className="form-control"
            rows="5"
            id="gameDescription"
            required
            value={description}
            onChange={(event) => {
              setDescription(event.currentTarget.value);
            }}
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Add Game
          </button>
        </div>
      </form>

      <h2>Games &amp; Returns</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Game</th>
            <th scope="col" colSpan="2">
              {' '}
            </th>
          </tr>
        </thead>
        <tbody>
          {props.games.map((game) => (
            <tr data-cy="admin-page-games-list" key={`game-${game.id}`}>
              <td>
                <Link href={`/games/${game.id}`}>
                  <a>{game.name}</a>
                </Link>
              </td>
              <td>
                {game.userIdRental !== null && !showReturnSuccess && (
                  <button
                    data-cy="admin-return-button"
                    type="button"
                    className="btn btn-primary btn-sm mr-3"
                    value="Return"
                    disabled={game.userIdRental === null || showReturnSuccess}
                    onClick={async () => {
                      await fetch(`/api/${game.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          id: game.id,
                          userIdRental: null,
                        }),
                      });

                      router.push('/admin/games/manage');
                      if (game.userIdReservation !== null) {
                        console.log(
                          `${game.name} is available, do you want to rent the game?`,
                        );
                      }
                    }}
                  >
                    Accept Return
                  </button>
                )}
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={async () => {
                    const confirmed = window.confirm('Really remove?');
                    if (!confirmed) return;
                    await fetch(`/api/${game.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      // here is no body needed, since no new information is passed on, this is just deleting
                    });
                    router.push('/admin/games/manage');
                  }}
                >
                  Remove Game
                </button>
              </td>
              {/* <td>
                {game.userIdReservation !== null && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    value="status"
                  >
                    Reserved
                  </button>
                )}
              </td> */}
              {/* <td>{game.userIdReservation}</td> */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* <button onClick={showGames}>See all games</button>
      <div>
        <ul>
          {games.map((game) => (
            <li key={`game-${game.id}`}>
              <Link href={`/admin/games/${game.id}`}>
                <p>{game.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div> */}

      {/* <button onClick={showUsers}>See all users</button>  which is better, to have it under a button or listed right away?*/}
      <h2>Edit Users</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Admin</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((user) => (
            <tr key={user.username}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    value=""
                    id="flexCheckDefault"
                    type="checkbox"
                    onChange={async () => {
                      console.log(user);
                      await fetch(`/api/userId/${user.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          isAdmin: user.isAdmin ? false : true,
                        }),
                      });
                      router.push('/admin/games/manage');
                    }}
                    checked={user.isAdmin}
                  />{' '}
                </div>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={async () => {
                    const confirmed = window.confirm('Really remove?');
                    if (!confirmed) return;
                    await fetch(`/api/userId/${user.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });
                    router.push('/admin/games/manage');
                  }}
                >
                  Remove User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export async function getServerSideProps() {
  const { getAllGames, getAllUsers } = await import('../../../util/database');
  const games = await getAllGames();
  const users = await getAllUsers();

  return { props: { games: games, users: users } };
}
