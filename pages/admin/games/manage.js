import Head from 'next/head';
import Layout from '../../../components/Layout';
import { css } from '@emotion/react';
import { useState } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/router';

export default function Manage(props) {
  const [games, setGames] = useState([]);
  const [name, setName] = useState('');
  const [playerMinimum, setPlayerMinimum] = useState();
  const [playerMaximum, setPlayerMaximum] = useState();
  const [age, setAge] = useState();
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState([]);
  const [isAdminStatus, setIsAdminStatus] = useState();
  // const router = useRouter();

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
      <h1>Manage games and rentals</h1>

      <h2>Add new game</h2>

      <form
        class="row row-cols-lg-auto g-3 align-items-center"
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
        }}
      >
        <div className="mb-3">
          <label className="form-label">
            Game name:
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(event) => {
                setName(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        <div className="col-md-2">
          <label className="form-label">
            Minimum player amount:
            <input
              type="integer"
              className="form-control"
              value={playerMinimum}
              onChange={(event) => {
                setPlayerMinimum(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        <div className="col-md-2">
          <label className="form-label">
            Maximum player amount:
            <input
              type="integer"
              className="form-control"
              value={playerMaximum}
              onChange={(event) => {
                setPlayerMaximum(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        <div className="col-12">
          <label className="form-label">
            Recommended age:
            <input
              type="integer"
              className="form-control"
              value={age}
              onChange={(event) => {
                setAge(event.currentTarget.value);
              }}
            />
          </label>
        </div>
        <div class="col-12">
          <label class="form-label">
            Description:
            <textarea
              class="form-control"
              rows="3"
              value={description}
              onChange={(event) => {
                setDescription(event.currentTarget.value);
              }}
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Add game
        </button>
      </form>

      <h2>Edit games and rentals</h2>

      <button onClick={showGames}>See all games</button>
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
      </div>

      {/* <button onClick={showUsers}>See all users</button>  which is better, to have it under a button or listed right away?*/}
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Username</th>
            <th scope="col">Contact</th>
            <th scope="col">Admin</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((user) => (
            <tr key={user.username}>
              <th scope="row">{user.id}</th>
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
                    // id={user.id}
                    onChange={async () => {
                      await fetch(`/api/userId/${props.idUser}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          isAdmin: user.isAdmin ? false : true,
                        }),
                      });
                    }}
                    checked={user.isAdmin}
                  />{' '}
                </div>
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-warning"
                  onClick={async () => {
                    const confirmed = window.confirm('Really remove?');
                    if (!confirmed) return;
                    await fetch(`/api/userId/${props.idUser}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });
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
