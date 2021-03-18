import { Location, useLocation as useRouterLocation } from 'react-router';

function useLocation<TState extends Record<string, unknown>, TResult = Omit<Location, 'state'> & { state: TState }>(): TResult {
  return useRouterLocation() as unknown as TResult;
}

export default useLocation;
