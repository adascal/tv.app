import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import map from 'lodash/map';

import { Bool, Season, Video, WatchingStatus } from 'api';
import Button from 'components/button';
import Image from 'components/image';
import ItemsList from 'components/itemsList';
import Link from 'components/link';
import Popup from 'components/popup';
import Scrollable from 'components/scrollable';
import SeasonsList from 'components/seasonsList';
import Seo from 'components/seo';
import Spottable from 'components/spottable';
import Text from 'components/text';
import VideoItem from 'components/videoItem';
import Bookmarks from 'containers/bookmarks';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';
import useButtonEffect from 'hooks/useButtonEffect';
import useLocation from 'hooks/useLocation';
import useNavigate from 'hooks/useNavigate';
import useNavigateToVideo from 'hooks/useNavigateToVideo';
import useParams from 'hooks/useParams';
import useStreamingTypeEffect from 'hooks/useStreamingTypeEffect';
import { PATHS, RouteParams, generatePath } from 'routes';

import { secondsToDuration } from 'utils/date';
import { getItemTitle, getItemVideoToPlay, isItemSerial } from 'utils/item';
import { mapAudios, mapSubtitles } from 'utils/video';

const SimilarItems: React.FC<{ itemId: string; className?: string }> = ({ itemId, className }) => {
  const { data } = useApi('itemSmiliar', [itemId]);

  if (data && data.items?.length > 0) {
    return (
      <div className={className}>
        <ItemsList title="Похожие" titleClassName="ml-0 mt-0 text-gray-500" items={data.items} />
      </div>
    );
  }

  return null;
};

