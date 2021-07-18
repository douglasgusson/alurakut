import nookies from 'nookies';

export async function getServerSideProps(context) {

  nookies.destroy(context, 'USER_TOKEN')

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    }
  }
}

export default function Logout() { }
