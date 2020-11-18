import { Command, Extension } from '@tiptap/core'
import { chain } from 'cypress/types/lodash'

type TextAlignOptions = {
  types: string[],
  alignments: string[],
  defaultAlignment: string,
}

const TextAlign = Extension.create({
  defaultOptions: <TextAlignOptions>{
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left',
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            renderHTML: attributes => ({
              style: `text-align: ${attributes.textAlign}`,
            }),
            parseHTML: element => ({
              textAlign: element.style.textAlign || this.options.defaultAlignment,
            }),
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      /**
       * Set the text align attribute
       */
      setTextAlign: (alignment: string): Command => ({ commands }) => {
        if (!this.options.alignments.includes(alignment)) {
          return false
        }

        return this.options.types.every(type => commands.updateNodeAttributes(type, { textAlign: alignment }))
      },
      /**
       * Unset the text align attribute
       */
      unsetTextAlign: (): Command => ({ commands }) => {
        return this.options.types.every(type => commands.resetNodeAttributes(type, 'textAlign'))
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      // TODO: re-use only 'textAlign' attribute
      // TODO: use custom splitBlock only for `this.options.types`
      // TODO: use complete default enter handler (chainCommand) with custom splitBlock
      Enter: () => this.editor.commands.splitBlock({
        withAttributes: true,
      }),
      'Ctrl-Shift-l': () => this.editor.commands.setTextAlign('left'),
      'Ctrl-Shift-e': () => this.editor.commands.setTextAlign('center'),
      'Ctrl-Shift-r': () => this.editor.commands.setTextAlign('right'),
      'Ctrl-Shift-j': () => this.editor.commands.setTextAlign('justify'),
    }
  },
})

export default TextAlign

declare module '@tiptap/core' {
  interface AllExtensions {
    TextAlign: typeof TextAlign,
  }
}
