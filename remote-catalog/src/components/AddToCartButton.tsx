import { useEffect, useState } from 'react';
import { addItem } from 'remote_cart/cartStore';
import type { Product } from '../api/products';

const FEEDBACK_MS = 1200;

/** The button is catalog UI, but the item goes into remote_cart's shared store. */
const AddToCartButton = ({ product }: { product: Product }) => {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [added]);

  const handleClick = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
    setAdded(true);
  };

  return (
    <button
      type="button"
      className={added ? 'add-to-cart add-to-cart--added' : 'add-to-cart'}
      title="Adds to the shared cart store from remote_cart"
      onClick={handleClick}
    >
      {added ? 'Added to cart ✓' : 'Add to cart'}
    </button>
  );
};

export default AddToCartButton;
