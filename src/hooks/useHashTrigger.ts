import { useCallback, useEffect, useMemo, useRef } from 'react';

import useGoBack from 'hooks/useGoBack';
import useLocation from 'hooks/useLocation';
import useNavigate from 'hooks/useNavigate';

function useHashTrigger(hash: string, onClose?: Function, onOpen?: Function) {
  const goBack = useGoBack();
  const navigate = useNavigate();
  const location = useLocation();
  const hasHashRef = useRef(false);

  const open = useCallback(() => {
    if (!hasHashRef.current) {
      navigate(
        {
          hash,
          search: location.search,
          pathname: location.pathname,
        },
        {
          state: location.state,
        },
      );
    }
    onOpen?.();
  }, [hash, location.search, location.pathname, location.state, navigate, onOpen]);

  const close = useCallback(() => {
    if (hasHashRef.current) {
      goBack();
    }
    onClose?.();
  }, [goBack, onClose]);

  useEffect(() => {
    hasHashRef.current = location.hash.includes(hash);
  }, [hash, location.hash]);

  useEffect(() => {
    const frameId = setTimeout(() => {
      if (hasHashRef.current) {
        open();
      } else {
        close();
      }
    }, 100);

    return () => {
      clearTimeout(frameId);
    };
  }, [open, close, location.hash]);

  return useMemo(
    () => ({
      open,
      close,
    }),
    [open, close],
  );
}

export default useHashTrigger;
