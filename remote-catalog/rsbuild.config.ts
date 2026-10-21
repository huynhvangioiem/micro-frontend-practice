import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import moduleFederationConfig from './module-federation.config';

export default defineConfig({
  plugins: [pluginReact(), pluginModuleFederation(moduleFederationConfig)],
  html: { title: 'TLA Shop · Catalog (remote_catalog)' },
  server: {
    port: 3020,
  },
  // Resolve chunk URLs from wherever remoteEntry.js was loaded, so a host on another
  // origin fetches them from this remote instead of from itself.
  dev: { assetPrefix: 'auto' },
  output: { assetPrefix: 'auto' },
});
