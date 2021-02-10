import { Command, Node } from '@tiptap/core'
import { textblockTypeInputRule } from 'prosemirror-inputrules'

export interface CodeBlockOptions {
  languageClassPrefix: string,
  HTMLAttributes: {
    [key: string]: any
  },
}

declare module '@tiptap/core' {
  interface Commands {
    /**
     * Set a code block
     */
    setCodeBlock: (attributes?: { language: string }) => Command,
    /**
     * Toggle a code block
     */
    toggleCodeBlock: (attributes?: { language: string }) => Command,
  }
}

export const backtickInputRegex = /^```(?<language>[a-z]*)? $/
export const tildeInputRegex = /^~~~(?<language>[a-z]*)? $/

export const CodeBlock = Node.create<CodeBlockOptions>({
  name: 'codeBlock',

  defaultOptions: {
    languageClassPrefix: 'language-',
    HTMLAttributes: {},
  },

  content: 'text*',

  marks: '',

  group: 'block',

  code: true,

  defining: true,

  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: element => {
          const classAttribute = element.firstElementChild?.getAttribute('class')

          if (!classAttribute) {
            return null
          }

          const regexLanguageClassPrefix = new RegExp(`^(${this.options.languageClassPrefix})`)

          return {
            language: classAttribute.replace(regexLanguageClassPrefix, ''),
          }
        },
        renderHTML: attributes => {
          if (!attributes.language) {
            return null
          }

          return {
            class: this.options.languageClassPrefix + attributes.language,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['pre', this.options.HTMLAttributes, ['code', HTMLAttributes, 0]]
  },

  addCommands() {
    return {
      setCodeBlock: attributes => ({ commands }) => {
        return commands.setNode('codeBlock', attributes)
      },
      toggleCodeBlock: attributes => ({ commands }) => {
        return commands.toggleNode('codeBlock', 'paragraph', attributes)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
    }
  },

  addInputRules() {
    return [
      textblockTypeInputRule(backtickInputRegex, this.type, ({ groups }: any) => groups),
      textblockTypeInputRule(tildeInputRegex, this.type, ({ groups }: any) => groups),
    ]
  },
})
