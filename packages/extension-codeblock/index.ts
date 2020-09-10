import { Node } from '@tiptap/core'

export default new Node()
  .name('codeBlock')
  .schema(() => ({
    content: 'text*',
    marks: '',
    group: 'block',
    code: true,
    defining: true,
    draggable: false,
    parseDOM: [
      { tag: 'pre', preserveWhitespace: 'full' },
    ],
    toDOM: () => ['pre', ['code', 0]],
  }))
  .commands(({ editor, name }) => ({
    [name]: next => attrs => {
      editor.toggleNode(name, 'paragraph', attrs)
      next()
    },
  }))
  .create()
