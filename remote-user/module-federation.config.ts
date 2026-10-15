import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'remote_user',
  filename: 'remoteEntry.js',
  exposes: {
    './UserBadge': './src/components/UserBadge.tsx',
    './LoginForm': './src/components/LoginForm.tsx',
    './useCurrentUser': './src/hooks/useCurrentUser.ts',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
});
