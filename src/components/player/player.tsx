import React, { useCallback, useEffect, useRef, useState } from 'react';
import VideoPlayer, { VideoPlayerBase, VideoPlayerBaseProps } from '@enact/moonstone/VideoPlayer';
import Spotlight from '@enact/spotlight';

import BackButton from 'components/backButton';
import Button from 'components/button';
import Media, { AudioTrack, MediaProps, SourceTrack, StreamingType, SubtitleTrack } from 'components/media';
import Text from 'components/text';
import useButtonEffect from 'hooks/useButtonEffect';
import useStorageState from 'hooks/useStorageState';

import Settings from './settings';
import StartFrom from './startFrom';

import { isKey } from 'utils/keyboard';
import { fixProtocol } from 'utils/url';

export type PlayerMediaState = {
  currentTime: number;
  duration: number;
  paused: boolean;
  playbackRate: number;
  proportionLoaded: number;
  proportionPlayed: number;
};

export type PlayerProps = {
  title: string;
  description?: string;
  poster?: string;
  audios?: AudioTrack[];
  sources: SourceTrack[];
  subtitles?: SubtitleTrack[];
  startTime?: number;
  timeSyncInterval?: number;
  streamingType?: StreamingType;
  onPlay?: (state: PlayerMediaState) => void;
  onPause?: (state: PlayerMediaState) => void;
  onEnded?: (state: PlayerMediaState) => void;
  onTimeSync?: (state: PlayerMediaState) => void | Promise<void>;
  renderControls?: () => React.ReactElement;
} & VideoPlayerBaseProps &
  Omit<MediaProps, 'onPlay' | 'onPause' | 'onEnded'>;

