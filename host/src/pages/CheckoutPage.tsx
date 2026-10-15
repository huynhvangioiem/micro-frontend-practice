import { lazy } from 'react';
import RemoteRoute from '../components/RemoteRoute';

// Both are lazy because they call hooks that live in remote chunks.
const RequireAuth = lazy(() => import('../components/RequireAuth'));
const Checkout = lazy(() => import('../components/Checkout'));

const CheckoutPage = () => (
  <RemoteRoute
    name="checkout"
    app="host"
    note="reads the remote_cart store and remote_user hook"
  >
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  </RemoteRoute>
);

export default CheckoutPage;
