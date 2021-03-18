import { useCallback } from 'react';
import SpottableWrapper from '@enact/spotlight/Spottable';
import Item from '@enact/ui/Item';

import useThrottledCallback from 'hooks/useThrottledCallback';

const SpottableItem = SpottableWrapper(Item);

type Props = {} & React.ComponentProps<typeof SpottableItem>;

const Spottable: React.FC<Props> = ({ onClick, ...props }) => {
  const handleClick = useCallback<React.MouseEventHandler<HTMLElement>>(
    (e) => {
      onClick?.(e);
    },
    [onClick],
  );

  const throttledClick = useThrottledCallback(handleClick);

  return <SpottableItem {...props} onClick={throttledClick} />;
};

export default Spottable;
