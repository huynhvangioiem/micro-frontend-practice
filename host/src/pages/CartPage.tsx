import { lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import RemoteRoute from '../components/RemoteRoute';

// Remote module. The import() is a separate chunk fetched at route time:
// mf-manifest.json -> remoteEntry.js -> component chunk.
const RemoteCartPage = lazy(() => import('remote_cart/CartPage'));

const CartPage = () => {
  const navigate = useNavigate();

  return (
    <RemoteRoute name="cart" app="remote_cart" note="CartPage">
      <RemoteCartPage
        onCheckout={() => navigate('/checkout')}
        onBrowse={() => navigate('/products')}
      />
    </RemoteRoute>
  );
};

export default CartPage;
