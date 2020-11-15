import { Command, NodeExtension } from '@tiptap/core'
import { wrappingInputRule } from 'prosemirror-inputrules'

export interface BlockquoteOptions {
  HTMLAttributes: {
    [key: string]: any
  },
}

export const inputRegex = /^\s*>\s$/gm

const Blockquote = NodeExtension.create({
  name: 'blockquote',

  defaultOptions: <BlockquoteOptions>{
    HTMLAttributes: {},
  },

  content: 'block*',

  group: 'block',

  defining: true,

  parseHTML() {
    return [
      { tag: 'blockquote' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['blockquote', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      /**
       * Toggle a blockquote node
       */
      blockquote: (): Command => ({ commands }) => {
        return commands.toggleWrap('blockquote')
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Shift-Mod-9': () => this.editor.commands.blockquote(),
    }
  },

  addInputRules() {
    return [
      wrappingInputRule(inputRegex, this.type),
    ]
  },
})

export default Blockquote

declare module '@tiptap/core' {
  interface AllExtensions {
    Blockquote: typeof Blockquote,
  }
}
