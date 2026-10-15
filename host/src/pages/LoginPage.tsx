import { lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RemoteRoute from '../components/RemoteRoute';

const LoginForm = lazy(() => import('remote_user/LoginForm'));

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // RequireAuth stores the page the user was trying to reach.
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  return (
    <div className="auth-page">
      <RemoteRoute name="sign-in form" app="remote_user" note="LoginForm">
        <LoginForm onSuccess={() => navigate(from, { replace: true })} />
      </RemoteRoute>
    </div>
  );
};

export default LoginPage;
