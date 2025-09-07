import {
  createLoader,
  createSearchParamsCache,
  parseAsInteger,
} from 'nuqs/server'

export const subjectsSearchParams = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

export const subjectsLoader = createLoader(subjectsSearchParams)
export const subjectsSearchParamsCache =
  createSearchParamsCache(subjectsSearchParams)
