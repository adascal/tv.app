import 'styles/global.css';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';

import Router from 'components/router';
import View from 'components/view';
import Loader from 'containers/loader';
import { PATHS } from 'routes';

const BookmarkView = React.lazy(() => import('views/booksmark'));
const BookmarksView = React.lazy(() => import('views/booksmarks'));
const CategoryView = React.lazy(() => import('views/category'));
const GenreView = React.lazy(() => import('views/genre'));
const ChannelView = React.lazy(() => import('views/channel'));
const ChannelsView = React.lazy(() => import('views/channels'));
const PlaylistView = React.lazy(() => import('views/playlist'));
const CollectionView = React.lazy(() => import('views/collection'));
const CollectionsView = React.lazy(() => import('views/collections'));
const HistoryView = React.lazy(() => import('views/history'));
const HomeView = React.lazy(() => import('views/home'));
const IndexView = React.lazy(() => import('views/index'));
const ItemView = React.lazy(() => import('views/item'));
const NotFoundView = React.lazy(() => import('views/notFound'));
const PairView = React.lazy(() => import('views/pair'));
const SearchView = React.lazy(() => import('views/search'));
const SettingsView = React.lazy(() => import('views/settings'));
const HelpView = React.lazy(() => import('views/help'));
const SpeedView = React.lazy(() => import('views/speed'));
const TrailerView = React.lazy(() => import('views/trailer'));
const VideoView = React.lazy(() => import('views/video'));
const WatchingView = React.lazy(() => import('views/watching'));
const ReleasesView = React.lazy(() => import('views/releases'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App: React.FC = () => (
  <Router>
    <QueryClientProvider client={queryClient}>
      <Loader>
        <Routes>
          <Route path={PATHS.Index} element={<View component={IndexView} layout="fill" />} />
          <Route path={PATHS.Home} element={<View component={HomeView} />} />
          <Route path={PATHS.Search} element={<View component={SearchView} />} />
          <Route path={PATHS.Category} element={<View component={CategoryView} />} />
          <Route path={PATHS.Genre} element={<View component={GenreView} />} />
          <Route path={PATHS.Watching} element={<View component={WatchingView} />} />
          <Route path={PATHS.Releases} element={<View component={ReleasesView} />} />
          <Route path={PATHS.Bookmark} element={<View component={BookmarkView} />} />
          <Route path={PATHS.Bookmarks} element={<View component={BookmarksView} />} />
          <Route path={PATHS.Collection} element={<View component={CollectionView} />} />
          <Route path={PATHS.Collections} element={<View component={CollectionsView} />} />
          <Route path={PATHS.Channel} element={<View component={ChannelView} layout="fill" />} />
          <Route path={PATHS.Channels} element={<View component={ChannelsView} />} />
          <Route path={PATHS.Playlist} element={<View component={PlaylistView} />} />
          <Route path={PATHS.History} element={<View component={HistoryView} />} />
          <Route path={PATHS.Item} element={<View component={ItemView} layout="fill" />} />
          <Route path={PATHS.Video} element={<View component={VideoView} layout="fill" />} />
          <Route path={PATHS.Trailer} element={<View component={TrailerView} layout="fill" />} />
          <Route path={PATHS.Pair} element={<View component={PairView} layout="fill" />} />
          <Route path={PATHS.Help} element={<View component={HelpView} />} />
          <Route path={PATHS.Speed} element={<View component={SpeedView} />} />
          <Route path={PATHS.Settings} element={<View component={SettingsView} />} />
          <Route path="*" element={<View component={NotFoundView} />} />
        </Routes>
      </Loader>
    </QueryClientProvider>
  </Router>
);

export default MoonstoneDecorator(App);
