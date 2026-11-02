import { useEffect, useState } from 'react';
import { apiClient, type ApiEnvelope } from '../lib/apiClient';

type ResourceState<T> = {
  data: T | null;
  meta: Record<string, unknown>;
  loading: boolean;
  error: string | null;
};

export function useApiResource<T>(path: string) {
  const [state, setState] = useState<ResourceState<T>>({
    data: null,
    meta: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true, error: null }));

    void apiClient.get<ApiEnvelope<T>>(path, controller.signal)
      .then((response) => {
        setState({ data: response.data, meta: response.meta, loading: false, error: null });
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          data: null,
          meta: {},
          loading: false,
          error: caught instanceof Error ? caught.message : 'Unable to load data',
        });
      });

    return () => controller.abort();
  }, [path]);

  return state;
}
