import {
  createLoader,
  createSearchParamsCache,
  parseAsInteger,
} from 'nuqs/server'

export const roomsSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

export const roomsLoader = createLoader(roomsSearchParams)
export const roomsSearchParamsCache = createSearchParamsCache(roomsSearchParams)
