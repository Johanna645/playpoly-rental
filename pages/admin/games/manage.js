import Head from 'next/head';
import Layout from '../../../components/Layout';
import { css } from '@emotion/react';

export default function Manage() {
  return (
    <>
      <Head>
        <title>Manage</title>
      </Head>
      <h1>Manage rentals</h1>
      <p>this is the management page of an amazing boardgame rental</p>
      <p>
        {' '}
        here will be then functionalities or at least links to functionalities
        sites, like add and delete games, most likely also manage customers and
        rentals too
      </p>
    </>
  );
}
