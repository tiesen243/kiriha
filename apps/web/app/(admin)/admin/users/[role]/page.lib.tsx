import {
  createLoader,
  createSearchParamsCache,
  parseAsInteger,
} from 'nuqs/server'

export const usersSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

export const usersLoader = createLoader(usersSearchParams)
export const usersSearchParamsCache = createSearchParamsCache(usersSearchParams)
