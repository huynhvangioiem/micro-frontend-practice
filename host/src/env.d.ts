/**
 * Type declarations for the host — emits no JS, exists purely for type-checking.
 *
 * Remote modules are resolved at runtime by Module Federation
 * (see `module-federation.config.ts`), so there is no file on disk for
 * TypeScript to read. The `declare module` blocks below are a hand-written
 * contract between the host and each remote.
 *
 * Note: TS does not cross-check these declarations against the remotes' real
 * code. If a remote changes its signature, the host still compiles and fails
 * at runtime instead — enable `dts: true` on the remotes to generate real
 * .d.ts files when that guarantee matters.
 */

/** Rsbuild types: import.meta.env, asset imports (.svg/.css/...), process.env */
/// <reference types="@rsbuild/core/types" />

/** remote_cart @ localhost:3010 */
declare module 'remote_cart/CartWidget' {
  const CartWidget: React.ComponentType;
  export default CartWidget;
}

/** remote_user @ localhost:3002 */
declare module 'remote_user/UserBadge' {
  const UserBadge: React.ComponentType;
  export default UserBadge;
}

/** Exposes both a named and a default export — the host can use either */
declare module 'remote_user/useCurrentUser' {
  export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  export function useCurrentUser(): {
    user: User | null;
    loading: boolean;
    refresh: () => void;
  };

  export default useCurrentUser;
}
