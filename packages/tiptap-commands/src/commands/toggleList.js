import { wrapInList, liftListItem } from 'prosemirror-schema-list'
import { findParentNode } from 'prosemirror-utils'

function isList(node, schema) {
  return (node.type === schema.nodes.bullet_list
      || node.type === schema.nodes.ordered_list
      || node.type === schema.nodes.todo_list)
}

export default function toggleList(listType, itemType) {
  return (state, dispatch, view) => {
    const { schema, selection } = state
    const lift = liftListItem(itemType)
    const wrap = wrapInList(listType)
    const { $from, $to } = selection
    const range = $from.blockRange($to)
    if (!range) {
      return false
		}

    const parentList = findParentNode(node => isList(node, schema))(selection)

    if (range.depth >= 1 && parentList) {
      if (parentList.node.type === listType) {
        return lift(state, dispatch, view)
      }

      if (isList(parentList.node, schema)) {
        const { tr } = state
        tr.setNodeMarkup(parentList.pos, listType)
        if (dispatch) dispatch(tr)
        return false
      }
    }

    return wrap(state, dispatch, view)
  }
}
