import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Registration Successfull</title>
      </Head>
      <div className="text-center">
        <h1>Registered!</h1>
        <p>
          Next, have a look at our{' '}
          <Link href="/search">
            <a>game library</a>
          </Link>
          .
        </p>
        <img
          src="/other/dice-hand.jpg"
          alt="Login"
          width="700"
          className="mt-5"
        />
      </div>
    </>
  );
}
