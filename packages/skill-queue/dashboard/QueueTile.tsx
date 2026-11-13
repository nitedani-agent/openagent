import { StatTile, useModuleHost, type ModuleCardProps } from '@openagt/dashboard/module'
import { entryView } from './entry.js'
import { useQueueReads } from './reads.js'

/**
 * The Overview's tile for the queue: how many entries wait their turn, over how many projects; it
 * opens the Queue page. An entry done already (a plan already written) waits for nothing. Drawn by
 * the shell only where a project has this package, so an Overview with no queue has no such tile.
 */
export function QueueTile({ projects }: ModuleCardProps) {
  const host = useModuleHost()
  const { reads, loaded, names } = useQueueReads(projects)
  const waiting = reads.map(read => read.entries.filter(entry => !entryView(read.project.id, entry, names).done))
  const queued = waiting.reduce((sum, entries) => sum + entries.length, 0)
  const over = waiting.filter(entries => entries.length > 0).length
  return (
    <StatTile
      label="In the queue"
      value={loaded ? queued : undefined}
      note={!loaded ? 'Loading…' : queued === 0 ? 'Nothing waits its turn' : over > 1 ? `Across ${over} projects` : 'Waits for an agent'}
      href={host.pageHref('queue')}
      onClick={() => host.openPage('queue')}
    />
  )
}
