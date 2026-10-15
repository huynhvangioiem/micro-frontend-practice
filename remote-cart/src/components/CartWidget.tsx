import { useState } from 'react';
import './CartWidget.css';

const CartWidget = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="cart-widget">
      <h2 className="cart-title">🛒 Cart (remote_cart)</h2>
      <p className="cart-count">{count} item{count === 1 ? '' : 's'}</p>
      <div className="cart-actions">
        <button
          type="button"
          className="cart-button"
          onClick={() => setCount((c) => Math.max(0, c - 1))}
          disabled={count === 0}
        >
          −
        </button>
        <button
          type="button"
          className="cart-button"
          onClick={() => setCount((c) => c + 1)}
        >
          +
        </button>
      </div>
      <p className="cart-hint">
        The count is useState inside the remote. It needs the host and remote to share one React copy, or the hook throws "Invalid hook call".
      </p>
    </div>
  );
};

export default CartWidget;
