import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'remote_cart',
  filename: 'remoteEntry.js',
  exposes: {
    './CartWidget': './src/components/CartWidget.tsx',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
});
