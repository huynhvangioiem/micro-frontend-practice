import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useCurrentUser from 'remote_user/useCurrentUser';

/** Redirects to /login, remembering where the user was headed. Lazy because it calls remote_user's hook. */
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
