import React from 'react';
import map from 'lodash/map';

import { Bookmark } from 'api';
import BookmarkItem from 'components/bookmarkItem';
import Scrollable from 'components/scrollable';
import Title from 'components/title';

type Props = {
  title?: string;
  bookmarks?: Bookmark[];
  loading?: boolean;
  onScrollToEnd?: () => void;
  scrollable?: boolean;
  horizontal?: boolean;
  skeletonsCount?: number;
  className?: string;
  titleClassName?: string;
};

const BookmarksList: React.FC<Props> = ({
  title,
  bookmarks,
  loading,
  onScrollToEnd,
  scrollable = true,
  horizontal = false,
  skeletonsCount = 20,
  className,
  titleClassName,
}) => {
  const content = (
    <>
      {map(bookmarks, (bookmark) => (
        <BookmarkItem key={bookmark.id} bookmark={bookmark} />
      ))}
      {loading && map([...new Array(skeletonsCount)], (_, idx) => <BookmarkItem key={idx} />)}
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

export default BookmarksList;
