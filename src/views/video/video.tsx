import { useCallback, useMemo } from 'react';

import { ItemDetails, Streaming, Video, WatchingStatus } from 'api';
import { AudioTrack, SourceTrack, SubtitleTrack } from 'components/media';
import Player, { PlayerMediaState, PlayerProps } from 'components/player';
import Seo from 'components/seo';
import VideoItem from 'components/videoItem';
import useApi from 'hooks/useApi';
import useApiMutation from 'hooks/useApiMutation';
import useDeepMemo from 'hooks/useDeepMemo';
import useGoBack from 'hooks/useGoBack';
import useLocationState from 'hooks/useLocationState';
import useNavigateToVideo from 'hooks/useNavigateToVideo';
import usePrevNextVideos from 'hooks/usePrevNextVideos';
import useSearchParam from 'hooks/useSearchParam';
import useStorageState from 'hooks/useStorageState';

import { getItemDescription, getItemTitle, getItemVideoToPlay } from 'utils/item';
import { mapAudios, mapSources, mapSubtitles } from 'utils/video';

const HTTP_MAX_AUDIOS = 7;

const VideoView: React.FC = () => {
  const goBack = useGoBack();
  const navigateToVideo = useNavigateToVideo();
  const seasonId = useSearchParam('seasonId');
  const episodeId = useSearchParam('episodeId');
  const { item } = useLocationState<{ title: string; item: ItemDetails }>();

  const { watchingMarkTimeAsync } = useApiMutation('watchingMarkTime');
  const [streamingType] = useStorageState<Streaming>('streaming_type');
  const [defaultQuality] = useStorageState<string | null>('default_quality', null);
  const [isAC3ByDefaultActive] = useStorageState<boolean>('is_ac3_by_default_active');
  const [isForcedByDefaultActive] = useStorageState<boolean>('is_forced_by_default_active');
  const [isSwitchToHLSFromHTTPActive] = useStorageState<boolean>('is_switch_to_hls_from_http_active');
  const [savedAudioId, setSavedAudioId] = useStorageState<string>(`item_${item.id}_saved_audio_id`);
  const [savedSourceId, setSavedSourceId] = useStorageState<string>(`item_${item.id}_saved_source_id`);
  const [savedSubtitleId, setSavedSubtitleId] = useStorageState<string | null>(`item_${item.id}_saved_subtitle_id`);

  const currentVideo = useMemo(() => getItemVideoToPlay(item, episodeId, seasonId), [item, episodeId, seasonId]);

  const [previousVideo, nextVideo] = usePrevNextVideos(item, currentVideo);

  const currentVideoLinks = useApi('itemMediaLinks', [currentVideo.id]);
  const forcedStreamingType = useMemo(
    () => (streamingType === 'http' && isSwitchToHLSFromHTTPActive && currentVideo.audios.length > HTTP_MAX_AUDIOS ? 'hls' : streamingType),
    [streamingType, currentVideo, isSwitchToHLSFromHTTPActive],
  );

  const saveCurrentTime = useCallback(
    async ({ number, snumber }: Video, currentTime: number) => {
      await watchingMarkTimeAsync([item.id, currentTime, number, snumber]);
    },
    [watchingMarkTimeAsync, item],
  );

  const playerProps = useDeepMemo(
    () =>
      currentVideoLinks?.data
        ? ({
            title: getItemTitle(item, currentVideo),
            description: getItemDescription(item, currentVideo),
            poster: item.posters.wide || item.posters.big,
            audios: mapAudios(currentVideo.audios, isAC3ByDefaultActive, savedAudioId),
            sources: mapSources(currentVideoLinks.data.files, forcedStreamingType, defaultQuality, savedSourceId),
            subtitles: mapSubtitles(currentVideoLinks.data.subtitles, isForcedByDefaultActive, savedSubtitleId),
            startTime: currentVideo.watching.status === WatchingStatus.Watching ? currentVideo.watching.time : 0,
          } as PlayerProps)
        : null,
    [
      item,
      currentVideo,
      currentVideoLinks?.data,
      forcedStreamingType,
      defaultQuality,
      isAC3ByDefaultActive,
      isForcedByDefaultActive,
      savedAudioId,
      savedSourceId,
      savedSubtitleId,
    ],
  );

  const setCurrentVideo = useCallback(
    (video: Video) => {
      navigateToVideo(item, video, true);
    },
    [navigateToVideo, item],
  );

  const handlePause = useCallback(
    ({ currentTime }: PlayerMediaState) => {
      saveCurrentTime(currentVideo, currentTime);
    },
    [saveCurrentTime, currentVideo],
  );

  const handleNext = useCallback(() => {
    if (nextVideo) {
      setCurrentVideo(nextVideo);
      return;
    }

    goBack();
  }, [goBack, setCurrentVideo, nextVideo]);

  const handlePrevious = useCallback(() => {
    if (previousVideo) {
      setCurrentVideo(previousVideo);
      return;
    }

    goBack();
  }, [goBack, setCurrentVideo, previousVideo]);

  const handleOnEnded = useCallback(
    async ({ currentTime }: PlayerMediaState) => {
      await saveCurrentTime(currentVideo, currentTime);
      handleNext();
    },
    [saveCurrentTime, handleNext, currentVideo],
  );

  const handleJumpBackward = useCallback(
    async ({ currentTime }: PlayerMediaState) => {
      await saveCurrentTime(currentVideo, currentTime);
      handlePrevious();
    },
    [saveCurrentTime, handlePrevious, currentVideo],
  );

  const handleJumpForward = useCallback(
    async ({ currentTime }: PlayerMediaState) => {
      await saveCurrentTime(currentVideo, currentTime);
      handleNext();
    },
    [saveCurrentTime, handleNext, currentVideo],
  );

  const handleTimeSync = useCallback(
    ({ currentTime }: PlayerMediaState) => {
      saveCurrentTime(currentVideo, currentTime);
    },
    [saveCurrentTime, currentVideo],
  );

  const handleAudioChange = useCallback(
    (audioTrack: AudioTrack) => {
      setSavedAudioId(audioTrack?.id);
    },
    [setSavedAudioId],
  );

  const handleSourceChange = useCallback(
    (sourceTrack: SourceTrack) => {
      setSavedSourceId(sourceTrack?.id);
    },
    [setSavedSourceId],
  );

  const handleSubtitleChange = useCallback(
    (subtitleTrack: SubtitleTrack | null) => {
      setSavedSubtitleId(subtitleTrack?.id ?? null);
    },
    [setSavedSubtitleId],
  );

  return (
    <>
      <Seo title={`Просмотр: ${item.title} - Видео`} />

      {playerProps && (
        <Player
          key={currentVideo.id}
          {...playerProps}
          streamingType={forcedStreamingType}
          onPause={handlePause}
          onEnded={handleOnEnded}
          onJumpBackward={handleJumpBackward}
          onJumpForward={handleJumpForward}
          onTimeSync={handleTimeSync}
          onAudioChange={handleAudioChange}
          onSourceChange={handleSourceChange}
          onSubtitleChange={handleSubtitleChange}
          renderControls={() => (
            <>
              <div className="w-52 z-101 fixed left-9 bottom-44 hidden lg:flex">
                <VideoItem item={item} wrapperClassName="w-full sm:w-full lg:w-full 2xl:w-full" showViews noCaption replaceNavigation />
              </div>
            </>
          )}
        />
      )}
    </>
  );
};

export default VideoView;
