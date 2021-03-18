import React from 'react';
import map from 'lodash/map';

import { Item } from 'api';
import Scrollable from 'components/scrollable';
import Title from 'components/title';
import VideoItem from 'components/videoItem';

type Props = {
  title?: React.ReactNode;
  items?: Item[];
  loading?: boolean;
  onScrollToEnd?: () => void;
  scrollable?: boolean;
  horizontal?: boolean;
  skeletonsCount?: number;
  className?: string;
  titleClassName?: string;
};

const ItemsList: React.FC<Props> = ({
  title,
  items,
  loading,
  onScrollToEnd,
  scrollable = true,
  horizontal = false,
  skeletonsCount = 15,
  className,
  titleClassName,
}) => {
  const content = (
    <>
      {map(items, (item) => (
        <VideoItem key={item.id} item={item} />
      ))}
      {loading && map([...new Array(skeletonsCount)], (_, idx) => <VideoItem key={idx} />)}
    </>
  );

  return (
    <>
      <Title className={titleClassName}>{title}</Title>
      {scrollable ? (
        <Scrollable onScrollToEnd={onScrollToEnd} horizontal={horizontal} className={className}>
          {content}
        </Scrollable>
      ) : (
        content
      )}
    </>
  );
};

export default ItemsList;
