import { useSyncExternalStore } from 'react';

export type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  qty: number;
};

export type CartProduct = Omit<CartItem, 'qty'>;

type CartGlobal = {
  items: CartItem[];
  listeners: Set<() => void>;
};

const STORAGE_KEY = 'tla-shop:cart';

declare global {
  var __TLA_CART__: CartGlobal | undefined;
}

function load(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CartItem[];
  } catch {
    return [];
  }
}

/**
 * The state lives on globalThis, not in this module. The host and every remote that
 * imports `remote_cart/cartStore` each run their own Module Federation runtime, so each
 * can end up with its own copy of this file. A module-level variable would then be
 * duplicated and the header badge would never see what the catalog added.
 */
const store: CartGlobal = (globalThis.__TLA_CART__ ??= {
  items: load(),
  listeners: new Set(),
});

function commit(items: CartItem[]) {
  store.items = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage can be unavailable (private mode, quota); the in-memory cart still works.
  }
  store.listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  store.listeners.add(listener);
  return () => {
    store.listeners.delete(listener);
  };
}

export const getItems = () => store.items;

export function addItem(product: CartProduct) {
  const exists = store.items.some((item) => item.id === product.id);
  commit(
    exists
      ? store.items.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        )
      : [...store.items, { ...product, qty: 1 }],
  );
}

export function setQty(id: number, qty: number) {
  commit(
    qty <= 0
      ? store.items.filter((item) => item.id !== id)
      : store.items.map((item) => (item.id === id ? { ...item, qty } : item)),
  );
}

export const removeItem = (id: number) => setQty(id, 0);

export const clearCart = () => commit([]);

export function useCart() {
  const items = useSyncExternalStore(subscribe, getItems);
  return {
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    addItem,
    setQty,
    removeItem,
    clearCart,
  };
}

export default useCart;
