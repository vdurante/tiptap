import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import low from 'lowlight/lib/core'

type NodeWithPos = {
  node: ProsemirrorNode,
  pos: number,
}

const findBlockNodes = (doc: ProsemirrorNode) => {
  const nodes: NodeWithPos[] = []

  doc.descendants((node, pos) => {
    if (node.isBlock) {
      nodes.push({
        node,
        pos,
      })
    }
  })

  return nodes
}

function getDecorations({ doc, name }: { doc: ProsemirrorNode, name: string}) {
  const decorations: Decoration[] = []
  const blocks = findBlockNodes(doc).filter(block => block.node.type.name === name)

  function parseNodes(nodes: any[], className: string[] = []): any {
    return nodes.map(node => {

      const classes = [
        ...className,
        ...node.properties ? node.properties.className : [],
      ]

      if (node.children) {
        return parseNodes(node.children, classes)
      }

      return {
        text: node.value,
        classes,
      }
    })
  }

  blocks.forEach(block => {
    let startPos = block.pos + 1
    const nodes = low.highlightAuto(block.node.textContent).value

    parseNodes(nodes)
      .flat()
      .map((node: any) => {
        const from = startPos
        const to = from + node.text.length

        startPos = to

        return {
          ...node,
          from,
          to,
        }
      })
      .forEach((node: any) => {
        const decoration = Decoration.inline(node.from, node.to, {
          class: node.classes.join(' '),
        })
        decorations.push(decoration)
      })
  })

  return DecorationSet.create(doc, decorations)
}

export function LowlightPlugin({ name }: { name: string }) {
  return new Plugin({
    key: new PluginKey('highlight'),

    state: {
      init: (_, { doc }) => getDecorations({ doc, name }),
      apply: (transaction, decorationSet, oldState, newState) => {
        // TODO: find way to cache decorations
        // https://discuss.prosemirror.net/t/how-to-update-multiple-inline-decorations-on-node-change/1493
        const oldNodeName = oldState.selection.$head.parent.type.name
        const newNodeName = newState.selection.$head.parent.type.name
        const oldNodes = findBlockNodes(oldState.doc)
          .filter(node => node.node.type.name === name)
        const newNodes = findBlockNodes(newState.doc)
          .filter(node => node.node.type.name === name)

        // Apply decorations if selection includes named node, or transaction changes named node.
        if (transaction.docChanged && ([oldNodeName, newNodeName].includes(name)
          || newNodes.length !== oldNodes.length)) {
          return getDecorations({ doc: transaction.doc, name })
        }

        return decorationSet.map(transaction.mapping, transaction.doc)
      },
    },

    props: {
      decorations(state) {
        return this.getState(state)
      },
    },
  })
}
