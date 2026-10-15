import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'remote_catalog',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductsApp': './src/components/ProductsApp.tsx',
  },
  // The catalog adds products to the cart through remote_cart's shared store.
  remotes: {
    remote_cart: 'remote_cart@http://localhost:3010/mf-manifest.json',
  },
  shareStrategy: 'loaded-first',
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    // ProductsApp renders its own <Routes> inside the host's router, so both
    // sides must share the same react-router context.
    'react-router-dom': { singleton: true },
  },
});
