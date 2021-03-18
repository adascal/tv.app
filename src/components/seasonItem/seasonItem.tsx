import React, { useCallback } from 'react';
import map from 'lodash/map';

import { Item, Season, Video, WatchingStatus } from 'api';
import Accordion from 'components/accordion';
import Button from 'components/button';
import ImageItem from 'components/imageItem';
import useNavigateToVideo from 'hooks/useNavigateToVideo';

type Props = {
  item: Item;
  season: Season;
  replaceNavigation?: boolean;
  onEpisodeFocus?: (episode: Video) => void;
  onEpisodeBlur?: (episode: Video) => void;
  onEpisodeWatchToggle?: (episode: Video) => void;
  onSeasonWatchToggle?: (season: Season) => void;
};

const SeasonItem: React.FC<Props> = ({
  item,
  season,
  replaceNavigation,
  onEpisodeFocus,
  onEpisodeBlur,
  onEpisodeWatchToggle,
  onSeasonWatchToggle,
}) => {
  const navigateToVideo = useNavigateToVideo();
  const handleEpisodeClick = useCallback(
    (episode: Video) => () => {
      navigateToVideo(item, episode, replaceNavigation);
    },
    [item, replaceNavigation, navigateToVideo],
  );
  const handleEpisodeFocus = useCallback(
    (episode: Video) => () => {
      onEpisodeFocus?.(episode);
    },
    [onEpisodeFocus],
  );
  const handleEpisodeBlur = useCallback(
    (episode: Video) => () => {
      onEpisodeBlur?.(episode);
    },
    [onEpisodeBlur],
  );
  const handleEpisodeWatchToggle = useCallback(
    (episode: Video) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onEpisodeWatchToggle?.(episode);
    },
    [onEpisodeWatchToggle],
  );
  const handleSeasonWatchToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSeasonWatchToggle?.(season);
    },
    [season, onSeasonWatchToggle],
  );

  return (
    <div className="flex flex-col">
      <Accordion
        title={
          <div className="flex items-center -ml-2">
            <Button
              icon={season.watching.status === WatchingStatus.Watched ? 'visibility_off' : 'visibility'}
              className="text-yellow-600"
              onClick={handleSeasonWatchToggle}
              spotlightDisabled
            />

            {season.title ? `${season.number}. ${season.title}` : `Сезон ${season.number}`}
          </div>
        }
      >
        <div className="flex flex-wrap">
          {map(season.episodes, (episode) => (
            <ImageItem
              key={episode.id}
              source={episode.thumbnail}
              caption={episode.title ? `${episode.number}. ${episode.title}` : `Эпизод ${episode.number}`}
              onClick={handleEpisodeClick(episode)}
              onFocus={handleEpisodeFocus(episode)}
              onBlur={handleEpisodeBlur(episode)}
            >
              <Button
                icon={episode.watching.status === WatchingStatus.Watched ? 'visibility_off' : 'visibility'}
                className="absolute top-0 right-0 z-10 text-blue-600"
                onClick={handleEpisodeWatchToggle(episode)}
                spotlightDisabled
              />
              {episode.watching.status === WatchingStatus.Watched && (
                <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black rounded-xl bg-opacity-70">
                  Просмотрено
                </div>
              )}
            </ImageItem>
          ))}
        </div>
      </Accordion>
    </div>
  );
};

export default SeasonItem;
