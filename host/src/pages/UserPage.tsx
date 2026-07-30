import { lazy } from 'react';
import RemoteRoute from '../components/RemoteRoute';

// Remote module, loaded on demand the same way as remote_cart.
const UserBadge = lazy(() => import('remote_user/UserBadge'));

const UserPage = () => (
  <RemoteRoute name="UserBadge">
    <UserBadge />
  </RemoteRoute>
);

export default UserPage;
