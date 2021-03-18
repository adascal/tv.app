import useLocation from 'hooks/useLocation';

function useLocationState<TState extends Record<string, unknown>>(): TState {
  return useLocation<TState>().state || {};
}

export default useLocationState;
