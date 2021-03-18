import React from 'react';

import ItemsList from 'components/itemsList';
import Seo from 'components/seo';
import useApi from 'hooks/useApi';
import useLocationState from 'hooks/useLocationState';
import useParams from 'hooks/useParams';
import { RouteParams } from 'routes';

const CollectionView: React.FC = () => {
  const { collectionId } = useParams<RouteParams>();
  const { data, isLoading } = useApi('collectionItems', [collectionId!]);
  const { title = data?.collection?.title } = useLocationState<{ title?: string }>();

  return (
    <>
      <Seo title={`Подборка: ${title}`} />
      <ItemsList title={title} items={data?.items} loading={isLoading} />
    </>
  );
};

export default CollectionView;
