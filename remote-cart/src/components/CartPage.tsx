import { useCart } from '../store/cartStore';
import './CartPage.css';

type CartPageProps = {
  /** Called when the user clicks checkout; the host decides where that goes. */
  onCheckout?: () => void;
  /** Called from the empty state; the host decides where the catalog lives. */
  onBrowse?: () => void;
};

const money = (value: number) => `$${value.toFixed(2)}`;

const CartPage = ({ onCheckout, onBrowse }: CartPageProps) => {
  const { items, count, total, setQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1>Your cart is empty</h1>
        <p>Products you add show up here, and in the header badge.</p>
        {onBrowse && (
          <button type="button" className="cart-page__primary" onClick={onBrowse}>
            Browse products
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>
        Your cart <span className="cart-page__count">{count} {count === 1 ? 'item' : 'items'}</span>
      </h1>
      <div className="cart-page__layout">
        <ul className="cart-page__list">
          {items.map((item) => (
            <li key={item.id} className="cart-page__item">
              <img src={item.thumbnail} alt="" width={80} height={80} />
              <div className="cart-page__info">
                <span className="cart-page__title">{item.title}</span>
                <span className="cart-page__price">{money(item.price)} each</span>
                <button
                  type="button"
                  className="cart-page__remove"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
              <div className="cart-page__qty">
                <button
                  type="button"
                  aria-label={`Decrease ${item.title}`}
                  onClick={() => setQty(item.id, item.qty - 1)}
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button
                  type="button"
                  aria-label={`Increase ${item.title}`}
                  onClick={() => setQty(item.id, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <span className="cart-page__line-total">{money(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>

        <aside className="cart-page__summary">
          <h2>Order summary</h2>
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{money(total)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>Free</dd>
            </div>
            <div className="cart-page__total">
              <dt>Total</dt>
              <dd className="highlight">{money(total)}</dd>
            </div>
          </dl>
          <button type="button" className="cart-page__primary" onClick={onCheckout}>
            Checkout
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
