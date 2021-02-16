import { selectParentNode as originalSelectParentNode } from 'prosemirror-commands'
import { Command, RawCommands } from '../types'

declare module '@tiptap/core' {
  interface Commands {
    selectParentNode: {
      /**
       * Select the parent node.
       */
      selectParentNode: () => Command,
    }
  }
}

export const selectParentNode: RawCommands['selectParentNode'] = () => ({ state, dispatch }) => {
  return originalSelectParentNode(state, dispatch)
}
