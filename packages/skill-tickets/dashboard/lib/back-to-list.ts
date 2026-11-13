import { useEffect } from 'react'
import type { ModuleHost } from '@openagt/dashboard/module'

// A ticket's page picks its project, so the list it was opened from (every project's) is reached by the browser's Back; one reached another way goes to its project's list.

/** The ticket page opened last from the list or from a tab, by its path under the page (`[file]` or `[file, 'plan']`), and how many entries back the list is from it, until that page has read it. */
let opened: { path: string; back: number } | null = null

/** Marks a page's history entry as opened from the list, with how many entries back the list is: the entry keeps it across Back, Forward and a reload. */
const FROM_LIST = 'skill-tickets:from-list'

/** The list opens the ticket page at `path`. */
export function openFromList(path: string[]): void {
  opened = { path: path.join('/'), back: 1 }
}

/** A ticket's page opens its other one at `path` (its other tab; the ticket's, from its plan): one opened from the list keeps the way back to it, one entry further. */
export function openTab(host: ModuleHost, projectId: string, path: string[]): void {
  const back: unknown = window.history.state?.[FROM_LIST]
  if (typeof back === 'number') opened = { path: path.join('/'), back: back + 1 }
  host.openPage('tickets', path, projectId)
}

/** The way back to the list from the ticket page at `path`. */
export function useBackToList(host: ModuleHost, path: string[]): () => void {
  const key = path.join('/')
  useEffect(() => {
    if (opened?.path !== key) return
    const { back } = opened
    opened = null
    window.history.replaceState({ ...window.history.state, [FROM_LIST]: back }, '')
  }, [key])
  return () => {
    const back: unknown = window.history.state?.[FROM_LIST]
    if (typeof back === 'number') window.history.go(-back)
    else host.openPage('tickets')
  }
}
