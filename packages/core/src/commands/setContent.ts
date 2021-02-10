import { TextSelection } from 'prosemirror-state'
import { AnyObject, Command, Commands } from '../types'

/**
 * Replace the whole document with new content.
 */
export const setContent: Commands['setContent'] = (content, emitUpdate = false, parseOptions = {}) => ({ tr, editor, dispatch }) => {
  const { createDocument } = editor
  const { doc } = tr
  const document = createDocument(content, parseOptions)
  const selection = TextSelection.create(doc, 0, doc.content.size)

  if (dispatch) {
    tr.setSelection(selection)
      .replaceSelectionWith(document, false)
      .setMeta('preventUpdate', !emitUpdate)
  }

  return true
}

declare module '@tiptap/core' {
  interface Commands {
    setContent: (content: string, emitUpdate?: Boolean, parseOptions?: AnyObject) => Command,
  }
}
