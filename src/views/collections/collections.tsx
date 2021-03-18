import React, { useCallback, useState } from 'react';
import map from 'lodash/map';

import Input from 'components/input';
import Link from 'components/link';
import Seo from 'components/seo';
import Text from 'components/text';
import CollectionsListInfinite from 'containers/collectionsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useParams from 'hooks/useParams';
import { PATHS, RouteParams, generatePath } from 'routes';

const COLLECTION_TYPES = {
  created: 'Новые',
  watchers: 'Популярные',
  views: 'Просмотры',
} as const;

type CollectionsType = keyof typeof COLLECTION_TYPES;

const getGenreByType = (collectionType?: CollectionsType) => {
  return (collectionType ? COLLECTION_TYPES[collectionType] : collectionType) || '';
};

const CollectionsView: React.FC = () => {
  const { collectionType = 'created' } = useParams<RouteParams & { collectionType: CollectionsType }>();
  const [query, setQuery] = useState('');
  const queryResult = useApiInfinite('collections', [query, `${collectionType}-`]);
  const title = getGenreByType(collectionType);

  const handleQueryChange = useCallback(
    (value) => {
      setQuery(value);
    },
    [setQuery],
  );

  return (
    <>
      <Seo title={`Подборки: ${title}`} />
      <CollectionsListInfinite
        title={
          <div className="w-full">
            <div className="flex flex-col-reverse w-full lg:items-center lg:flex-row lg:justify-between">
              <Text>{title}</Text>

              <div className="flex self-end">
                {map(COLLECTION_TYPES, (collectionTypeName, collectionTypeKey) => (
                  <Link
                    key={collectionTypeKey}
                    className="lg:mr-2"
                    replace
                    active={collectionType === collectionTypeKey}
                    href={generatePath(PATHS.Collections, { collectionType: collectionTypeKey })}
                  >
                    {collectionTypeName}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mr-2">
              <Input placeholder="Название подборки..." value={query} onChange={handleQueryChange} />
            </div>
          </div>
        }
        queryResult={queryResult}
      />
    </>
  );
};

export default CollectionsView;
