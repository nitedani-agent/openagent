import { afterEach, expect, test, vi } from 'vitest'
import { useState } from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'

vi.mock('../rpc/projects.js', () => ({ sendRemoveProject: vi.fn(async () => ({ ok: true })) }))
const { ProjectRemovedReport, RemoveProjectDialog } = await import('./RemoveProjectDialog.js')

afterEach(cleanup)

test("it opens on Cancel, not on the box that also deletes OpenAgent's files", async () => {
  render(<RemoveProjectDialog projectId="p1" open onOpenChange={vi.fn()} onRemoved={vi.fn()} />)
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' })))
  expect(screen.getByRole('checkbox').getAttribute('aria-checked')).toBe('false')
})

test('the page leaves the project as soon as it is removed, and "Project removed" stays over the page it moved on to until Done', async () => {
  function Shell() {
    const [onProject, setOnProject] = useState(true)
    return (
      <ProjectRemovedReport>
        {onProject ? <RemoveProjectDialog projectId="p1" open onOpenChange={vi.fn()} onRemoved={() => setOnProject(false)} /> : <p>the Overview</p>}
      </ProjectRemovedReport>
    )
  }
  render(<Shell />)
  fireEvent.click(await screen.findByRole('button', { name: 'Remove' }))
  await waitFor(() => expect(screen.getByText('the Overview')).toBeTruthy())
  expect(screen.getByRole('alertdialog').textContent).toMatch(/Project removed/)
  fireEvent.click(screen.getByRole('button', { name: 'Done' }))
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
})

test('Done puts the keyboard on the project picker, where the next project is picked', async () => {
  function Shell() {
    const [open, setOpen] = useState(true)
    return (
      <ProjectRemovedReport>
        <button type="button" data-project-picker>
          Project: All projects
        </button>
        <RemoveProjectDialog projectId="p1" open={open} onOpenChange={setOpen} onRemoved={vi.fn()} />
      </ProjectRemovedReport>
    )
  }
  render(<Shell />)
  fireEvent.click(await screen.findByRole('button', { name: 'Remove' }))
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Done' })))
  fireEvent.click(screen.getByRole('button', { name: 'Done' }))
  await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Project: All projects' })))
})
