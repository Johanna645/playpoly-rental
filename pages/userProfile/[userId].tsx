import { GetServerSidePropsContext } from 'next';
import Layout from '../../components/Layout';
import Head from 'next/head';
import { Error, User } from '../../util/types';

type Props =
  | {
      user: User;
    }
  | {
      user: null;
      errors: Error[];
    };

export default function Profile(props: Props) {
  // to prevent user from seeing other users pages
  if (!props.user) {
    return (
      <>
        <Head>
          <title>{props.errors[0].message}</title>
        </Head>

        <h1>{props.errors[0].message}</h1>
      </>
    );
  }

  return (
    <Layout>
      <Head>
        <title>User Profile: {props.user.username}</title>
      </Head>

      <h1>{props.user.username}</h1>
      <div>id: {props.user.id}</div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getUserById, getSessionByToken } = await import(
    '../../util/database'
  );

  const session = await getSessionByToken(context.req.cookies.session);

  if (!session || session.userId !== Number(context.query.userId)) {
    return {
      props: {
        user: null,
        errors: [{ message: 'Access denied' }],
      },
    };
  }

  const user = await getUserById(context.query.userId);
  return { props: { user: user } };
}
