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
  const { user, loading, refresh } = useCurrentUser();

  if (loading) {
    return <p>Loading user…</p>;
  }

  return (
    <p>
      Hello, <strong>{user?.name ?? 'guest'}</strong> — this hook runs from{' '}
      <code>remote_user</code>.{' '}
      <button type="button" onClick={refresh}>
        Refresh
      </button>
    </p>
  );
};

export default UserGreeting;
