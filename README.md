# micro-frontend-practice

A minimal Module Federation playground: one host app that consumes components **and hooks** from two independently-built remotes. Built with Rsbuild + React 19 + `@module-federation/rsbuild-plugin`.

## Apps

| App           | Port  | Role   | Exposes                                     |
| ------------- | ----- | ------ | ------------------------------------------- |
| `host`        | 3000  | host   | —                                           |
| `remote-cart` | 3010  | remote | `./CartWidget`                              |
| `remote-user` | 3002  | remote | `./UserBadge`, `./useCurrentUser`           |

Each app is a standalone project with its own `package.json`, so it can be run and built on its own. This README covers all three.

## Getting started

Install dependencies in each app:

```bash
for d in host remote-cart remote-user; do (cd "$d" && pnpm install); done
```

Start the remotes **first** — the host resolves them at runtime, so they must be serving their manifests before you load the host:

```bash
# one terminal per app
cd remote-cart && pnpm dev   # http://localhost:3010
cd remote-user && pnpm dev   # http://localhost:3002
cd host        && pnpm dev   # http://localhost:3000
```

Then open http://localhost:3000.

Build / preview any app with `pnpm build` and `pnpm preview`.

## Routes

| Route   | What it demonstrates                                                            |
| ------- | ------------------------------------------------------------------------------- |
| `/`     | A **host** component (`UserGreeting`) calling `useCurrentUser` from `remote_user` |
| `/cart` | `remote_cart/CartWidget` loaded on demand                                       |
| `/user` | `remote_user/UserBadge` loaded on demand                                        |

## How it works

**Remote side** — each remote declares a name and its exposed modules in `module-federation.config.ts`:

```ts
export default createModuleFederationConfig({
  name: 'remote_cart',
  filename: 'remoteEntry.js',
  exposes: { './CartWidget': './src/components/CartWidget.tsx' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});
```

**Host side** — remotes are pointed at by manifest URL, not bundled:

```ts
remotes: {
  remote_cart: 'remote_cart@http://localhost:3010/mf-manifest.json',
  remote_user: 'remote_user@http://localhost:3002/mf-manifest.json',
}
```

**Loading** — routes use `React.lazy` so the fetch chain (`mf-manifest.json` → `remoteEntry.js` → component chunk) happens at navigation time, wrapped by [`RemoteRoute`](host/src/components/RemoteRoute.tsx), which pairs an `ErrorBoundary` with `Suspense` so a dead remote degrades instead of blanking the page.

## Notes worth knowing

- **React must be a singleton.** Both apps declare `react`/`react-dom` as `singleton: true`, and the host uses `shareStrategy: 'loaded-first'`. Sharing a *hook* across the boundary only works with one React copy — two copies means the remote's `useState` writes to the wrong dispatcher and you get `Invalid hook call`.
- **You can't `lazy()` a hook.** That's why [`UserGreeting.tsx`](host/src/components/UserGreeting.tsx) exists as its own file: the lazy boundary sits on the component that calls the hook, not on the hook itself.
- **Remote types are hand-written.** [`host/src/env.d.ts`](host/src/env.d.ts) declares each remote module by hand. TypeScript does *not* verify these against the remotes' real code — a changed signature still compiles and fails at runtime. Enable `dts: true` on the remotes to generate real `.d.ts` files when that guarantee matters.
