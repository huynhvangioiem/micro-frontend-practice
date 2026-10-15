import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'remote_cart',
  filename: 'remoteEntry.js',
  exposes: {
    './CartPage': './src/components/CartPage.tsx',
    './CartBadge': './src/components/CartBadge.tsx',
    './cartStore': './src/store/cartStore.ts',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
});
