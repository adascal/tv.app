import { useCallback, useEffect, useState } from 'react';

import useApiMutation from 'hooks/useApiMutation';
import useDeviceInfo from 'hooks/useDeviceInfo';
import useLocation from 'hooks/useLocation';
import useNavigate from 'hooks/useNavigate';
import useStorageState from 'hooks/useStorageState';
import { PATHS, generatePath } from 'routes';

export type AuthorizationStep = 'processing' | 'pair' | 'authorized';

function useDeviceAuthorizationEffect(onAuthorization?: (authorizationStep: AuthorizationStep) => void) {
  const navigate = useNavigate();
  const location = useLocation();
  const deviceInfo = useDeviceInfo();
  const [userCode, setUserCode] = useState('');
  const { deviceAuthorizationAsync } = useApiMutation('deviceAuthorization');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLogged] = useStorageState<boolean>('is_logged');

  const handleOnConfirm = useCallback(
    (userCode: string, verificationUri: string) =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          navigate(
            generatePath(PATHS.Pair, null, {
              userCode,
              verificationUri,
            }),
            { replace: true },
          );
          onAuthorization?.('pair');
          setUserCode(userCode);
          resolve();
        });
      }),
    [navigate, onAuthorization],
  );

  useEffect(() => {
    if (!isLogged) {
      setIsAuthorized(false);
    }
  }, [isLogged]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        if (!userCode || location.pathname !== PATHS.Pair) {
          if (!isAuthorized) {
            onAuthorization?.('processing');
            await deviceAuthorizationAsync([deviceInfo, handleOnConfirm]);
            setIsAuthorized(true);
          }
          onAuthorization?.('authorized');
        }
      } catch (ex) {
        console.error(ex);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLogged, isAuthorized, deviceInfo, userCode, location, onAuthorization, handleOnConfirm, deviceAuthorizationAsync]);
}

export default useDeviceAuthorizationEffect;
