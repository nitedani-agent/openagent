import { Fragment } from 'react'
import { CopyButton } from '@openagt/dashboard/module'

/** A web address in a sentence, without the punctuation that ends the sentence. */
const ADDRESS = /(https:\/\/[^\s<>"]*[^\s<>".,;:!?)])/

/** A sentence of the `scheduler` command, its `backticked` words set as code and a web address made a link: what a person types is shown as such, and where it sends them opens. */
export function CodeWords({ text }: { text: string }) {
  return text.split('`').map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="rounded bg-muted px-1 font-mono">
        {part}
      </code>
    ) : (
      <Fragment key={index}>
        {part.split(ADDRESS).map((words, at) =>
          at % 2 === 1 ? (
            <a key={at} href={words} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              {words}
            </a>
          ) : (
            words
          ),
        )}
      </Fragment>
    ),
  )
}

/** A command to run in the project, on a line of its own: set as code, with a button that copies it, named by the command's last word ("Copy the start command"). What it does is the sentence's before it, so every command lays out alike. */
export function Command({ text }: { text: string }) {
  return (
    <span className="my-1.5 flex items-center gap-2">
      <code className="min-w-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs break-all text-foreground">{text}</code>
      <CopyButton text={text} label={`Copy the ${text.split(' ').at(-1)} command`} />
    </span>
  )
}
