import * as React from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const abortController = new AbortController()
    const mql = window.matchMedia(query)

    mql.addEventListener(
      'change',
      () => {
        if (abortController.signal.aborted) return
        setMatches(mql.matches)
      },
      { signal: abortController.signal },
    )
    return () => {
      abortController.abort()
    }
  }, [query])

  return !!matches
}
