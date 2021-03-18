import { ItemDetails, Video, WatchingStatus } from 'api';

export function getItemSeasonToPlay(item?: ItemDetails, seasonId?: string | number) {
  const season =
    item?.seasons?.find(({ number, watching }) => (seasonId ? +seasonId === +number : watching.status !== WatchingStatus.Watched)) ||
    item?.seasons?.[0];

  return season;
}

export function getItemVideoToPlay(item?: ItemDetails, episodeId?: string | number, seasonId?: string | number) {
  const season = getItemSeasonToPlay(item, seasonId);
  const video =
    item?.videos?.find(({ number, watching }) => (episodeId ? +episodeId === +number : watching.status !== WatchingStatus.Watched)) ||
    item?.videos?.[0];
  const episode =
    season?.episodes.find(({ number, watching }) => (episodeId ? +episodeId === +number : watching.status !== WatchingStatus.Watched)) ||
    season?.episodes[0];

  return (video || episode)!;
}

export function getItemTitle(item?: ItemDetails, video?: Video) {
  const title = item?.title || '';

  return video?.snumber ? `${title} (s${video?.snumber || 1}e${video?.number || 1})` : title;
}

export function getItemDescription(item?: ItemDetails, video?: Video) {
  const title = video?.title || '';
  const episode = `s${video?.snumber || 1}e${video?.number || 1}`;

  return video?.snumber ? (title ? `${title} (${episode})` : episode) : title;
}

export function getItemQualityIcon(item?: ItemDetails) {
  return item?.quality ? (item.quality === 2160 ? '4k' : item.quality === 1080 || item.quality === 720 ? 'hd' : 'sd') : null;
}

export function getItemNextVideo(item: ItemDetails, video: Video) {
  const season = item.seasons?.find(({ number }) => number === video.snumber);
  const nextVideo = (item.videos || season?.episodes)?.find(({ number }) => number === video.number + 1);

  if (nextVideo) {
    return nextVideo;
  }

  const nextSeason = item.seasons?.find(({ number }) => number === (season?.number || 0) + 1);
  if (nextSeason) {
    return nextSeason.episodes[0];
  }
}

export function getItemPreviousVideo(item: ItemDetails, video: Video) {
  const season = item.seasons?.find(({ number }) => number === video.snumber);
  const previousVideo = (item.videos || season?.episodes)?.find(({ number }) => number === video.number - 1);

  if (previousVideo) {
    return previousVideo;
  }

  const previousSeason = item.seasons?.find(({ number }) => number === (season?.number || 0) - 1);
  if (previousSeason) {
    return previousSeason.episodes[previousSeason.episodes.length - 1];
  }
}

export function getItemPrevNextVideos(item: ItemDetails, video: Video) {
  const nextVideo = getItemNextVideo(item, video);
  const previousVideo = getItemPreviousVideo(item, video);

  return [previousVideo, nextVideo] as const;
}

export function isItemSerial(item?: ItemDetails) {
  return Boolean(item?.seasons);
}
