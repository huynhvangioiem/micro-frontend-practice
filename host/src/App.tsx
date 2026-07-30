import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import UserPage from './pages/UserPage';
import './App.css';

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="user" element={<UserPage />} />
    </Route>
  </Routes>
);

export default App;
