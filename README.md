# micro-frontend-practice

**TLA Shop** — a small shop built as a Module Federation demo: one host shell and three independently-built remotes. Built with Rsbuild + React 19 + `@module-federation/rsbuild-plugin`, as a pnpm workspace.

## Apps

| App              | Port | Role   | Exposes                                              |
| ---------------- | ---- | ------ | ---------------------------------------------------- |
| `host`           | 3000 | host   | —                                                    |
| `remote-catalog` | 3020 | remote | `./ProductsApp` (list + detail, owns its sub-routes) |
| `remote-cart`    | 3010 | remote | `./CartPage`, `./CartBadge`, `./cartStore`           |
| `remote-user`    | 3002 | remote | `./LoginForm`, `./UserBadge`, `./useCurrentUser`     |

`remote-catalog` also consumes `remote_cart/cartStore` to add products to the cart. Product data comes from [DummyJSON](https://dummyjson.com), so the catalog needs internet access.

## Getting started

```bash
pnpm install   # once, at the repo root
pnpm dev       # starts all four apps in parallel
```

Open http://localhost:3000. Each app can still run alone from its own folder (`pnpm dev` inside it), but the host and the catalog need the remotes they consume to be up.

`pnpm build` builds every app; `pnpm preview` inside an app serves its build.

Demo account for checkout: `jane.doe@example.com` / `password123`.

## Seeing which app owns what

The host draws a dashed, colour-coded outline and a label (`remote_cart :3010 · CartBadge`) around every region that comes from a remote, with a legend under the header. Anything not outlined belongs to the host. Switch it off with **Show app boundaries** in the header (the choice is remembered). The wrapper is [`Origin`](host/src/components/Origin.tsx); [`RemoteRoute`](host/src/components/RemoteRoute.tsx) takes `app` and `note` props to apply it.

## Routes

| Route            | Owner  | What it demonstrates                                                              |
| ---------------- | ------ | --------------------------------------------------------------------------------- |
| `/`              | host   | A host component (`UserGreeting`) calling `useCurrentUser` from `remote_user`      |
| `/products/*`    | catalog | The remote renders its own `<Routes>` (`/products`, `/products/:id`)              |
| `/cart`          | cart   | `remote_cart/CartPage`, with the host deciding where "Checkout" goes              |
| `/login`         | user   | `remote_user/LoginForm`; returns the user to the page they were headed to         |
| `/checkout`      | host   | Guarded by `RequireAuth`; combines cart state (cart remote) and user (user remote) |

User flow: browse → add to cart → cart → checkout → (redirected to login) → checkout → order placed.

## How it works

**Remote side** — each remote declares a name and its exposed modules in `module-federation.config.ts`:

```ts
export default createModuleFederationConfig({
  name: 'remote_cart',
  filename: 'remoteEntry.js',
  exposes: {
    './CartPage': './src/components/CartPage.tsx',
    './cartStore': './src/store/cartStore.ts',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});
```

**Host side** — remotes are pointed at by manifest URL, not bundled:

```ts
remotes: {
  remote_cart: 'remote_cart@http://localhost:3010/mf-manifest.json',
  remote_catalog: 'remote_catalog@http://localhost:3020/mf-manifest.json',
  remote_user: 'remote_user@http://localhost:3002/mf-manifest.json',
}
```

**Loading** — routes use `React.lazy` so the fetch chain (`mf-manifest.json` → `remoteEntry.js` → component chunk) happens at navigation time, wrapped by [`RemoteRoute`](host/src/components/RemoteRoute.tsx), which pairs an `ErrorBoundary` with `Suspense` so a dead remote degrades to a message with a Retry button instead of blanking the page. Stop `remote-catalog` and the rest of the shop keeps working.

## Sharing state across remotes

The header's cart badge (host), the "Add to cart" button (catalog) and the cart page (cart) all show the same cart. They share it through `remote_cart/cartStore`, a tiny external store read with `useSyncExternalStore`.

- **The state lives on `globalThis`, not in the module.** The host and each remote that imports `remote_cart/cartStore` run their own Module Federation runtime, so each can end up with its own copy of the module. A plain module-level variable would be duplicated and the badge would never see what the catalog added. The store keeps its data and subscribers on `globalThis.__TLA_CART__` (and the session store on `globalThis.__TLA_AUTH__`) so every copy talks to the same state.
- Both stores persist to `localStorage` (`tla-shop:cart`, `tla-shop:session`), so a page reload keeps the cart and the login.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Styling

Colours, fonts and the price highlight live in `src/tokens.css`. Each app ships its own copy of that file so a remote looks right when run alone; inside the host the values simply agree. Change a token in all four copies to restyle the shop.

## Notes worth knowing

- **React and React Router must be singletons.** Every app declares `react`/`react-dom` as `singleton: true` (the catalog and host also share `react-router-dom`, because the catalog renders its own `<Routes>` inside the host's router). Sharing a *hook* across the boundary only works with one React copy — two copies means the remote's `useState` writes to the wrong dispatcher and you get `Invalid hook call`.
- **You can't `lazy()` a hook.** That's why host components that call remote hooks ([`UserGreeting`](host/src/components/UserGreeting.tsx), [`UserMenu`](host/src/components/UserMenu.tsx), [`RequireAuth`](host/src/components/RequireAuth.tsx), [`Checkout`](host/src/components/Checkout.tsx)) are their own files: the lazy boundary sits on the component that calls the hook, not on the hook itself.
- **Retry reloads the page.** After a remote fails to load, Module Federation's runtime replaces the module factory with one that rethrows the original error, so remounting the component can't recover — only a fresh page can import the remote again. Cart and session survive the reload.
- **Remotes need `assetPrefix: 'auto'`.** With Rsbuild's default `/`, the manifest's `publicPath` is `/`, so the host requests `remoteEntry.js` and the remote's chunks from its *own* origin and gets its HTML back (`Unexpected token '<'`). `'auto'` resolves them from wherever the remote was loaded.
- **Remote types are generated.** The plugin emits each remote's real `.d.ts` files, and consumers pull them into `@mf-types/` (git-ignored; wired through `paths` in each `tsconfig.json`). A changed remote signature shows up as a type error in the host — run the apps once (`pnpm dev` or `pnpm build`) to generate the types before running `tsc`.
