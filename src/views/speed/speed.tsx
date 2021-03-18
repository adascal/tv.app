import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import sample from 'lodash/sample';

import { ServerLocation } from 'api';
import Button from 'components/button';
import Seo from 'components/seo';
import Spottable from 'components/spottable';
import Text from 'components/text';
import Title from 'components/title';
import useApi from 'hooks/useApi';
import useButtonEffect from 'hooks/useButtonEffect';
import useStorageState from 'hooks/useStorageState';

import { fixProtocol } from 'utils/url';

type SpeedResult = {
  [location: string]: string | null;
};

type SpeedHistoryItem = {
  timestamp: number;
  result: SpeedResult;
};

const SpeedTestResults: React.FC<{ locations?: ServerLocation[]; result: SpeedResult }> = ({ locations, result }) => {
  return (
    <div className="flex flex-row justify-around">
      {map(locations, (location) => (
        <div className={`flex flex-col items-center mb-4 w-1/${locations?.length}`} key={location.id}>
          <Text>{location.name}</Text>
          {result[location.location] || '0.00'}
          <Text>Mbit/s</Text>
        </div>
      ))}
    </div>
  );
};

const LOCATIONS_MAP: Record<string, string> = Object.fromEntries(
  (process.env.REACT_APP_SPEED_TEST_LOCATIONS || '').split(';').map((location) => location.split(':')),
);

const SERVER_INDEX = sample((process.env.REACT_APP_SPEED_TEST_SERVER_INDEXES || '').split(','))!;

function getLocationServer(location: string) {
  return fixProtocol(
    process.env.REACT_APP_SPEED_TEST_SERVER_TEMPLATE?.replace('{{LOCATION}}', LOCATIONS_MAP[location]).replace('{{INDEX}}', SERVER_INDEX),
  );
}

function updateSpeedReducer(state: SpeedResult, action: { type: string; payload: string | null }): SpeedResult {
  return {
    ...state,
    [action.type]: action.payload,
  };
}

