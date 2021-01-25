import { Node, mergeAttributes } from '@tiptap/core'

export interface TableCellOptions {
  HTMLAttributes: {
    [key: string]: any
  },
}
export const TableCell = Node.create({
  name: 'tableCell',

  defaultOptions: <TableCellOptions>{
    HTMLAttributes: {},
  },

  content: 'block+',

  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
      },
    }
  },

  tableRole: 'cell',

  isolating: true,

  parseHTML() {
    return [
      { tag: 'td' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['td', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

})

declare module '@tiptap/core' {
  interface AllExtensions {
    TableCell: typeof TableCell,
  }
}
