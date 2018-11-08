import { findParentNode } from 'prosemirror-utils'

export default function (state, type, attrs = {}) {
  const predicate = node => node.type === type
  const parent = findParentNode(predicate)(state.selection)

  if (!Object.keys(attrs).length || !parent) {
    return !!parent
  }

  return parent.node.hasMarkup(type, attrs)
}
