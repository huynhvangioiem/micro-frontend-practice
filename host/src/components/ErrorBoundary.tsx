import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = { children: ReactNode; fallback?: ReactNode };
type ErrorBoundaryState = { hasError: boolean; error: Error | null };

/**
 * Prevents a failed remote component from causing the host application to crash. This boundary is placed outside
 * <Suspense> so that it can handle both errors that occur during import (such as when the remote is offline) and
 * rendering errors thrown by the remote component itself.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Intentionally logging for diagnostics: check this log when
    // a remote component fails due to network issues or React version mismatches.
    console.error('Remote component crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div>Unable to load component (remote app error).</div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