const ItemView: React.FC = () => {
  const navigate = useNavigate();
  const navigateToVideo = useNavigateToVideo();
  const location = useLocation();
  const { itemId } = useParams<RouteParams>();
  const posterRef = useRef<HTMLImageElement>(null);
  const [bookmarksPopupVisible, setBookmarksPopupVisible] = useState(false);
  const { data, refetch } = useApi('itemMedia', [itemId!], { staleTime: 0 });

  const { watchingToggleAsync } = useApiMutation('watchingToggle');
  const { watchingToggleWatchlistAsync } = useApiMutation('watchingToggleWatchlist');
  const { watchingMarkTimeAsync } = useApiMutation('watchingMarkTime');

  const trailer = useMemo(() => data?.item.trailer, [data?.item]);
  const videoToPlay = useMemo(() => getItemVideoToPlay(data?.item), [data?.item]);
  const title = useMemo(() => getItemTitle(data?.item, videoToPlay), [data?.item, videoToPlay]);
  const durationAverage = useMemo(() => secondsToDuration(data?.item?.duration?.average), [data?.item]);
  const durationTotal = useMemo(() => secondsToDuration(data?.item?.duration?.total), [data?.item]);
  const audios = useMemo(() => mapAudios(videoToPlay?.audios || []), [videoToPlay]);
  const subtitles = useMemo(() => mapSubtitles(videoToPlay?.subtitles || []), [videoToPlay]);
  const isSerial = useMemo(() => isItemSerial(data?.item), [data?.item]);
  const isWatching = useMemo(
    () => (isSerial ? data?.item?.subscribed : videoToPlay?.watching.status === WatchingStatus.Watching),
    [data?.item, isSerial, videoToPlay],
  );

  const handleOnPlayClick = useCallback(() => {
    navigateToVideo(data?.item, videoToPlay);
  }, [navigateToVideo, data?.item, videoToPlay]);

  const handleOnTrailerClick = useCallback(() => {
    if (trailer?.id) {
      navigate(
        generatePath(PATHS.Trailer, {
          trailerId: trailer.id,
        }),
        {
          state: {
            item: data?.item,
            trailer,
          },
        },
      );
    }
  }, [navigate, data?.item, trailer]);

  const handleOnBookmarksClick = useCallback(() => {
    setBookmarksPopupVisible(true);
  }, []);
  const handleBookmarksPopupClose = useCallback(() => {
    setBookmarksPopupVisible(false);
  }, []);
  const handleSeasonWatchToggle = useCallback(
    async (season?: Season | null) => {
      await watchingToggleAsync([itemId!, undefined, season?.number]);
      refetch();
    },
    [itemId, refetch, watchingToggleAsync],
  );
  const handleEpisodeWatchToggle = useCallback(
    async (episode: Video, season?: Season | null) => {
      await watchingToggleAsync([itemId!, episode.number, season?.number]);
      refetch();
    },
    [itemId, refetch, watchingToggleAsync],
  );

  const handleOnVisibilityClick = useCallback(async () => {
    if (isSerial) {
      await watchingToggleWatchlistAsync([itemId!]);
    } else {
      if (isWatching) {
        await watchingToggleAsync([itemId!, videoToPlay.number, 0, Bool.False]);
      } else {
        await watchingMarkTimeAsync([itemId!, 30, videoToPlay.number]);
      }
    }
    refetch();
  }, [itemId, isSerial, isWatching, videoToPlay, watchingToggleWatchlistAsync, watchingToggleAsync, watchingMarkTimeAsync, refetch]);

  useEffect(() => {
    requestAnimationFrame(() => {
      posterRef.current?.scrollIntoView();
    });
  }, [location.pathname]);

  useStreamingTypeEffect();
  useButtonEffect(['Play', 'Red'], handleOnPlayClick);
  useButtonEffect('Green', handleOnBookmarksClick);
  useButtonEffect('Yellow', handleOnTrailerClick);
  useButtonEffect('Blue', handleOnVisibilityClick);

  return (
    <>
      <Seo title={`Просмотр: ${title}`} />
      <Scrollable className="h-full">
        <div className="relative w-screen h-screen">
          <Spottable />
          <Image
            ref={posterRef}
            className="absolute w-screen h-screen"
            alt={data?.item?.title}
            src={data?.item?.posters.wide || data?.item?.posters.big}
          />

          {data?.item && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2 bg-black md:p-4 bg-opacity-70">
              <div className="flex flex-wrap justify-between w-full md:justify-start">
                <Button icon="play_circle_outline" onClick={handleOnPlayClick} className="text-red-600">
                  Смотреть{isSerial ? ` s${videoToPlay.snumber}e${videoToPlay.number}` : ''}
                </Button>

                <Button icon="bookmark" onClick={handleOnBookmarksClick} className="text-green-600">
                  В закладки
                </Button>

                {trailer ? (
                  <Button icon="videocam" onClick={handleOnTrailerClick} className="order-4 text-yellow-600 sm:order-none">
                    Трейлер
                  </Button>
                ) : (
                  <div />
                )}

                <Button icon={isWatching ? 'visibility_off' : 'visibility'} onClick={handleOnVisibilityClick} className="text-blue-600">
                  {isWatching ? 'Не буду смотреть' : 'Буду смотреть'}
                </Button>
              </div>

              <Popup visible={bookmarksPopupVisible} onClose={handleBookmarksPopupClose} closeButton="Green">
                <Bookmarks key={`${itemId}-${bookmarksPopupVisible}`} itemId={itemId!} />
              </Popup>
            </div>
          )}
        </div>

        <div className="flex flex-col p-4 max-w-screen md:p-6">
          <div className="flex flex-col pb-6 lg:flex-row">
            <div className="flex items-start self-center flex-shrink-0 pb-6 lg:self-start lg:mr-8 w-52">
              <VideoItem item={data?.item} wrapperClassName="w-full sm:w-full lg:w-full 2xl:w-full" showViews noCaption disableNavigation />
            </div>

            <div className="flex flex-col">
              <Text className="text-2xl">{data?.item?.title}</Text>
              <div className="flex items-center">
                <Text className="text-gray-500">
                  {data?.item?.year}
                  {map(data?.item?.countries, (country) => (
                    <span key={country.id} className="ml-2">
                      {country.title}
                    </span>
                  ))}
                </Text>
                {isSerial && !data?.item?.finished && (
                  <Text className="px-3 ml-2 text-xs bg-red-700 border-2 border-gray-200 rounded-xl whitespace-nowrap">ON AIR</Text>
                )}
              </div>

              {Boolean(data?.item?.genres?.length) && (
                <div className="flex flex-wrap py-2">
                  {map(data?.item?.genres, (genre) => (
                    <Link
                      key={genre.id}
                      href={generatePath(PATHS.Category, { categoryType: data?.item?.type! }, { genre: genre.id })}
                      className="px-2 mb-2 mr-2 border-2 border-gray-200 rounded-xl"
                    >
                      {genre.title}
                    </Link>
                  ))}
                </div>
              )}

              {Boolean(durationTotal || durationAverage) && (
                <div className="py-2">
                  <Text className="text-gray-500">Длительность</Text>
                  <div className="flex">
                    {durationTotal === durationAverage ? (
                      <Text className="pl-2">{durationTotal}</Text>
                    ) : (
                      <>
                        <div className="flex mr-2">
                          <Text className="mr-2 text-gray-500">Серия:</Text>
                          <Text>≈{durationAverage}</Text>
                        </div>
                        <div className="flex mr-2">
                          <Text className="mr-2 text-gray-500">Сериал:</Text>
                          <Text>{durationTotal}</Text>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {data?.item?.plot && (
                <div className="py-2">
                  <Text className="text-gray-500">Описание</Text>
                  <Text className="pl-2 whitespace-pre-wrap">{data?.item?.plot}</Text>
                </div>
              )}

              {audios.length > 0 && (
                <div className="py-2">
                  <Text className="text-gray-500">Перевод</Text>
                  <div className="flex flex-wrap pl-2">
                    {map(audios, (voice, idx) => (
                      <Text className="w-full xl:w-1/2" key={idx}>
                        {voice.name}
                      </Text>
                    ))}
                  </div>
                </div>
              )}

              {subtitles.length > 0 && (
                <div className="py-2">
                  <Text className="text-gray-500">Субтитры</Text>
                  <div className="flex flex-wrap pl-2">
                    {map(subtitles, (subtitle, idx) => (
                      <Text className="w-1/3 xl:w-1/6" key={idx}>
                        {subtitle.name}
                      </Text>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {Boolean(data?.item?.tracklist?.length) && (
            <div className="flex flex-col pb-6">
              <Text className="text-gray-500">Треклист</Text>
              <div className="flex flex-col flex-wrap">
                {map(data?.item.tracklist, (track, idx) => (
                  <Text key={idx}>
                    {idx + 1}. {track.title}
                  </Text>
                ))}
              </div>
            </div>
          )}

          <SeasonsList
            className="pb-6"
            item={data?.item!}
            seasons={data?.item?.seasons}
            onSeasonWatchToggle={handleSeasonWatchToggle}
            onEpisodeWatchToggle={handleEpisodeWatchToggle}
          />

          {Boolean(data?.item?.director || data?.item?.cast) && (
            <div className="flex flex-col pb-6 lg:flex-row">
              {data?.item?.director && (
                <div className="flex-shrink-0 pb-6 mr-8 w-52 lg:pb-0">
                  <Text className="text-gray-500">Создатели</Text>
                  {map(data?.item?.director.split(', '), (director) => (
                    <Link key={director} href={generatePath(PATHS.Search, null, { q: director, field: 'director' })}>
                      {director}
                    </Link>
                  ))}
                </div>
              )}
              {data?.item?.cast && (
                <div className="flex flex-col">
                  <Text className="text-gray-500">В ролях</Text>
                  <div className="flex flex-wrap">
                    {map(data?.item?.cast.split(', '), (actor, idx, arr) => (
                      <Link key={actor} href={generatePath(PATHS.Search, null, { q: actor, field: 'cast' })}>
                        {actor}
                        {idx !== arr.length - 1 && ', '}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <SimilarItems className="pb-6" itemId={itemId!} />
        </div>
      </Scrollable>
    </>
  );
};

export default ItemView;
