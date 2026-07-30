import { lazy } from 'react';
import RemoteRoute from '../components/RemoteRoute';

// Host component that calls the hook exposed by remote_user — it is lazy because the hook is located in a remote chunk.
const UserGreeting = lazy(() => import('../components/UserGreeting'));

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the homepage</p>

    {/* Host UI that is powered by a hook from a remote app — proof that hooks can cross boundaries. */}
    <RemoteRoute name="user greeting">
      <UserGreeting />
    </RemoteRoute>
  </div>
);

export default HomePage;
