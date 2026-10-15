import { lazy } from 'react';
import { Link } from 'react-router-dom';
import RemoteRoute from '../components/RemoteRoute';

// Host component that calls the hook exposed by remote_user — it is lazy because the hook is located in a remote chunk.
const UserGreeting = lazy(() => import('../components/UserGreeting'));

const APPS = [
  { name: 'host', port: 3000, does: 'The header, routing and checkout you are looking at.' },
  { name: 'remote_catalog', port: 3020, does: 'Product list, search and product pages.' },
  { name: 'remote_cart', port: 3010, does: 'The cart, its badge in the header and the cart page.' },
  { name: 'remote_user', port: 3002, does: 'Sign-in and the signed-in user.' },
];

const HomePage = () => (
  <>
    <section className="hero">
      <p className="hero__eyebrow">TLA Shop</p>
      <h1>A small shop, built from four apps.</h1>
      <p className="hero__lede">
        The catalog, the cart and sign-in are separate apps loaded into this page at runtime.
        Add something to your cart and watch the badge in the header update.
      </p>
      <div className="hero__actions">
        <Link to="/products" className="button">
          Browse products
        </Link>
        <Link to="/cart" className="button button--ghost">
          Open cart
        </Link>
      </div>

      {/* Host UI that is powered by a hook from a remote app — proof that hooks can cross boundaries. */}
      <RemoteRoute name="user greeting" app="remote_user" note="useCurrentUser, rendered by host">
        <UserGreeting />
      </RemoteRoute>
    </section>

    <section className="stack">
      <h2>What runs where</h2>
      <ul className="stack__grid">
        {APPS.map((app) => (
          <li key={app.name} className="stack__card">
            <span className="stack__name">{app.name}</span>
            <span className="stack__port">localhost:{app.port}</span>
            <p>{app.does}</p>
          </li>
        ))}
      </ul>
    </section>
  </>
);

export default HomePage;
