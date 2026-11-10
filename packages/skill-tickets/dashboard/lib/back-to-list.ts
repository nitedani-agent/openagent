import { useEffect, useRef } from 'react'
import type { ModuleHost } from '@openagt/dashboard/module'

// A ticket's page picks its project, so the list it was opened from (every project's) is reached by the browser's Back; one reached another way goes to its project's list.

/** The ticket page the list opened last, by its path under the page (`[file]` or `[file, 'plan']`), until that page has read it. */
let opened: string | null = null

/** The list opens the ticket page at `path`. */
export function openFromList(path: string[]): void {
  opened = path.join('/')
}

/** The way back to the list from the ticket page at `path`. */
export function useBackToList(host: ModuleHost, path: string[]): () => void {
  const key = path.join('/')
  const from = useRef<{ key: string; list: boolean } | null>(null)
  if (from.current?.key !== key) from.current = { key, list: opened === key }
  useEffect(() => {
    if (opened === key) opened = null
  }, [key])
  return () => (from.current?.list ? window.history.back() : host.openPage('tickets'))
}
