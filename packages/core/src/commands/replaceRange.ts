import { NodeType } from 'prosemirror-model'
import getNodeType from '../helpers/getNodeType'
import { Command, Range, AnyObject } from '../types'

/**
 * Replaces text with a node within a range.
 */
export const replaceRange = (range: Range, typeOrName: string | NodeType, attributes: AnyObject = {}): Command => ({ tr, state, dispatch }) => {
  const type = getNodeType(typeOrName, state.schema)
  const { from, to } = range
  const $from = tr.doc.resolve(from)
  const index = $from.index()

  if (!$from.parent.canReplaceWith(index, index, type)) {
    return false
  }

  if (dispatch) {
    tr.replaceWith(from, to, type.create(attributes))
  }

  return true
}
