import { ItemType, ItemsParams } from 'api';
import Seo from 'components/seo';
import Text from 'components/text';
import FilterItems from 'containers/filterItems';
import ItemsListInfinite from 'containers/itemsListInfinite';
import useApiInfinite from 'hooks/useApiInfinite';
import useLocationState from 'hooks/useLocationState';
import useParams from 'hooks/useParams';
import useSearchParams from 'hooks/useSearchParams';
import useSessionState from 'hooks/useSessionState';
import { RouteParams } from 'routes';

const CATEGORY_TYPES: Record<ItemType, string> = {
  movie: 'Фильмы',
  serial: 'Сериалы',
  concert: 'Концерты',
  documovie: 'Документальные фильмы',
  docuserial: 'Документальные сериалы',
  tvshow: 'ТВ Шоу',
};

const getCategoryByType = (categoryType?: ItemType) => {
  return (categoryType ? CATEGORY_TYPES[categoryType] : categoryType) || '';
};

const CategoryView: React.FC = () => {
  const searchParams = useSearchParams();
  const { categoryType } = useParams<RouteParams & { categoryType: ItemType }>();
  const { params, title = getCategoryByType(categoryType) } = useLocationState<{ params?: ItemsParams; title?: string }>();
  const [filterParams, setFilterParams] = useSessionState<ItemsParams | null>(`${categoryType}:filter:params`, null);

  const queryResult = useApiInfinite('items', [
    {
      ...searchParams,
      ...params,
      ...filterParams,
      type: categoryType,
    },
  ]);

  return (
    <>
      <Seo title={title} />
      <ItemsListInfinite
        title={
          <>
            <Text>{title}</Text>
            <FilterItems type={categoryType} storageKey={categoryType} onFilter={setFilterParams} />
          </>
        }
        queryResult={queryResult}
      />
    </>
  );
};

export default CategoryView;
