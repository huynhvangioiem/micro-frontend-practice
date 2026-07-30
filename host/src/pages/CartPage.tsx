import { lazy } from 'react';
import RemoteRoute from '../components/RemoteRoute';

// Remote module. The import() is a separate chunk fetched at route time:
// mf-manifest.json -> remoteEntry.js -> component chunk.
const CartWidget = lazy(() => import('remote_cart/CartWidget'));

const CartPage = () => (
  <RemoteRoute name="CartWidget">
    <CartWidget />
  </RemoteRoute>
);

export default CartPage;
