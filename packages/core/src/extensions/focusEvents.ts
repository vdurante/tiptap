import { Plugin, PluginKey } from 'prosemirror-state'
import { Extension } from '../Extension'

export const FocusEvents = Extension.create({
  addProseMirrorPlugins() {
    const { editor } = this

    return [
      new Plugin({
        key: new PluginKey('focusEvents'),
        props: {
          attributes: {
            tabindex: '0',
          },
          handleDOMEvents: {
            focus: (view, event) => {
              editor.isFocused = true

              const transaction = editor.state.tr.setMeta('focus', { event })
              view.dispatch(transaction)

              return true
            },
            blur: (view, event) => {
              editor.isFocused = false

              const transaction = editor.state.tr.setMeta('blur', { event })
              view.dispatch(transaction)

              return true
            },
          },
        },
      }),
    ]
  },
})

declare module '@tiptap/core' {
  interface AllExtensions {
    FocusEvents: typeof FocusEvents,
  }
}
