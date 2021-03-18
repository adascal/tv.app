import { useMemo } from 'react';

import { ItemDetails, Video } from 'api';

import { getItemPrevNextVideos } from 'utils/item';

function usePrevNextVideos(item: ItemDetails, video: Video) {
  return useMemo(() => getItemPrevNextVideos(item, video), [item, video]);
}

export default usePrevNextVideos;
