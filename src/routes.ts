import { generatePath as baseGeneratePath } from 'react-router';

/* eslint-disable @typescript-eslint/no-unused-vars */
export type ExtractRouteParams<T> = string extends T
  ? Record<string, string>
  : T extends `${infer _}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
  : T extends `${infer _}:${infer Param}`
  ? { [k in Param]: string }
  : {};
/* eslint-enable @typescript-eslint/no-unused-vars */

export const PATHS = {
  Index: '/',
  Home: '/home',
  Search: '/search',
  Watching: '/watching/:watchingType',
  Releases: '/releases/:releaseType',
  Category: '/category/:categoryType',
  Genre: '/genres/:genreType',
  Channels: '/channels',
  Channel: '/channels/id:channelId',
  Playlist: '/playlists/id:playlistId',
  Bookmarks: '/bookmarks',
  Bookmark: '/bookmarks/id:bookmarkId',
  Collections: '/collections/:collectionType',
  Collection: '/collections/id:collectionId',
  History: '/history',
  Item: '/item/id:itemId',
  Video: '/video/id:itemId',
  Trailer: '/trailer/id:trailerId',
  Pair: '/pair',
  Help: '/help',
  Speed: '/speed',
  Settings: '/settings',
} as const;

export type RoutePath = typeof PATHS[keyof typeof PATHS];

export type RouteParams = {
  channelId?: string;
  collectionId?: string;
  bookmarkId?: string;
  itemId?: string;
  trailerId?: string;
  genreType?: string;
  releaseType?: string;
  categoryType?: string;
  watchingType?: string;
  collectionType?: string;
};

export type RouteParamsKeys = keyof RouteParams;

export function generatePath<S extends RoutePath>(
  pattern: S,
  params?: ExtractRouteParams<S> | null,
  search?: Record<string, string> | string,
) {
  const query = search ? `?${new URLSearchParams(search)}` : '';

  return baseGeneratePath(pattern, params ?? undefined) + query;
}
