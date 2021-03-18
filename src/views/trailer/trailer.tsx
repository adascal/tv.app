import { useCallback, useMemo } from 'react';

import { ItemDetails, Trailer } from 'api';
import Player, { PlayerProps } from 'components/player';
import Seo from 'components/seo';
import useGoBack from 'hooks/useGoBack';
import useLocationState from 'hooks/useLocationState';

import { mapSources } from 'utils/video';

const TrailerView: React.FC = () => {
  const goBack = useGoBack();
  const { item, trailer } = useLocationState<{ item: ItemDetails; trailer: Trailer }>();

  const playerProps = useMemo<PlayerProps>(() => {
    return {
      title: item.title,
      description: 'Трейлер',
      poster: item.posters.wide || item.posters.big,
      sources: mapSources([trailer]),
    };
  }, [item, trailer]);

  const handleOnEnded = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <>
      <Seo title={`Просмотр: ${item.title} - Трейлер`} />
      <Player {...playerProps} onEnded={handleOnEnded} />
    </>
  );
};

export default TrailerView;
