import { Command, createExtension } from '@tiptap/core'
import { history, undo, redo } from 'prosemirror-history'

export interface HistoryOptions {
  depth: number,
  newGroupDelay: number,
}

const History = createExtension({
  defaultOptions: <HistoryOptions>{
    depth: 100,
    newGroupDelay: 500,
  },

  addCommands() {
    return {
      /**
       * Undo recent changes
       */
      undo: (): Command => ({ state, dispatch }) => {
        return undo(state, dispatch)
      },
      /**
       * Reapply reverted changes
       */
      redo: (): Command => ({ state, dispatch }) => {
        return redo(state, dispatch)
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      history(this.options),
    ]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-z': () => this.editor.commands.undo(),
      'Mod-y': () => this.editor.commands.redo(),
      'Shift-Mod-z': () => this.editor.commands.redo(),
    }
  },
})

export default History

declare module '@tiptap/core' {
  interface AllExtensions {
    History: typeof History,
  }
}
