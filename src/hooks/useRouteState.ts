import { useCallback, useMemo } from 'react';

import useLocation from 'hooks/useLocation';
import useNavigate from 'hooks/useNavigate';

export type RouteStateOptions<T> = {
  useHistoryReplace?: boolean;
  deserialize?: (value: string) => T;
  serialize?: (value: T) => string;
};

const defaultOptions: Required<RouteStateOptions<any>> = {
  useHistoryReplace: false,
  deserialize: (value) => value,
  serialize: (value) => String(value),
};

type UseRouteStateResult<T> = [T, (value: T, useHistoryReplace?: boolean) => void, (useHistoryReplace?: boolean) => void];

function useRouteState<T, Key extends string>(key: Key, initialValue: T, options?: RouteStateOptions<T>): UseRouteStateResult<T> {
  const navigate = useNavigate();
  const location = useLocation();
  const opts = useMemo(() => ({ ...defaultOptions, ...options } as Required<RouteStateOptions<T>>), [options]);

  const value = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const param = params.get(key);

    if (param) {
      return opts.deserialize(param);
    }

    return initialValue;
  }, [key, initialValue, opts, location.search]);

  const handleChange = useCallback(
    (newValue: T, useHistoryReplace?: boolean) => {
      const prevSearch = location.search;
      const params = new URLSearchParams(prevSearch);
      const serialized = opts.serialize(newValue);

      if (serialized) {
        params.set(key, serialized);
      } else {
        params.delete(key);
      }

      const newSearch = `?${params}`;

      if (prevSearch !== newSearch) {
        navigate(
          {
            search: newSearch,
            hash: location.hash,
            pathname: location.pathname,
          },
          {
            state: location.state,
            replace: useHistoryReplace || opts.useHistoryReplace,
          },
        );
      }
    },
    [key, opts, location, navigate],
  );
  const handleReset = useCallback(
    (useHistoryReplace?: boolean) => {
      handleChange(initialValue, useHistoryReplace);
    },
    [initialValue, handleChange],
  );

  return [value, handleChange, handleReset];
}

export default useRouteState;
