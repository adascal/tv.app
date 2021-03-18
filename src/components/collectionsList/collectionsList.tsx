import React from 'react';
import map from 'lodash/map';

import { Collection } from 'api';
import CollectionItem from 'components/collectionItem';
import Scrollable from 'components/scrollable';
import Title from 'components/title';

type Props = {
  title?: React.ReactNode;
  collections?: Collection[];
  loading?: boolean;
  onScrollToEnd?: () => void;
  scrollable?: boolean;
  horizontal?: boolean;
  skeletonsCount?: number;
  className?: string;
  titleClassName?: string;
};

const CollectionsList: React.FC<Props> = ({
  title,
  collections,
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
      {map(collections, (collection) => (
        <CollectionItem key={collection.id} collection={collection} />
      ))}
      {loading && map([...new Array(skeletonsCount)], (_, idx) => <CollectionItem key={idx} />)}
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

export default CollectionsList;
