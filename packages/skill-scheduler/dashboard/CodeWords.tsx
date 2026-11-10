import { CopyButton } from '@openagt/dashboard/module'

/** A sentence of the `scheduler` command, its `backticked` words set as code: what a person types is shown as such. */
export function CodeWords({ text }: { text: string }) {
  return text.split('`').map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="rounded bg-muted px-1 font-mono">
        {part}
      </code>
    ) : (
      part
    ),
  )
}

/** A command to run in the project, set as code, with a button that copies it, and what it does. */
export function Command({ text, does }: { text: string; does: string }) {
  return (
    <span className="mt-1.5 flex flex-wrap items-center gap-x-2">
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{text}</code>
      <CopyButton text={text} label="Copy the command" />
      <span>{does}</span>
    </span>
  )
}
