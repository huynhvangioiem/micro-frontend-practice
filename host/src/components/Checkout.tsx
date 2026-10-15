import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from 'remote_cart/cartStore';
import useCurrentUser from 'remote_user/useCurrentUser';

const money = (value: number) => `$${value.toFixed(2)}`;

/**
 * Host-owned page that combines state from two remotes: the cart from remote_cart
 * and the signed-in user from remote_user.
 */
const Checkout = () => {
  const { user } = useCurrentUser();
  const { items, total, clearCart } = useCart();
  const [placedTotal, setPlacedTotal] = useState<number | null>(null);

  if (placedTotal !== null) {
    return (
      <div className="checkout checkout--done">
        <div className="checkout__check" aria-hidden="true">
          ✓
        </div>
        <h1>Order placed</h1>
        <p>
          Thanks, {user?.name}. We charged {money(placedTotal)} to your demo card.
        </p>
        <Link to="/products" className="button button--ghost">
          Keep shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout checkout--done">
        <h1>Nothing to check out</h1>
        <p>Your cart is empty.</p>
        <Link to="/products" className="button">
          Browse products
        </Link>
      </div>
    );
  }

  const placeOrder = () => {
    setPlacedTotal(total);
    clearCart();
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <p className="checkout__who">
        Shipping to {user?.name} · {user?.email}
      </p>
      <ul className="checkout__items">
        {items.map((item) => (
          <li key={item.id}>
            <span>
              {item.title} × {item.qty}
            </span>
            <span>{money(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>
      <p className="checkout__total">
        <span>Total</span>
        <span className="highlight">{money(total)}</span>
      </p>
      <button type="button" className="button" onClick={placeOrder}>
        Place order
      </button>
    </div>
  );
};

export default Checkout;
