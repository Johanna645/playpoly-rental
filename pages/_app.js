import { useEffect, useState, useCallback } from 'react';
import Layout from '../components/Layout';
// this is here to pass the function to Layout

export default function App({ Component, pageProps }) {
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const refreshIsSessionValid = useCallback(async () => {
    console.log('refresh isSessionTokenValid');

    const response = await fetch('/api/isSessionValid');
    const newValue = (await response.json()).isSessionValid;
    setIsSessionValid(newValue);

    const adminResponse = await fetch('/api/isUserAdmin');
    const isAdmin = (await adminResponse.json()).isUserAdmin;
    setIsUserAdmin(isAdmin);
  }, []);

  useEffect(() => {
    console.log('useEffect');
    refreshIsSessionValid(); // will get the state just once
  }, [refreshIsSessionValid]);

  return (
    <Layout isSessionValid={isSessionValid} isUserAdmin={isUserAdmin}>
      <Component {...pageProps} refreshIsSessionValid={refreshIsSessionValid} />
    </Layout>
  );
}
