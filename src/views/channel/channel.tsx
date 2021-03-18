import { useCallback, useMemo } from 'react';

import { Channel } from 'api';
import Player, { PlayerProps } from 'components/player';
import Seo from 'components/seo';
import useGoBack from 'hooks/useGoBack';
import useLocationState from 'hooks/useLocationState';

import { mapSources } from 'utils/video';

const ChannelView: React.FC = () => {
  const goBack = useGoBack();
  const { channel } = useLocationState<{ channel: Channel }>();

  const playerProps = useMemo<PlayerProps>(() => {
    return {
      title: channel.title,
      poster: channel.logos?.m,
      sources: mapSources([
        {
          url: channel.stream,
        },
      ]),
    };
  }, [channel]);

  const handleOnEnded = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <>
      <Seo title={`Канал: ${channel.title}`} />
      <Player {...playerProps} onEnded={handleOnEnded} />
    </>
  );
};

export default ChannelView;
