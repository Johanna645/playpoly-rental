import Head from 'next/head';
import Layout from '../components/Layout';
import { css } from '@emotion/react';

export default function Home() {
  return (
    <>
      <Head>
        <title>Playpoly Boardgames Rental</title>
      </Head>
      <h1>Playpoly</h1>

      <p>this is the home page of an amazing boardgame rental</p>
      <p>Register, rent and play - all year round with one time fee!</p>
    </>
  );
}
