import { useMemo } from 'react';

import { getDeviceInfo } from 'utils/device';

function useDeviceInfo() {
  return useMemo(() => getDeviceInfo(), []);
}

export default useDeviceInfo;
