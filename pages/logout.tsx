import Head from 'next/head';
import Layout from '../components/Layout';
import { Dispatch, SetStateAction, useEffect } from 'react'; // what is this?
import { GetServerSidePropsContext } from 'next';

type Props = {
  refreshIsSessionValid: () => Promise<void>;
};

export default function Logout(props: Props) {
  useEffect(() => {
    props.refreshIsSessionValid();
  }, [props]);

  return (
    <>
      <Head>
        <title>Logged out successfully</title>
      </Head>
      <div className="text-center">
        <h1>Logged out</h1>
        <p>See you next time!</p>
        <img
          src="https://dummyimage.com/600x400/000/fff"
          alt="Logged out"
          className="mt-5"
        />
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { deleteSessionByToken } = await import('../util/database');
  const { serializeEmptyCookieServerSide } = await import('../util/cookies');
  const { emptyBookingsCookie } = await import('../util/cookies');

  await deleteSessionByToken(context.req.cookies.session);
  const emptyCookie = serializeEmptyCookieServerSide('session');
  context.res.setHeader('Set-Cookie', emptyCookie);
  await emptyBookingsCookie();

  return { props: {} };
}
