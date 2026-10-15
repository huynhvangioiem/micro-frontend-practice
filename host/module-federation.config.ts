import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'host',
  remotes: {
    remote_cart: 'remote_cart@http://localhost:3010/mf-manifest.json',
    remote_catalog: 'remote_catalog@http://localhost:3020/mf-manifest.json',
    remote_user: 'remote_user@http://localhost:3002/mf-manifest.json',
  },
  shareStrategy: 'loaded-first',
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    'react-router-dom': { singleton: true },
  },
});
