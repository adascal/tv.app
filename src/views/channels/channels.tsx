import React from 'react';

import ChannelsList from 'components/channelsList';
import PlaylistsList from 'components/playlistsList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';

const CollectionsView: React.FC = () => {
  const { data, isLoading } = useApi('channels');
  const { data: playlists, isLoading: playlistsLoading } = useApi('playlists');

  return (
    <>
      <Seo title="Каналы" />
      <PlaylistsList title="Плейлисты" playlists={playlists?.items} loading={playlistsLoading} className="pr-2" />
      <ChannelsList title="Каналы" channels={data?.channels} loading={isLoading} className="pr-2" />
    </>
  );
};

export default CollectionsView;
