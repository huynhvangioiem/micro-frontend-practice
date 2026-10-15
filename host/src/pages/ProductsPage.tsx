import { lazy } from 'react';
import RemoteRoute from '../components/RemoteRoute';

// Mounted at `products/*`: the remote renders its own <Routes> for the list and `:id`.
const ProductsApp = lazy(() => import('remote_catalog/ProductsApp'));

const ProductsPage = () => (
  <RemoteRoute name="product catalog" app="remote_catalog" note="ProductsApp">
    <ProductsApp />
  </RemoteRoute>
);

export default ProductsPage;
