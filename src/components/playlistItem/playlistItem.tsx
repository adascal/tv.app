import { useCallback } from 'react';

import { Playlist } from 'api';
import ImageItem from 'components/imageItem';
import useNavigate from 'hooks/useNavigate';
import { PATHS, generatePath } from 'routes';

type Props = {
  playlist?: Playlist;
  className?: string;
};

const PlaylistItem: React.FC<Props> = ({ playlist, className }) => {
  const navigate = useNavigate();
  const handleOnClick = useCallback(() => {
    if (playlist?.id) {
      navigate(
        generatePath(PATHS.Playlist, {
          playlistId: playlist.id,
        }),
        {
          state: {
            playlist,
            title: playlist.title,
          },
        },
      );
    }
  }, [playlist, navigate]);

  return <ImageItem onClick={handleOnClick} caption={playlist?.title} className={className} />;
};

export default PlaylistItem;
