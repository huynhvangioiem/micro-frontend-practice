import { useCallback, useEffect, useState } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const MOCK_USER: User = {
  id: 'u_001',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  role: 'Frontend Engineer',
};

/** Fake API call: resolves the user after a 500ms delay. */
function fetchCurrentUser(): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...MOCK_USER }), 500);
  });
}

/**
 * Hook exposed through Module Federation.
 *
 * Hooks only work across the host <-> remote boundary when React is a singleton.
 * If the host and the remote load two different React copies, `useState` here
 * writes to the other instance's dispatcher -> "Invalid hook call".
 */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // useCallback keeps `refresh` stable so the effect below doesn't re-run forever.
  const refresh = useCallback(() => {
    setLoading(true);
    fetchCurrentUser().then((next) => {
      setUser(next);
      setLoading(false);
    });
  }, []);

  // Fetch once on mount.
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, refresh };
}

// Default export so the host can import it directly:
// import useCurrentUser from 'remote_user/useCurrentUser'
export default useCurrentUser;
