import { useMemo } from 'react';

import { ItemDetails, Video } from 'api';

import { getItemNextVideo } from 'utils/item';

function useNextVideo(item: ItemDetails, video: Video) {
  return useMemo(() => getItemNextVideo(item, video), [item, video]);
}

export default useNextVideo;
