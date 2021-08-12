import { EditorState, Selection, TextSelection } from 'prosemirror-state'
import { RawCommands, FocusPosition } from '../types'
import minMax from '../utilities/minMax'
import isTextSelection from '../helpers/isTextSelection'

function resolveSelection(state: EditorState, position: FocusPosition = null) {
  if (!position) {
    return null
  }

  if (position === 'start' || position === true) {
    return {
      from: 0,
      to: 0,
    }
  }

  if (position === 'end') {
    const { size } = state.doc.content

    return {
      from: size,
      to: size,
    }
  }

  return {
    from: position,
    to: position,
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    focus: {
      /**
       * Focus the editor at the given position.
       */
      focus: (position?: FocusPosition) => ReturnType,
    }
  }
}

export const focus: RawCommands['focus'] = (position = null) => ({
  editor,
  view,
  tr,
  dispatch,
}) => {
  const delayedFocus = () => {
    // For React we have to focus asynchronously. Otherwise wild things happen.
    // see: https://github.com/ueberdosis/tiptap/issues/1520
    requestAnimationFrame(() => {
      if (!editor.isDestroyed) {
        view.focus()
      }
    })
  }

  if ((view.hasFocus() && position === null) || position === false) {
    return true
  }

  // we don’t try to resolve a NodeSelection or CellSelection
  if (dispatch && position === null && !isTextSelection(editor.state.selection)) {
    delayedFocus()
    return true
  }

  const { from, to } = resolveSelection(editor.state, position) || editor.state.selection
  const { doc, storedMarks } = tr
  const minPos = Selection.atStart(doc).from
  const maxPos = Selection.atEnd(doc).to
  const resolvedFrom = minMax(from, minPos, maxPos)
  const resolvedEnd = minMax(to, minPos, maxPos)
  const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd)
  const isSameSelection = editor.state.selection.eq(selection)

  if (dispatch) {
    if (!isSameSelection) {
      tr.setSelection(selection)
    }

    // `tr.setSelection` resets the stored marks
    // so we’ll restore them if the selection is the same as before
    if (isSameSelection && storedMarks) {
      tr.setStoredMarks(storedMarks)
    }

    delayedFocus()
  }

  return true
}
