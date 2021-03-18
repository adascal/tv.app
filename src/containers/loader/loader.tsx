import { useCallback, useEffect, useMemo, useState } from 'react';

import Spinner from 'components/spinner';
import Text from 'components/text';
import useButtonEffect from 'hooks/useButtonEffect';
import useDeviceAuthorizationEffect, { AuthorizationStep } from 'hooks/useDeviceAuthorizationEffect';
import useDeviceInfo from 'hooks/useDeviceInfo';
import useGoBack from 'hooks/useGoBack';
import useLocation from 'hooks/useLocation';
import useNavigate from 'hooks/useNavigate';
import useStorageState from 'hooks/useStorageState';
import { PATHS } from 'routes';

const Loader: React.FC = ({ children }) => {
  const goBack = useGoBack();
  const navigate = useNavigate();
  const location = useLocation();
  const deviceInfo = useDeviceInfo();
  const [showNotice, setShowNotice] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [showSpinnerText, setShowSpinnerText] = useState(false);
  const [authorizationStep, setAuthorizationStep] = useState<AuthorizationStep>();
  const [helpShown, setHelpShown] = useStorageState<boolean>('is_help_shown');
  const shouldShowHelp = useMemo(() => process.env.REACT_APP_HIDE_HELP_MENU !== 'true' && !helpShown, [helpShown]);

  const handleBackButtonClick = useCallback(() => {
    if (location.pathname !== PATHS.Home) {
      goBack();
    } else if (showNotice) {
      window.close();
    } else {
      setShowNotice(true);

      setTimeout(() => {
        setShowNotice(false);
      }, 5 * 1000);
    }
  }, [location.pathname, goBack, showNotice]);

  const handleAuthorization = useCallback(
    (authorizationStep: AuthorizationStep) => {
      setAuthorizationStep(authorizationStep);

      if (authorizationStep === 'authorized') {
        if (location.pathname === PATHS.Pair || location.pathname === PATHS.Index) {
          let navigationPath: string = PATHS.Home;
          if (shouldShowHelp) {
            setHelpShown(true);
            navigationPath = PATHS.Help;
          }

          navigate(navigationPath, { replace: true });
        }
      }
    },
    [location.pathname, navigate, shouldShowHelp, setHelpShown],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSpinner(authorizationStep === 'processing');
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [authorizationStep]);

  useEffect(() => {
    console.log({ deviceInfo });
  }, [deviceInfo]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSpinnerText(true);
    }, 7 * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useButtonEffect('Back', handleBackButtonClick);
  useDeviceAuthorizationEffect(handleAuthorization);

  if (showSpinner) {
    return (
      <Spinner>
        <Text className="mt-4">{showSpinnerText ? 'Сервер не отвечает...' : <>&nbsp;</>}</Text>
      </Spinner>
    );
  }

  return (
    <>
      {showNotice && (
        <div className="fixed p-4 bg-gray-500 shadow-xl top-2 right-2 z-999 rounded-xl bg-opacity-70">
          <Text>
            Чтобы закрыть приложение,
            <br />
            нажмите кнопку "назад" ещё раз
          </Text>
        </div>
      )}
      {children}
    </>
  );
};

export default Loader;
