import { Route, Routes } from 'react-router-dom';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';

/**
 * Exposed entry point. It owns its sub-routes, so the host only has to mount it
 * at `products/*` and the catalog decides what `/products/:id` looks like.
 */
const ProductsApp = () => (
  <Routes>
    <Route index element={<ProductList />} />
    <Route path=":id" element={<ProductDetail />} />
  </Routes>
);

export default ProductsApp;
