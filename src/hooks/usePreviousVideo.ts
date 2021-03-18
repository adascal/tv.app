import { useMemo } from 'react';

import { ItemDetails, Video } from 'api';

import { getItemPreviousVideo } from 'utils/item';

function usePreviousVideo(item: ItemDetails, video: Video) {
  return useMemo(() => getItemPreviousVideo(item, video), [item, video]);
}

export default usePreviousVideo;
