import { Link } from 'react-router-dom';
import useCurrentUser from 'remote_user/useCurrentUser';

/** Header widget driven by remote_user's hook. Lazy for the same reason as UserGreeting. */
const UserMenu = () => {
  const { user, logout } = useCurrentUser();

  if (!user) {
    return (
      <Link to="/login" className="pill-link">
        Sign in
      </Link>
    );
  }

  return (
    <span className="user-menu">
      <span className="user-menu__avatar" aria-hidden="true">
        {user.name.charAt(0).toUpperCase()}
      </span>
      <span className="user-menu__name">{user.name}</span>
      <button type="button" className="pill-button" onClick={logout}>
        Sign out
      </button>
    </span>
  );
};

export default UserMenu;