const Player: React.FC<PlayerProps> = ({
  title,
  description,
  poster,
  audios,
  sources,
  subtitles,
  startTime,
  timeSyncInterval = 30,
  streamingType,
  onPlay,
  onPause,
  onEnded,
  onTimeSync,
  onJumpBackward,
  onJumpForward,
  renderControls,
  ...props
}) => {
  const playerRef = useRef<VideoPlayerBase>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isControlsAvailable, setIsControlsAvailable] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPauseByOKClickActive] = useStorageState<boolean>('is_pause_by_ok_click_active');
  const [isSettingsByUpClickActive] = useStorageState<boolean>('is_settings_by_up_click_active', true);

  const getPlayerMediaState = useCallback(() => (playerRef.current?.getMediaState() || {}) as PlayerMediaState, []);

  const handlePlay = useCallback(
    (e) => {
      setIsSettingsOpen(false);
      onPlay?.(e as PlayerMediaState);
    },
    [onPlay],
  );

  const handlePause = useCallback(
    (e) => {
      onPause?.(e as PlayerMediaState);
    },
    [onPause],
  );

  const handlePlayPause = useCallback(
    (e?: KeyboardEvent) => {
      const current = Spotlight.getCurrent() as HTMLElement;
      if (playerRef.current && (!e || isPauseByOKClickActive || isKey(e, 'PlayPause'))) {
        if (!current || !current.offsetHeight || !current.offsetWidth || current.getAttribute('aria-hidden') === 'true') {
          const video: any = playerRef.current.getVideoNode();
          video.playPause();
          return false;
        } else if (current && (current.getAttribute('aria-label') === 'Pause' || current.getAttribute('aria-label') === 'Play')) {
          current.click();
          return false;
        }
      }
    },
    [isPauseByOKClickActive],
  );

  const handleEnded = useCallback(() => {
    const state = getPlayerMediaState();
    onEnded?.(state);
  }, [onEnded, getPlayerMediaState]);

  const handleTimeSync = useCallback(() => {
    const state = getPlayerMediaState();
    onTimeSync?.(state);
  }, [onTimeSync, getPlayerMediaState]);

  const handleLoadedMetadata = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleControlsAvailable = useCallback(({ available }) => {
    setIsControlsAvailable(available);
  }, []);

  const handleBackButtonClick = useCallback(() => {
    handleTimeSync();

    if (playerRef.current) {
      const video: any = playerRef.current.getVideoNode();

      if (video.isFullScreen) {
        video.exitFullScreen();
        return false;
      }
    }
  }, [handleTimeSync]);

  const handleSettingsOpen = useCallback(() => {
    setIsSettingsOpen(true);
    playerRef.current?.pause();
  }, []);

  const handleSettingsClose = useCallback(() => {
    setIsSettingsOpen(false);
    playerRef.current?.play();
  }, []);

  const handleFullScreen = useCallback(() => {
    if (playerRef.current) {
      const video: any = playerRef.current.getVideoNode();

      if (video.isFullScreen) {
        video.exitFullScreen();
      } else {
        video.requestFullScreen();
      }
    }
  }, []);

  const handlePauseButton = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const handleChannelUp = useCallback(() => {
    const state = getPlayerMediaState();
    onJumpForward?.(state);
  }, [onJumpForward, getPlayerMediaState]);

  const handleChannelDown = useCallback(() => {
    const state = getPlayerMediaState();
    onJumpBackward?.(state);
  }, [onJumpBackward, getPlayerMediaState]);

  const handleArrowUp = useCallback(() => {
    if (isSettingsByUpClickActive) {
      handleSettingsOpen();
    }
  }, [isSettingsByUpClickActive, handleSettingsOpen]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (onTimeSync) {
      intervalId = setInterval(handleTimeSync, timeSyncInterval * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timeSyncInterval, onTimeSync, handleTimeSync]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const resetTimeout = () => {
      timeoutId && clearTimeout(timeoutId);
      timeoutId = null;
    };

    const clickHandler = (e: MouseEvent) => {
      // @ts-expect-error
      if (e.target?.['className']?.includes('VideoPlayer_overlay')) {
        if (timeoutId) {
          resetTimeout();
          handleFullScreen();
        } else {
          timeoutId = setTimeout(() => {
            resetTimeout();
          }, 500);
        }
      }
    };

    document.addEventListener('click', clickHandler);

    return () => {
      resetTimeout();
      document.removeEventListener('click', clickHandler);
    };
  }, [handleFullScreen]);

  useButtonEffect('Back', handleBackButtonClick);
  useButtonEffect('Yellow', handleFullScreen);
  useButtonEffect('Blue', handleSettingsOpen);
  useButtonEffect('Play', handleSettingsClose);
  useButtonEffect('Pause', handlePauseButton);
  useButtonEffect(['PlayPause', 'Enter'], handlePlayPause);
  useButtonEffect('ChannelUp', handleChannelUp);
  useButtonEffect('ChannelDown', handleChannelDown);
  useButtonEffect('ArrowUp', handleArrowUp);

  return (
    <>
      <Settings visible={isSettingsOpen} onClose={handleSettingsClose} player={playerRef} />
      {isControlsAvailable && (
        <>
          <div className="absolute flex items-center top-2 left-8 z-101">
            <BackButton className="mr-2" />
            <Text>{title}</Text>
          </div>

          <Button className="absolute text-yellow-600 z-101 bottom-8 right-20" icon="fullscreen" onClick={handleFullScreen} />

          <Button className="absolute text-blue-600 z-101 bottom-8 right-10" icon="settings" onClick={handleSettingsOpen} />

          {renderControls?.()}
        </>
      )}
      {isLoaded && startTime! > 0 && <StartFrom startTime={startTime} player={playerRef} />}

      <VideoPlayer
        {...props}
        //@ts-expect-error
        ref={playerRef}
        locale="ru"
        poster={fixProtocol(poster)}
        title={description}
        jumpBy={15}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onJumpForward={onJumpForward}
        onJumpBackward={onJumpBackward}
        onLoadedMetadata={handleLoadedMetadata}
        onControlsAvailable={handleControlsAvailable}
        streamingType={streamingType}
        isSettingsOpen={isSettingsOpen}
        isControlsAvailable={isControlsAvailable}
        audioTracks={audios}
        sourceTracks={sources}
        subtitleTracks={subtitles}
        videoComponent={<Media />}
      />
    </>
  );
};

export default Player;
