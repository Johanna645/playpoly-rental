import Head from 'next/head';
import Layout from '../components/Layout';
import { css } from '@emotion/react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Registration Successfull</title>
      </Head>
      <h1>Thank you for your registration!</h1>
      <p>Please login to start booking and take a look at our </p>
      <Link href="/terms">
        <a>terms of use</a>
      </Link>{' '}
      <p>
        {' '}
        where you can find important information about our renting process.
      </p>
    </>
  );
}
