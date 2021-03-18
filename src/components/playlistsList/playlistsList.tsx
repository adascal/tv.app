import React from 'react';
import map from 'lodash/map';

import { Playlist } from 'api';
import PlaylistItem from 'components/playlistItem';
import Scrollable from 'components/scrollable';
import Title from 'components/title';

type Props = {
  title?: string;
  playlists?: Playlist[];
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
  playlists,
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
      {map(playlists, (playlist) => (
        <PlaylistItem key={playlist.id} playlist={playlist} />
      ))}
      {loading && map([...new Array(skeletonsCount)], (_, idx) => <PlaylistItem key={idx} />)}
    </>
  );

  if (!loading && !playlists?.length) {
    return null;
  }

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
