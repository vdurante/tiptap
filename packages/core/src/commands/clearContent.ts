import { Command, Commands } from '../types'

declare module '@tiptap/core' {
  interface AllCommands {
    clearContent: {
      /**
       * Clear the whole document.
       */
      clearContent: (emitUpdate: Boolean) => Command,
    }
  }
}

export const clearContent: Commands['clearContent'] = (emitUpdate = false) => ({ commands }) => {
  return commands.setContent('', emitUpdate)
}
