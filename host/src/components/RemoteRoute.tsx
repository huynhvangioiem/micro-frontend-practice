import { Suspense, type ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

/** Wraps a remote in the ErrorBoundary + Suspense pair every route needs. */
const RemoteRoute = ({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) => (
  <ErrorBoundary fallback={<div>Unable to load {name}! (remote app error)</div>}>
    <Suspense fallback={<div>Loading {name}…</div>}>{children}</Suspense>
  </ErrorBoundary>
);

export default RemoteRoute;
