import { useCallback, useMemo } from 'react';
import cx from 'classnames';

import { Collection } from 'api';
import Icon from 'components/icon';
import ImageItem from 'components/imageItem';
import useNavigate from 'hooks/useNavigate';
import { PATHS, generatePath } from 'routes';

import { numberToHuman } from 'utils/number';

type Props = {
  collection?: Collection;
  className?: string;
};

const CollectionItem: React.FC<Props> = ({ collection, className }) => {
  const navigate = useNavigate();
  const views = useMemo(() => (collection?.views && numberToHuman(collection?.views)) || '', [collection?.views]);
  const handleOnClick = useCallback(() => {
    if (collection?.id) {
      navigate(
        generatePath(PATHS.Collection, {
          collectionId: collection.id,
        }),
        {
          state: {
            collection,
            title: collection.title,
          },
        },
      );
    }
  }, [collection, navigate]);

  return (
    <ImageItem onClick={handleOnClick} source={collection?.posters.medium} caption={collection?.title} className={cx('h-72', className)}>
      {views && (
        <div className="absolute flex items-center h-6 pr-2 text-xs text-gray-200 bg-black bg-opacity-50 rounded top-2 right-2">
          <Icon name="visibility" />
          {views}
        </div>
      )}
    </ImageItem>
  );
};

export default CollectionItem;
