import { useEffect, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

/** Runs `load` whenever `key` changes and aborts the previous request. */
export function useAsync<T>(
  load: (signal: AbortSignal) => Promise<T>,
  key: string,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, error: null, loading: true }));
    load(controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error: Error) => {
        if (controller.signal.aborted) return;
        setState({ data: null, error, loading: false });
      });
    return () => controller.abort();
    // `key` stands in for the inputs `load` closes over.
  }, [key]);

  return state;
}
