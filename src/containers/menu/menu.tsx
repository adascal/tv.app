import cx from 'classnames';
import map from 'lodash/map';

import Link from 'components/link';
import useLocation from 'hooks/useLocation';
import { PATHS, generatePath } from 'routes';

type MenuItem = {
  name: string;
  icon: string;
  href: string;
};

const menuItems: (MenuItem | null)[][] = [
  [
    {
      name: 'Главная',
      icon: 'home',
      href: PATHS.Home,
    },
    {
      name: 'Поиск',
      icon: 'search',
      href: PATHS.Search,
    },
    {
      name: 'Я смотрю',
      icon: 'notifications_active',
      href: generatePath(PATHS.Watching, { watchingType: 'serials' }),
    },
    {
      name: 'Закладки',
      icon: 'bookmark',
      href: PATHS.Bookmarks,
    },
    {
      name: 'История',
      icon: 'history',
      href: PATHS.History,
    },
    {
      name: 'Подборки',
      icon: 'list',
      href: generatePath(PATHS.Collections, { collectionType: 'created' }),
    },
  ].filter(Boolean),
  [
    {
      name: 'Новинки',
      icon: 'new_releases',
      href: generatePath(PATHS.Releases, { releaseType: 'popular' }),
    },
    {
      name: 'Фильмы',
      icon: 'movie',
      href: generatePath(PATHS.Category, { categoryType: 'movie' }),
    },
    {
      name: 'Сериалы',
      icon: 'tv',
      href: generatePath(PATHS.Category, { categoryType: 'serial' }),
    },
    {
      name: 'Мультфильмы',
      icon: 'toys',
      href: generatePath(PATHS.Genre, { genreType: '23' }),
    },
    {
      name: 'Аниме',
      icon: 'auto_awesome',
      href: generatePath(PATHS.Genre, { genreType: '25' }),
    },
    {
      name: 'Концерты',
      icon: 'library_music',
      href: generatePath(PATHS.Category, { categoryType: 'concert' }),
    },
    {
      name: 'Докуфильмы',
      icon: 'archive',
      href: generatePath(PATHS.Category, { categoryType: 'documovie' }),
    },
    {
      name: 'Докусериалы',
      icon: 'description',
      href: generatePath(PATHS.Category, { categoryType: 'docuserial' }),
    },
    {
      name: 'ТВ Шоу',
      icon: 'live_tv',
      href: generatePath(PATHS.Category, { categoryType: 'tvshow' }),
    },
    {
      name: 'Каналы',
      icon: 'connected_tv',
      href: generatePath(PATHS.Channels),
    },
  ].filter(Boolean),
  [
    process.env.REACT_APP_HIDE_HELP_MENU !== 'true'
      ? {
          name: 'Помощь',
          icon: 'contact_support',
          href: PATHS.Help,
        }
      : null,
    {
      name: 'Спидтест',
      icon: 'speed',
      href: PATHS.Speed,
    },
    {
      name: 'Настройки',
      icon: 'settings',
      href: PATHS.Settings,
    },
  ].filter(Boolean),
];

type Props = {
  className?: string;
};

const Menu: React.FC<Props> = ({ className, ...props }) => {
  const location = useLocation();

  return (
    <nav
      className={cx(
        'h-screen min-w-9 w-9 xl:w-46 xl:min-w-46 flex flex-col justify-between overflow-x-hidden overflow-y-auto mr-2',
        className,
      )}
      {...props}
    >
      {map(menuItems, (list, idx) => (
        <ul key={idx} className="last:pb-8 xl:last:pb-0">
          {map(list, (item: MenuItem) => (
            <li key={item.href}>
              <Link href={item.href} icon={item.icon} active={location.pathname.startsWith(item.href)}>
                <span className="hidden xl:inline">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
};

export default Menu;
