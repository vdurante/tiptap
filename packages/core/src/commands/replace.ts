import { NodeType } from 'prosemirror-model'
import { Command, RawCommands } from '../types'

declare module '@tiptap/core' {
  interface Commands {
    replace: {
      /**
       * Replaces text with a node.
       */
      replace: (typeOrName: string | NodeType, attributes?: Record<string, any>) => Command,
    }
  }
}

export const replace: RawCommands['replace'] = (typeOrName, attributes = {}) => ({ state, commands }) => {
  const { from, to } = state.selection
  const range = { from, to }

  return commands.replaceRange(range, typeOrName, attributes)
}
