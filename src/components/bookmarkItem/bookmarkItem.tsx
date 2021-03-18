import { useCallback } from 'react';

import { Bookmark } from 'api';
import ImageItem from 'components/imageItem';
import useNavigate from 'hooks/useNavigate';
import { PATHS, generatePath } from 'routes';

type Props = {
  bookmark?: Bookmark;
  className?: string;
};

const BookmarkItem: React.FC<Props> = ({ bookmark, className }) => {
  const navigate = useNavigate();
  const handleOnClick = useCallback(() => {
    if (bookmark?.id) {
      navigate(
        generatePath(PATHS.Bookmark, {
          bookmarkId: bookmark.id,
        }),
        {
          state: {
            bookmark,
            title: bookmark.title,
          },
        },
      );
    }
  }, [bookmark, navigate]);

  return (
    <ImageItem className={className} onClick={handleOnClick} caption={bookmark?.title} alt={bookmark ? `Фильмов ${bookmark.count}` : ''} />
  );
};

export default BookmarkItem;
