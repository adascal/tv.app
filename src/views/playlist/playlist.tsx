import { Fragment, useCallback, useMemo, useState } from 'react';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import uniq from 'lodash/uniq';

import { Channel, Playlist } from 'api';
import Accordion from 'components/accordion';
import ChannelsList from 'components/channelsList';
import Input from 'components/input';
import Seo from 'components/seo';
import Text from 'components/text';
import useApi from 'hooks/useApi';
import useLocationState from 'hooks/useLocationState';

const PlaylistView: React.FC = () => {
  const { playlist } = useLocationState<{ playlist: Playlist }>();
  const { data, isLoading } = useApi('playlist', [playlist.id]);
  const [query, setQuery] = useState('');

  const handleQueryChange = useCallback(
    (value) => {
      setQuery(value);
    },
    [setQuery],
  );

  const channels = useMemo<Channel[]>(
    () =>
      orderBy(data?.items, 'id', 'asc').map((item) => ({
        id: `pl-${playlist.id}-${item.id}`,
        title: item.title,
        name: item.group || '',
        logos: {
          s: item.image,
          m: item.image,
        },
        stream: item.url,
      })),
    [playlist, data],
  );

  const filteredChannels = useMemo<Channel[]>(
    () => (query ? channels.filter((channel) => channel.title.toLowerCase().includes(query.toLowerCase())) : channels),
    [channels, query],
  );
  const grouppedChannels = useMemo(() => groupBy(filteredChannels, 'name'), [filteredChannels]);

  const [favorite, rest] = useMemo(() => {
    const groups = uniq(channels.map((channel) => channel.name));
    const favorite = groups.filter((group) => ['favorite', 'избранное', 'избранные', 'общие'].includes(group.toLowerCase()));
    const rest = groups.filter((group) => !favorite.includes(group));

    return [favorite, rest] as const;
  }, [channels]);

  return (
    <>
      <Seo title={`Плейлист: ${playlist.title}`} />

      <div className="w-full mb-4">
        <div className="flex items-center justify-between mb-2 h-9">
          <Text>Каналы</Text>
        </div>
        <Input placeholder="Название канала..." value={query} onChange={handleQueryChange} />
      </div>

      {map(favorite, (group) =>
        grouppedChannels[group]?.length ? (
          <Accordion key={group} title={group} open>
            <ChannelsList channels={grouppedChannels[group]} />
          </Accordion>
        ) : null,
      )}

      {map(rest, (group) =>
        grouppedChannels[group]?.length ? (
          <Fragment key={group}>
            {group ? (
              <Accordion title={group} open={!!query}>
                <ChannelsList channels={grouppedChannels[group]} />
              </Accordion>
            ) : (
              <ChannelsList channels={grouppedChannels[group]} />
            )}
          </Fragment>
        ) : null,
      )}

      {isLoading && <ChannelsList loading className="pr-2" />}
    </>
  );
};

export default PlaylistView;
