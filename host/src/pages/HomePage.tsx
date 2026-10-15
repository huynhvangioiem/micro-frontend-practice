import { lazy } from 'react';
import RemoteRoute from '../components/RemoteRoute';

// Host component that calls the hook exposed by remote_user — it is lazy because the hook is located in a remote chunk.
const UserGreeting = lazy(() => import('../components/UserGreeting'));

const HomePage = () => (
  <div>
    <h1>Hooks across the federation boundary</h1>
    <p>
      The greeting below is a host component, but the user state comes from the{' '}
      <code>useCurrentUser</code> hook exposed by <code>remote_user</code>. It only
      works because both apps share a single copy of React.
    </p>

    {/* Host UI that is powered by a hook from a remote app — proof that hooks can cross boundaries. */}
    <RemoteRoute name="user greeting">
      <UserGreeting />
    </RemoteRoute>
  </div>
);

export default HomePage;
