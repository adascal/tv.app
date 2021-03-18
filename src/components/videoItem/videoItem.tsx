import { useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import trim from 'lodash/trim';

import { Bool, Item, ItemMediaResponse } from 'api';
import Icon from 'components/icon';
import ImageItem from 'components/imageItem';
import useApiMutation from 'hooks/useApiMutation';
import useButtonEffect from 'hooks/useButtonEffect';
import useNavigate from 'hooks/useNavigate';
import useNavigateToVideo from 'hooks/useNavigateToVideo';
import { PATHS, generatePath } from 'routes';

import { ReactComponent as Imdb } from './assets/imdb.svg';
import { ReactComponent as Kinopoisk } from './assets/kinopoisk.svg';

import { getItemQualityIcon } from 'utils/item';
import { numberToHuman } from 'utils/number';

type Props = {
  item?: Item;
  className?: string;
  wrapperClassName?: string;
  showViews?: boolean;
  noCaption?: boolean;
  disableNavigation?: boolean;
  replaceNavigation?: boolean;
  episodeId?: string | number;
  seasonId?: string | number;
  playOnClick?: boolean;
};

const VideoItem: React.FC<Props> = ({
  item,
  className,
  wrapperClassName,
  showViews,
  noCaption,
  disableNavigation,
  replaceNavigation,
  episodeId,
  seasonId,
  playOnClick,
  children,
}) => {
  const navigate = useNavigate();
  const navigateToVideo = useNavigateToVideo();
  const [isFocused, setIsFocused] = useState(false);
  const qualityIcon = getItemQualityIcon(item);
  const title = useMemo(() => trim(item?.title?.split('/')[0]), [item?.title]);
  const views = useMemo(() => (showViews && item?.views && numberToHuman(item?.views)) || '', [showViews, item?.views]);
  const { itemMediaAsync } = useApiMutation('itemMedia');

  const handleOnPlayClick = useCallback(async () => {
    if (item?.id && !disableNavigation && isFocused) {
      const data = (await itemMediaAsync([item.id])) as unknown as ItemMediaResponse;

      navigateToVideo(data?.item, { seasonId, episodeId });
    }
  }, [item?.id, disableNavigation, episodeId, seasonId, isFocused, navigateToVideo, itemMediaAsync]);

  const handleOnClick = useCallback(() => {
    if (playOnClick) {
      handleOnPlayClick();
    } else if (item?.id && !disableNavigation) {
      navigate(
        generatePath(PATHS.Item, {
          itemId: item.id,
        }),
        {
          replace: replaceNavigation,
        },
      );
    }
  }, [item?.id, disableNavigation, replaceNavigation, playOnClick, handleOnPlayClick, navigate]);

  useButtonEffect(['Play', 'PlayPause', 'Red'], handleOnPlayClick);

  return (
    <ImageItem
      onClick={handleOnClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      source={item?.posters.medium}
      caption={noCaption ? '' : title}
      className={cx('h-72', className)}
      wrapperClassName={wrapperClassName}
    >
      {children}
      {item?.new && (
        <div className="absolute top-0 right-0 px-2 py-2 text-gray-200 bg-red-600 border-t-4 border-r-4 border-gray-700 rounded-bl rounded-tr-xl">
          {item?.new}
        </div>
      )}
      {views && (
        <div className="absolute flex items-center h-6 pr-2 text-xs text-gray-200 bg-black bg-opacity-50 rounded top-2 right-2">
          <Icon name="visibility" />
          {views}
        </div>
      )}
      {Boolean(seasonId && episodeId) && (
        <div className="absolute flex items-center h-6 px-2 text-xs text-gray-200 bg-black bg-opacity-50 rounded top-2 right-2">
          {`s${seasonId}e${episodeId}`}
        </div>
      )}
      {(qualityIcon || item?.ac3 || item?.advert) && (
        <div className="absolute flex items-center h-6 bg-black bg-opacity-50 rounded top-2 left-2">
          {qualityIcon && <Icon name={qualityIcon} />}
          {item?.ac3 === Bool.True && <Icon name="graphic_eq" />}
          {item?.advert && <Icon name="report" />}
        </div>
      )}
      {Boolean(item?.rating! > 0 || item?.imdb_rating! > 0 || item?.kinopoisk_rating! > 0) && (
        <div className="absolute flex items-center justify-between h-6 px-2 text-xs text-gray-200 bg-black bg-opacity-50 rounded bottom-2 left-2 right-2">
          <div className="flex items-center justify-start w-1/3">
            <Imdb className="w-3 h-3 mr-1" />
            <span>{(item?.imdb_rating || 0).toFixed(1)}</span>
          </div>

          <div className="flex items-center justify-center w-1/3">
            <Kinopoisk className="w-3 h-3 mr-1" />
            <span>{(item?.kinopoisk_rating || 0).toFixed(1)}</span>
          </div>

          <div className="flex items-center justify-end w-1/3">
            <Icon name="thumb_up" />
            <span>{item?.rating_percentage || 0}%</span>
          </div>
        </div>
      )}
    </ImageItem>
  );
};

export default VideoItem;
