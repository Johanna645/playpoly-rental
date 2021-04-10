import Head from 'next/head';
import Layout from '../../../components/Layout';
import { css } from '@emotion/react';
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
      <h1 className="mt-5">Manage Games and Rentals</h1>

      <h2 className="mt-5">Add New Game</h2>

      <form
        className="row mt-3 mb-3"
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

      <h2 className="mt-5 mb-3">Games &amp; Returns</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            {/* <th scope="col">#</th> */}
            <th scope="col">Game</th>
            {/* <th scope="col">Rented</th>
            <th scope="col">Returned</th>
            <th scope="col">Reserved</th> */}
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {props.games.map((game) => (
            <tr key={`game-${game.id}`}>
              {/* <th scope="row">{game.id}</th> */}
              <td>
                <Link href={`/admin/games/${game.id}`}>
                  <a>{game.name}</a>
                </Link>
              </td>
              {/* <td>{game.userIdRental}</td> */}
              <td>
                {game.userIdRental !== null && !showReturnSuccess && (
                  <button
                    type="button"
                    className="btn btn-primary"
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
      <h2 className="mt-5 mb-3">Edit Users</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            {/* <th scope="col">#</th> */}
            <th scope="col">Username</th>
            <th scope="col">Contact</th>
            <th scope="col">Admin</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((user) => (
            <tr key={user.username}>
              {/* <th scope="row">{user.id}</th> */}
              <td>{user.username}</td>
              <td>
                <p>placeholder for contact</p>
              </td>
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
                  className="btn btn-warning"
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
                  Remove user
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
// export async function getServerSideProps(context) {
//   const {
//     getSingleUser,
//     makeUserAdmin,
//     getAllGames,
//     getSingleGame,
//   } = await import('../../../util/database');

//   const user = await getSingleUser(context.query.userId);
//   const userId = user.userId;

//   const userAdmin = await makeUserAdmin(userId);

//   const allGames = await getAllGames();
//   const gameId = context.query.gameId;

//   const game = await getSingleGame(gameId);

//   return {
//     props: { user: user, makeUserAdmin: userAdmin, game: game || null },
//   };
// }
