import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'remote_user',
  filename: 'remoteEntry.js',
  exposes: {
    './UserBadge': './src/components/UserBadge.tsx',
    './useCurrentUser': './src/hooks/useCurrentUser.ts',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
});
