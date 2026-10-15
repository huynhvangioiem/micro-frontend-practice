import { useSyncExternalStore } from 'react';
import { getUser, login, logout, subscribe } from '../store/authStore';

export type { User } from '../store/authStore';

/**
 * Hook exposed through Module Federation.
 *
 * Hooks only work across the host <-> remote boundary when React is a singleton.
 * If the host and the remote load two different React copies, `useSyncExternalStore`
 * here writes to the other instance's dispatcher -> "Invalid hook call".
 */
export function useCurrentUser() {
  const user = useSyncExternalStore(subscribe, getUser);
  return { user, login, logout };
}

// Default export so the host can import it directly:
// import useCurrentUser from 'remote_user/useCurrentUser'
export default useCurrentUser;
