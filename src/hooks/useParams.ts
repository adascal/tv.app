import { useParams as useRouterParams } from 'react-router';

function useParams<TKeys extends Record<string, unknown>>(): TKeys {
  return useRouterParams() as unknown as TKeys;
}

export default useParams;
