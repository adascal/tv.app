import { useCallback } from 'react';

import { ItemDetails, Video } from 'api';
import useNavigate from 'hooks/useNavigate';
import { PATHS, generatePath } from 'routes';

import { getItemVideoToPlay } from 'utils/item';

type SeasonAndEpisode = {
  seasonId?: string | number;
  episodeId?: string | number;
};

function useNavigateToVideo() {
  const navigate = useNavigate();

  const navigateToVideo = useCallback(
    (item?: ItemDetails, video?: Video | SeasonAndEpisode, replace?: boolean) => {
      if (item) {
        const videoToNavigate = (video as Video)?.id
          ? (video as Video)
          : getItemVideoToPlay(item, (video as SeasonAndEpisode).episodeId, (video as SeasonAndEpisode).seasonId);

        const seasonId = videoToNavigate.snumber;
        const episodeId = videoToNavigate.number;

        navigate(
          generatePath(
            PATHS.Video,
            {
              itemId: item.id,
            },
            {
              ...(seasonId ? { seasonId: `${seasonId}` } : {}),
              ...(episodeId ? { episodeId: `${episodeId}` } : {}),
            },
          ),
          {
            replace,
            state: {
              item: item,
            },
          },
        );
      }
    },
    [navigate],
  );

  return navigateToVideo;
}

export default useNavigateToVideo;
