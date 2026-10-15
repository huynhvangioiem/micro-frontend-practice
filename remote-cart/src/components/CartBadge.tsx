import { useCart } from '../store/cartStore';
import './CartBadge.css';

/** Cart icon with a live item count; the host wraps it in a link. */
const CartBadge = () => {
  const { count } = useCart();

  return (
    <span className="cart-badge">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      Cart
      <span className="cart-badge__count" aria-label={`${count} items in cart`}>
        {count}
      </span>
    </span>
  );
};

export default CartBadge;
