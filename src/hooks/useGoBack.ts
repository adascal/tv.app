import { useCallback } from 'react';

import useNavigate from 'hooks/useNavigate';

function useGoBack() {
  const navigate = useNavigate();

  const goBack = useCallback(
    (delta: number = -1) => {
      navigate(delta);
    },
    [navigate],
  );

  return goBack;
}

export default useGoBack;
