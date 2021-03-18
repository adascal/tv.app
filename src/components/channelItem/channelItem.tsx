import { useCallback } from 'react';

import { Channel } from 'api';
import ImageItem from 'components/imageItem';
import useNavigate from 'hooks/useNavigate';
import { PATHS, generatePath } from 'routes';

type Props = {
  channel?: Channel;
  className?: string;
};

const ChannelItem: React.FC<Props> = ({ channel, className }) => {
  const navigate = useNavigate();
  const handleOnClick = useCallback(() => {
    if (channel?.id) {
      navigate(
        generatePath(PATHS.Channel, {
          channelId: channel.id,
        }),
        {
          state: {
            channel,
            title: channel.title || channel.name,
          },
        },
      );
    }
  }, [channel, navigate]);

  return <ImageItem onClick={handleOnClick} source={channel?.logos?.s} caption={channel?.title} className={className} />;
};

export default ChannelItem;
