import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import './tokens.css';
import './App.css';

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="products/*" element={<ProductsPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
    </Route>
  </Routes>
);

export default App;
