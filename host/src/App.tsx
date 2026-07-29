import { lazy, Suspense } from 'react';
import './App.css';

const CartWidget = lazy(() => import('remote_cart/CartWidget'));

const App = () => {
  return (
    <div className="content">
      <Suspense fallback={<div>Loading cart…</div>}>
        <CartWidget />
      </Suspense>
    </div>
  );
};

export default App;
