import React from 'react';
import map from 'lodash/map';

import { Channel } from 'api';
import ChannelItem from 'components/channelItem';
import Scrollable from 'components/scrollable';
import Title from 'components/title';

type Props = {
  title?: React.ReactNode;
  channels?: Channel[];
  loading?: boolean;
  onScrollToEnd?: () => void;
  scrollable?: boolean;
  horizontal?: boolean;
  skeletonsCount?: number;
  className?: string;
  titleClassName?: string;
};

const ChannelsList: React.FC<Props> = ({
  title,
  channels,
  loading,
  onScrollToEnd,
  scrollable = true,
  horizontal = false,
  skeletonsCount = 20,
  className,
  titleClassName,
}) => {
  const content = (
    <>
      {map(channels, (channel) => (
        <ChannelItem key={channel.id} channel={channel} />
      ))}
      {loading && map([...new Array(skeletonsCount)], (_, idx) => <ChannelItem key={idx} />)}
    </>
  );

  return (
    <>
      <Title className={titleClassName}>{title}</Title>
      {scrollable ? (
        <Scrollable onScrollToEnd={onScrollToEnd} horizontal={horizontal} className={className} omitDumpElement>
          {content}
        </Scrollable>
      ) : (
        content
      )}
    </>
  );
};

export default ChannelsList;
