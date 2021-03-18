import React, { useMemo } from 'react';
import capitalize from 'lodash/capitalize';
import map from 'lodash/map';
import sumBy from 'lodash/sumBy';

import { Bool } from 'api';
import ItemsList from 'components/itemsList';
import Link from 'components/link';
import Seo from 'components/seo';
import Text from 'components/text';
import useApi from 'hooks/useApi';
import useParams from 'hooks/useParams';
import { PATHS, RouteParams, generatePath } from 'routes';

const WATCHING_TYPES_MAP = {
  serials: 'Сериалы',
  movies: 'Фильмы',
} as const;

type WatchingTypes = keyof typeof WATCHING_TYPES_MAP;

const WatchingView: React.FC = () => {
  const { watchingType = 'serials' } = useParams<RouteParams & { watchingType: WatchingTypes }>();
  const { data, isLoading } = useApi(`watching${capitalize(watchingType) as Capitalize<WatchingTypes>}`, [Bool.True]);
  const total = useMemo(() => sumBy(data?.items, (item) => +(item.new || 0)), [data?.items]);
  const seoTitle = watchingType === 'serials' ? 'Новые эпизоды' : 'Недосмотренные фильмы';
  const title = total ? `${seoTitle} (${total})` : seoTitle;

  return (
    <>
      <Seo title={seoTitle} />
      <ItemsList
        title={
          <div className="flex flex-col-reverse w-full lg:items-center lg:flex-row lg:justify-between">
            <Text>{title}</Text>

            <div className="flex self-end">
              {map(WATCHING_TYPES_MAP, (watchingTypeName, watchingTypeKey) => (
                <Link
                  key={watchingTypeKey}
                  className="lg:mr-2"
                  replace
                  active={watchingType === watchingTypeKey}
                  href={generatePath(PATHS.Watching, { watchingType: watchingTypeKey })}
                >
                  {watchingTypeName}
                </Link>
              ))}
            </div>
          </div>
        }
        items={data?.items}
        loading={isLoading}
      />
    </>
  );
};

export default WatchingView;
