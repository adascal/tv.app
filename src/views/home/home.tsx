import { useMemo, useState } from 'react';
import bluebird from 'bluebird';
import dayjs from 'dayjs';
import uniqBy from 'lodash/uniqBy';

import { HistoryItem, ItemsParams, WatchingStatus } from 'api';
import HistoryList from 'components/historyList';
import ItemsList from 'components/itemsList';
import Link from 'components/link';
import Scrollable from 'components/scrollable';
import Seo from 'components/seo';
import Spottable from 'components/spottable';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';
import useAsyncEffect from 'hooks/useAsyncEffect';
import useStorageState from 'hooks/useStorageState';
import { PATHS, generatePath } from 'routes';

import { getItemVideoToPlay, isItemSerial } from 'utils/item';

const ItemsSection: React.FC<{ title: string; params: ItemsParams }> = ({ title, params }) => {
  const { data, isLoading } = useApi('items', [params, 0, 10]);
  const href = useMemo(() => generatePath(PATHS.Category, { categoryType: params.type! }), [params]);

  return (
    <div className="pb-2 w-full">
      <ItemsList
        title={
          <Link href={href} state={{ params, title }} className="w-full">
            {title}
          </Link>
        }
        titleClassName="ml-0"
        items={data?.items}
        loading={isLoading}
        horizontal
      />
    </div>
  );
};

const lastMonth = dayjs().add(-1, 'month').unix();

const PopularMovies: React.FC = () => {
  return <ItemsSection title="Популярные фильмы" params={{ type: 'movie', sort: 'views-', conditions: [`created>=${lastMonth}`] }} />;
};

const NewMovies: React.FC = () => {
  return <ItemsSection title="Новые фильмы" params={{ type: 'movie', sort: 'created-' }} />;
};

const PopularSerials: React.FC = () => {
  return <ItemsSection title="Популярные сериалы" params={{ type: 'serial', sort: 'watchers-' }} />;
};

const NewSerials: React.FC = () => {
  return <ItemsSection title="Новые сериалы" params={{ type: 'serial', sort: 'created-' }} />;
};

const NewConcerts: React.FC = () => {
  return <ItemsSection title="Новые концерты" params={{ type: 'concert', sort: 'created-' }} />;
};

const NewDocuMovies: React.FC = () => {
  return <ItemsSection title="Новые документальные фильмы" params={{ type: 'documovie', sort: 'created-' }} />;
};

const NewDocuSerials: React.FC = () => {
  return <ItemsSection title="Новые документальные сериалы" params={{ type: 'docuserial', sort: 'created-' }} />;
};

const NewTVShows: React.FC = () => {
  return <ItemsSection title="Новые ТВ шоу" params={{ type: 'tvshow', sort: 'created-' }} />;
};

const WatchNext: React.FC = () => {
  const { data, isLoading } = useApi('history', [1, 50]);
  const { mutateAsync: getItemMediaAsync } = useApiMutation('itemMedia');
  const [isWatchNextItemsLoading, setIsWatchNextItemsLoading] = useState(true);
  const [watchNextItems, setWatchNextItems] = useState<HistoryItem[]>([]);
  const uniqHistoryItems = useMemo(() => uniqBy(data?.history, 'item.id'), [data?.history]);
  const loading = isLoading || isWatchNextItemsLoading;

  useAsyncEffect(async () => {
    setIsWatchNextItemsLoading(true);
    const watchNextItems = await bluebird.all(
      bluebird.map(uniqHistoryItems, async (historyItem) => {
        try {
          const details = (await getItemMediaAsync([historyItem.item.id])).item;
          const videoToPlay = getItemVideoToPlay(details);

          if (
            videoToPlay.watching.status === WatchingStatus.Watching ||
            (isItemSerial(details) && videoToPlay.watching.status === WatchingStatus.NoWatched)
          ) {
            return {
              ...historyItem,
              media: videoToPlay,
            };
          }
        } catch (ex) {
          return null;
        }
      }),
    );

    setWatchNextItems(watchNextItems.filter(Boolean) as HistoryItem[]);
    setIsWatchNextItemsLoading(false);
  }, [uniqHistoryItems, getItemMediaAsync]);

  if (!loading && watchNextItems.length === 0) {
    return null;
  }

  return (
    <div className="pb-2 w-full">
      <HistoryList title="На очереди" items={watchNextItems} loading={loading} skeletonsCount={5} horizontal />
    </div>
  );
};

const HomeView: React.FC = () => {
  const [isWatchNextSectionHidden] = useStorageState<boolean>('is_watch_next_section_hidden');

  return (
    <>
      <Seo title="Главная" />
      <Scrollable>
        <Spottable />

        {!isWatchNextSectionHidden && <WatchNext />}

        <PopularMovies />

        <NewMovies />

        <PopularSerials />

        <NewSerials />

        <NewConcerts />

        <NewDocuMovies />

        <NewDocuSerials />

        <NewTVShows />
      </Scrollable>
    </>
  );
};

export default HomeView;
