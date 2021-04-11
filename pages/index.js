import Head from 'next/head';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Playpoly Boardgames Rental</title>
      </Head>
      <div className="row gy-5">
        <div className="col-12 text-center">
          <h1>Get the Boardgames you Love!</h1>
          <p>
            Register, rent and play - all year round with a small annual fee!
          </p>
        </div>
        <div className="col-4">
          <h3>1. Sign Up</h3>
          <p>
            Come by our rental to sign up for a low, annual fee that helps us
            buy even more games.
          </p>
        </div>
        <div className="col-4">
          <h3>2. Get Games</h3>
          <p>
            Book your favorite games online. Our courier will deliver them and
            pick them up when you're done.
          </p>
        </div>
        <div className="col-4">
          <h3>3. Have fun!</h3>
          <p>
            Have a good time playing the best board and card games with your
            friends and family!
          </p>
        </div>
        <div className="col-12 text-center">
          {/* <img src="/other/cards.jpg" alt="Login" height="400" /> */}
        </div>
      </div>
    </>
  );
}
