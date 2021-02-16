import { Command, RawCommands } from '../types'

declare module '@tiptap/core' {
  interface Commands {
    first: {
      /**
       * Runs one command after the other and stops at the first which returns true.
       */
      first: (commands: Command[] | ((props: Parameters<Command>[0]) => Command[])) => Command,
    }
  }
}

export const first: RawCommands['first'] = commands => props => {
  const items = typeof commands === 'function'
    ? commands(props)
    : commands

  for (let i = 0; i < items.length; i += 1) {
    if (items[i](props)) {
      return true
    }
  }

  return false
}
