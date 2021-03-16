import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Playpoly Boardgames Rental</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Playpoly</h1>
      <p>this is the home page of an amazing boardgame rental</p>
    </div>
  );
}
