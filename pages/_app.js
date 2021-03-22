import { css, Global } from '@emotion/react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
// this is here to pass the function to Layout

export default function App({ Component, pageProps }) {
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [isSessionStateStale, setIsSessionStateStale] = useState(true); // what this is i don't know

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/isSessionValid');
      const newValue = (await response.json()).isSessionValid;
      setIsSessionValid(newValue);
      setIsSessionStateStale(false); //what is this?
    }

    if (isSessionStateStale) fetchData();
    //fetchData();
  }, [isSessionStateStale]);

  return (
    <>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            min-height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
              Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
              sans-serif;
          }
        `}
      />
      <Layout isSessionValid={isSessionValid}>
        <Component
          {...pageProps}
          setIsSessionStateStale={setIsSessionStateStale}
        />
      </Layout>
    </>
  );
}
