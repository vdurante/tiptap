import { Extension } from '@tiptap/core'
import { gapCursor } from 'prosemirror-gapcursor'

const Gapcursor = Extension.create({
  addProseMirrorPlugins() {
    return [
      gapCursor(),
    ]
  },
})

export default Gapcursor

declare module '@tiptap/core' {
  interface AllExtensions {
    Gapcursor: typeof Gapcursor,
  }
}
