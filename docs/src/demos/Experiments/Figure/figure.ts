import {
  Command,
  Node,
  nodeInputRule,
  mergeAttributes,
} from '@tiptap/core'

export interface FigureOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands {
    figure: {
      /**
       * Add a figure element
       */
      setFigure: (options: { src: string, alt?: string, title?: string }) => Command,
    }
  }
}

export const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

export const Figure = Node.create<FigureOptions>({
  name: 'figure',

  defaultOptions: {
    // inline: false,
    HTMLAttributes: {},
  },

  group: 'block',

  content: 'inline*',

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => {
          return {
            src: element.querySelector('img')?.getAttribute('src'),
          }
        },
      },
      alt: {
        default: null,
        parseHTML: element => {
          return {
            alt: element.querySelector('img')?.getAttribute('alt'),
          }
        },
      },
      title: {
        default: null,
        parseHTML: element => {
          return {
            title: element.querySelector('img')?.getAttribute('title'),
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        contentELement: 'figcaption',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure', this.options.HTMLAttributes,
      ['img', mergeAttributes(HTMLAttributes, { draggable: false })],
      ['figcaption', 0],
    ]
  },

  addCommands() {
    return {
      setFigure: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule(inputRegex, this.type, match => {
        const [, alt, src, title] = match

        return { src, alt, title }
      }),
    ]
  },
})
