import Head from 'next/head';

// here just a mock version, so to have an idea how to join the tables, change names then later to fit games!
export default function SingleTeamMember(props) {
  if (!props.teamMember) {
    return (
      <>
        <Head>
          <title>Team member not found</title>
        </Head>
        <h1>team member not found</h1>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Single Team Member</title>
      </Head>
      <h1>Single team member page</h1>
      <p>id: {props.teamMember.teamMemberid}</p>
      <p>Role name: {props.teamMember.roleName}</p>
    </>
  );
}
export async function getServerSideProps(context) {
  const { getTeamMemberWithRoleById } = await import('../../../util/database');
  const id = context.query.teamMemberId;
  const teamMember = await getTeamMemberWithRoleById(id);

  if (!teamMember) {
    context.res.statusCode = 404;
  }
  return {
    props: { teamMember: teamMember || null },
  };
}
