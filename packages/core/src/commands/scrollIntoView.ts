import { Command, RawCommands } from '../types'

declare module '@tiptap/core' {
  interface Commands {
    scrollIntoView: {
      /**
       * Scroll the selection into view.
       */
      scrollIntoView: () => Command,
    }
  }
}

export const scrollIntoView: RawCommands['scrollIntoView'] = () => ({ tr, dispatch }) => {
  if (dispatch) {
    tr.scrollIntoView()
  }

  return true
}
