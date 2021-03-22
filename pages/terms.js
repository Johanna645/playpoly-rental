import Head from 'next/head';
import Layout from '../components/Layout';
import { css } from '@emotion/react';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms Of Use</title>
      </Head>
      <h1>Terms Of Use</h1>
      <p>
        this is the boring but legally important page of an amazing boardgame
        rental
      </p>
      <p> here will be then text about rental conditions and so on</p>
    </>
  );
}
