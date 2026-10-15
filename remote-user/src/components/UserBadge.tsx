import React from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import './UserBadge.css';

/**
 * Component exposed through Module Federation.
 *
 * It consumes the same `useCurrentUser` hook the remote exposes separately, so
 * the host can either render this badge or call the hook and build its own UI.
 */
const UserBadge: React.FC = () => {
  const { user, logout } = useCurrentUser();

  if (!user) {
    return <div className="user-badge user-badge--empty">Not signed in.</div>;
  }

  // First letter of the name, used as a cheap avatar placeholder.
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="user-badge">
      <div className="user-badge__avatar">{initial}</div>

      <div className="user-badge__info">
        <span className="user-badge__name">{user.name}</span>
        <span className="user-badge__role">{user.role}</span>
        <span className="user-badge__email">{user.email}</span>
      </div>

      <button type="button" className="user-badge__action" onClick={logout}>
        Sign out
      </button>
    </div>
  );
};

export default UserBadge;
