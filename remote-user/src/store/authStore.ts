export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthGlobal = {
  user: User | null;
  listeners: Set<() => void>;
};

const STORAGE_KEY = 'tla-shop:session';

/** The one account the mock API accepts. */
export const DEMO_ACCOUNT = {
  email: 'jane.doe@example.com',
  password: 'password123',
};

const DEMO_USER: User = {
  id: 'u_001',
  name: 'Jane Doe',
  email: DEMO_ACCOUNT.email,
  role: 'Frontend Engineer',
};

declare global {
  var __TLA_AUTH__: AuthGlobal | undefined;
}

function load(): User | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as User | null;
  } catch {
    return null;
  }
}

/**
 * Session state lives on globalThis for the same reason as the cart: the host and
 * each remote can load their own copy of this module, and they must all see the
 * same signed-in user.
 */
const store: AuthGlobal = (globalThis.__TLA_AUTH__ ??= {
  user: load(),
  listeners: new Set(),
});

function commit(user: User | null) {
  store.user = user;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode, quota); the in-memory session still works.
  }
  store.listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  store.listeners.add(listener);
  return () => {
    store.listeners.delete(listener);
  };
}

export const getUser = () => store.user;

/** Fake API call: resolves after 500ms, rejects on wrong credentials. */
export function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === DEMO_ACCOUNT.email &&
        password === DEMO_ACCOUNT.password
      ) {
        commit({ ...DEMO_USER });
        resolve({ ...DEMO_USER });
      } else {
        reject(new Error('Wrong email or password.'));
      }
    }, 500);
  });
}

export const logout = () => commit(null);