const SpeedView: React.FC = () => {
  const { data } = useApi('serverLocations');
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const currentResultRef = useRef<SpeedResult>();
  const [currentResult, setCurrentResult] = useReducer(updateSpeedReducer, {});
  const [speedHistoryRaw, setSpeedHistoryRaw] = useStorageState<string>('speed_history');
  const [speedHistory, setSpeedHistory] = useState<SpeedHistoryItem[]>([]);

  const servers = useMemo(
    () =>
      map(data?.items, ({ name, location }) => ({
        name,
        location,
        server: getLocationServer(location),
        dlURL: 'garbage.php',
        ulURL: 'empty.php',
        pingURL: 'empty.php',
        getIpURL: 'getIP.php',
      })),
    [data?.items],
  );
  const workers = useMemo(() => {
    // @ts-expect-error
    if (!loaded && !window['Speedtest']) {
      return [];
    }

    return map(servers, (server) => {
      // @ts-expect-error
      const worker = new window['Speedtest']();

      worker.setParameter('test_order', 'D');
      worker.setParameter('time_auto', false);
      worker.setParameter('time_dl_max', 20);
      worker.setParameter('xhr_dlMultistream', 3);

      worker.setSelectedServer(server);

      worker.onupdate = ({ testState, dlStatus }: { testState: number; dlStatus: string }) => {
        setCurrentResult({
          type: server.location,
          payload: dlStatus || ((testState === 1 || testState === 2) && 'Начинаем') || '',
        });
      };

      return worker;
    });
  }, [servers, setCurrentResult, loaded]);
  const [currentWorkerIndex, setCurrentWorkerIndex] = useState(0);

  const handleStart = useCallback(() => {
    setStarted(true);
    setCurrentWorkerIndex(0);
  }, []);

  const handleStop = useCallback(() => {
    setStarted(false);
  }, []);

  const handleStartStop = useCallback(() => {
    if (started) {
      handleStop();
    } else {
      handleStart();
    }
  }, [started, handleStart, handleStop]);

  const handleSaveSpeedResult = useCallback(
    (result?: SpeedResult) => {
      if (!isEmpty(result) && result) {
        setSpeedHistoryRaw(
          JSON.stringify([
            {
              timestamp: dayjs().unix(),
              result,
            },
            ...speedHistory,
          ]),
        );
        Object.keys(result).forEach((type) => {
          setCurrentResult({
            type,
            payload: null,
          });
        });
      }
    },
    [speedHistory, setSpeedHistoryRaw],
  );

  const handleRemoveSpeedResult = useCallback(
    (resultToRemove: SpeedHistoryItem) => {
      setSpeedHistoryRaw(JSON.stringify(speedHistory.filter((speedResult) => speedResult.timestamp !== resultToRemove.timestamp)));
    },
    [speedHistory, setSpeedHistoryRaw],
  );

  const handleClearSpeedResult = useCallback(() => {
    setSpeedHistoryRaw(null);
  }, [setSpeedHistoryRaw]);

  useEffect(() => {
    if (workers[currentWorkerIndex]) {
      if (started) {
        workers[currentWorkerIndex].onend = () => {
          setCurrentWorkerIndex(currentWorkerIndex + 1);
        };

        if (workers[currentWorkerIndex]._state !== 3) {
          workers[currentWorkerIndex].start();
        }
      } else {
        if (workers[currentWorkerIndex]._state === 3) {
          workers[currentWorkerIndex].abort();
        }
      }
    } else {
      handleStop();
      if (started) {
        handleSaveSpeedResult(currentResultRef.current);
      }
    }
  }, [started, workers, currentWorkerIndex, handleStop, handleSaveSpeedResult]);

  useEffect(() => {
    currentResultRef.current = currentResult;
  }, [currentResult]);

  useEffect(() => {
    if (speedHistoryRaw) {
      setSpeedHistory(JSON.parse(speedHistoryRaw));
    } else {
      setSpeedHistory([]);
    }
  }, [speedHistoryRaw]);

  useEffect(() => {
    return () => {
      handleStop();
    };
  }, [handleStop]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = './speedtest.js';
    script.async = true;
    script.onload = () => {
      setLoaded(true);
    };
    script.onerror = (error) => {
      setError(`Не удалось загрузить скрипт для замера скорости: ${error}`);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useButtonEffect('Red', handleClearSpeedResult);
  useButtonEffect('Green', handleStartStop);

  return (
    <>
      <Seo title="Проверка скорости" />
      <Title className="mb-10">Проверка скорости</Title>
      <Spottable />

      {error ? (
        <div className="m-1 mb-10">
          <Text className="text-red-600">{error}</Text>
        </div>
      ) : (
        loaded &&
        servers.length > 0 &&
        !workers.length && (
          <div className="m-1 mb-10">
            <Text className="text-red-600">Не удалось создать ни одного воркера для замера скорости</Text>
          </div>
        )
      )}

      <SpeedTestResults locations={data?.items} result={currentResult} />

      <div className="flex justify-center pt-12">
        {started ? (
          <Button icon="stop" className="text-green-600" onClick={handleStop}>
            Стоп
          </Button>
        ) : (
          <Button icon="play_arrow" className="text-green-600" onClick={handleStart} disabled={!workers.length}>
            Начать
          </Button>
        )}
      </div>

      {speedHistory?.length > 0 && (
        <div className="flex flex-col pt-8">
          <div className="flex items-center pb-4">
            <Title>История запусков</Title>
            <Button icon="clear_all" className="ml-2 text-red-600" onClick={handleClearSpeedResult} />
          </div>

          <div className="flex flex-col">
            {map(speedHistory, (speedHistoryItem) => (
              <div key={speedHistoryItem.timestamp} className="flex flex-col pb-4">
                <div className="flex items-center justify-center">
                  <Text className="text-center">{dayjs.unix(speedHistoryItem.timestamp).format('DD.MM.YYYY HH:mm')}</Text>
                  <Button icon="clear" className="ml-2" onClick={() => handleRemoveSpeedResult(speedHistoryItem)} />
                </div>
                <SpeedTestResults locations={data?.items} result={speedHistoryItem.result} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SpeedView;
