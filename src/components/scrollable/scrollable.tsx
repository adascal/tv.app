import { createContext, useMemo, useRef } from 'react';
import cx from 'classnames';

import Spottable from 'components/spottable';
import useInViewport from 'hooks/useInViewport';
import useUniqueId from 'hooks/useUniqueId';

export const ScrollableContext = createContext<{ id?: string }>({});

type Props = {
  onScrollToEnd?: () => void;
  className?: string;
  horizontal?: boolean;
  noWrap?: boolean;
  omitDumpElement?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Scrollable: React.FC<Props> = ({ children, className, onScrollToEnd, horizontal, noWrap, omitDumpElement, ...props }) => {
  const footerRef = useRef<HTMLDivElement>(null);
  const id = useUniqueId('scrollable');
  const value = useMemo(
    () => ({
      id,
    }),
    [id],
  );

  useInViewport(footerRef, { onEnterViewport: onScrollToEnd });

  return (
    <div
      {...props}
      id={id}
      className={cx(
        'flex',
        {
          'flex-wrap': !horizontal && !noWrap,
          'h-auto overflow-x-hidden overflow-y-auto': !horizontal,
          'w-full overflow-y-hidden overflow-x-auto': horizontal,
        },
        className,
      )}
    >
      <ScrollableContext.Provider value={value}>{children}</ScrollableContext.Provider>
      {!omitDumpElement && (
        <div className={cx('flex-shrink-0', { 'h-40 w-full': !horizontal, 'w-40 h-full': horizontal })} ref={footerRef} />
      )}
      <Spottable />
    </div>
  );
};

export default Scrollable;
