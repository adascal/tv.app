import { useMemo } from 'react';

import useLocation from 'hooks/useLocation';

import { queryToObject } from 'utils/url';

function useSearchParams() {
  const location = useLocation();
  return useMemo(() => queryToObject(location.search), [location.search]);
}

export default useSearchParams;
