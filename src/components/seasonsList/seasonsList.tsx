import { useCallback, useState } from 'react';
import map from 'lodash/map';

import { Item, Season, Video } from 'api';
import SeasonItem from 'components/seasonItem';
import Text from 'components/text';
import useButtonEffect from 'hooks/useButtonEffect';
import useNavigateToVideo from 'hooks/useNavigateToVideo';

type Props = {
  item: Item;
  seasons?: Season[];
  className?: string;
  replaceNavigation?: boolean;
  onSeasonWatchToggle?: (season: Season) => void;
  onEpisodeWatchToggle?: (episode: Video, season?: Season | null) => void;
};

const SeasonsList: React.FC<Props> = ({ item, seasons, className, replaceNavigation, onSeasonWatchToggle, onEpisodeWatchToggle }) => {
  const navigateToVideo = useNavigateToVideo();
  const [focusedSeason, setFocusedSeason] = useState<Season | null>(null);
  const [focusedEpisode, setFocusedEpisode] = useState<Video | null>(null);
  const handleEpisodeFocus = useCallback(
    (season: Season) => (episode: Video) => {
      setFocusedSeason(season);
      setFocusedEpisode(episode);
    },
    [],
  );
  const handleEpisodeBlur = useCallback(() => {
    setFocusedSeason(null);
    setFocusedEpisode(null);
  }, []);
  const handleEpisodeWatchToggle = useCallback(
    (episode: Video, season: Season | null = focusedSeason) => {
      onEpisodeWatchToggle?.(episode, season);
    },
    [focusedSeason, onEpisodeWatchToggle],
  );
  const handleSeasonWatchToggle = useCallback(
    (season: Season) => {
      onSeasonWatchToggle?.(season);
    },
    [onSeasonWatchToggle],
  );

  const handleYellowButton = useCallback(() => {
    if (focusedSeason) {
      handleSeasonWatchToggle(focusedSeason);

      return false;
    }
  }, [focusedSeason, handleSeasonWatchToggle]);
  const handleBlueButton = useCallback(() => {
    if (focusedEpisode) {
      handleEpisodeWatchToggle(focusedEpisode, focusedSeason);

      return false;
    }
  }, [focusedEpisode, focusedSeason, handleEpisodeWatchToggle]);
  const handlePlayButton = useCallback(() => {
    if (focusedEpisode) {
      navigateToVideo(item, focusedEpisode, replaceNavigation);

      return false;
    }
  }, [item, focusedEpisode, replaceNavigation, navigateToVideo]);

  useButtonEffect('Yellow', handleYellowButton);
  useButtonEffect('Blue', handleBlueButton);
  useButtonEffect('Play', handlePlayButton);

  if (!seasons?.length) {
    return null;
  }

  return (
    <div className={className}>
      <Text className="text-gray-500">Список сезонов</Text>

      {map(seasons, (season) => (
        <SeasonItem
          key={season.id}
          item={item}
          season={season}
          replaceNavigation={replaceNavigation}
          onEpisodeFocus={handleEpisodeFocus(season)}
          onEpisodeBlur={handleEpisodeBlur}
          onEpisodeWatchToggle={handleEpisodeWatchToggle}
          onSeasonWatchToggle={handleSeasonWatchToggle}
        />
      ))}
    </div>
  );
};

export default SeasonsList;
