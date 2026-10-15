import { Link } from 'react-router-dom';
import useCurrentUser from 'remote_user/useCurrentUser';

/**
 * Host-owned component that calls the remote's hook directly.
 *
 * This demonstrates that hooks can cross the federation boundary: the JSX below
 * belongs to the host, but `useCurrentUser`—and the state it manages—comes from
 * remote_user. This only works when React is a singleton. If there are two React copies,
 * this will throw an "Invalid hook call" error.
 *
 * You can't wrap a hook with React.lazy(), so the lazy boundary needs to be on
 * this component itself—that's why it lives in its own file.
 */
const UserGreeting = () => {
  const { user } = useCurrentUser();

  return (
    <p className="hero__greeting">
      {user ? (
        <>
          Welcome back, <strong>{user.name}</strong>.
        </>
      ) : (
        <>
          You are browsing as a guest. <Link to="/login">Sign in</Link> to check out.
        </>
      )}
    </p>
  );
};

export default UserGreeting;
