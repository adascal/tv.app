import React from 'react';

import Seo from 'components/seo';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useLocationState from 'hooks/useLocationState';
import useParams from 'hooks/useParams';
import { RouteParams } from 'routes';

const BookmarkView: React.FC = () => {
  const { bookmarkId } = useParams<RouteParams>();
  const queryResult = useApiInfinite('bookmarkItems', [bookmarkId!]);
  const { title = queryResult?.data?.pages?.[0]?.folder?.title } = useLocationState<{ title?: string }>();

  return (
    <>
      <Seo title={`Закладка: ${title}`} />
      <ItemsListInfinite title={title} queryResult={queryResult} />
    </>
  );
};

export default BookmarkView;
