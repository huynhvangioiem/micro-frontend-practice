import { Suspense, type ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Origin, { type AppName } from './Origin';

type RemoteRouteProps = {
  children: ReactNode;
  name: string;
  /** Short placeholders for small spots like the header, instead of block-level messages. */
  compact?: boolean;
  /** The app this content comes from; draws its boundary while "Show app boundaries" is on. */
  app?: AppName;
  /** What exactly comes from that app, shown in the boundary label. */
  note?: string;
};

/**
 * Wraps a remote in the ErrorBoundary + Suspense pair every route needs.
 *
 * Retry reloads the page. Re-mounting is not enough: after a failed load, Module
 * Federation's runtime replaces the module factory with one that rethrows the original
 * error, so only a fresh page can import the remote again. The cart and session live
 * in localStorage, so a reload loses nothing.
 */
const RemoteRoute = ({ children, name, compact = false, app, note }: RemoteRouteProps) => {
  const fallback = (
    <div className={compact ? 'remote-error remote-error--compact' : 'remote-error'} role="alert">
      <span>{compact ? `${name} unavailable` : `Unable to load ${name} (remote app error).`}</span>
      <button type="button" onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );

  const content = (
    <ErrorBoundary fallback={fallback}>
      <Suspense fallback={compact ? null : <div>Loading {name}…</div>}>{children}</Suspense>
    </ErrorBoundary>
  );

  return app ? (
    <Origin app={app} note={note} inline={compact}>
      {content}
    </Origin>
  ) : (
    content
  );
};

export default RemoteRoute;
