import { useMemo } from 'react';
import capitalize from 'lodash/capitalize';
import map from 'lodash/map';

import Link from 'components/link';
import Seo from 'components/seo';
import Text from 'components/text';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useParams from 'hooks/useParams';
import { PATHS, RouteParams, generatePath } from 'routes';

const RELEASE_TYPES_MAP = {
  popular: 'Популярные',
  fresh: 'Свежие',
  hot: 'Горячие',
} as const;

type ReleaseTypes = keyof typeof RELEASE_TYPES_MAP;

const getReleaseByType = (releaseType?: ReleaseTypes) => {
  return releaseType ? RELEASE_TYPES_MAP[releaseType] : RELEASE_TYPES_MAP.fresh;
};

const ReleasesView: React.FC = () => {
  const { releaseType = 'popular' } = useParams<RouteParams & { releaseType: ReleaseTypes }>();
  const queryResult = useApiInfinite(`items${capitalize(releaseType) as Capitalize<ReleaseTypes>}`, ['1']);
  const total = useMemo(() => queryResult.data?.pages?.[0]?.pagination?.total_items, [queryResult.data?.pages]);
  const seoTitle = getReleaseByType(releaseType);
  const title = total ? `${seoTitle} (${total})` : seoTitle;

  return (
    <>
      <Seo title={seoTitle} />
      <ItemsListInfinite
        title={
          <div className="flex flex-col-reverse w-full lg:items-center lg:flex-row lg:justify-between">
            <Text>{title}</Text>

            <div className="flex self-end">
              {map(RELEASE_TYPES_MAP, (releaseName, releaseKey) => (
                <Link
                  key={releaseKey}
                  className="lg:mr-2"
                  replace
                  active={releaseType === releaseKey}
                  href={generatePath(PATHS.Releases, { releaseType: releaseKey })}
                >
                  {releaseName}
                </Link>
              ))}
            </div>
          </div>
        }
        queryResult={queryResult}
      />
    </>
  );
};

export default ReleasesView;
