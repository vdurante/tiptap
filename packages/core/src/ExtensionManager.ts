import collect from 'collect.js'
import { Plugin } from 'prosemirror-state'
import { keymap } from 'prosemirror-keymap'
import { inputRules } from 'prosemirror-inputrules'
import { EditorView, Decoration } from 'prosemirror-view'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Editor } from './Editor'
import Node from './Node'
import Mark from './Mark'
import capitalize from './utils/capitalize'
import { Extensions } from './types'
import getTopNodeFromExtensions from './getTopNodeFromExtensions'
import getNodesFromExtensions from './getNodesFromExtensions'
import getMarksFromExtensions from './getMarksFromExtensions'

export default class ExtensionManager {

  editor: Editor
  extensions: Extensions

  constructor(extensions: Extensions, editor: Editor) {
    this.editor = editor
    this.extensions = extensions
    this.extensions.forEach(extension => {
      extension.bindEditor(editor)
      editor.on('schemaCreated', () => {
        this.editor.registerCommands(extension.commands())
        extension.created()
      })
    })
  }

  get topNode() {
    return getTopNodeFromExtensions(this.extensions)
  }

  get nodes(): any {
    return getNodesFromExtensions(this.extensions)
  }

  get marks(): any {
    return getMarksFromExtensions(this.extensions)
  }

  get plugins(): Plugin[] {
    const plugins = collect(this.extensions)
      .flatMap(extension => extension.plugins())
      .toArray()

    return [
      ...plugins,
      ...this.keymaps,
      ...this.pasteRules,
      inputRules({ rules: this.inputRules }),
    ]
  }

  get inputRules(): any {
    return collect(this.extensions)
      .flatMap(extension => extension.inputRules())
      .toArray()
  }

  get pasteRules(): any {
    return collect(this.extensions)
      .flatMap(extension => extension.pasteRules())
      .toArray()
  }

  get keymaps() {
    return collect(this.extensions)
      .map(extension => extension.keys())
      .filter(keys => !!Object.keys(keys).length)
      // @ts-ignore
      .map(keys => keymap(keys))
      .toArray()
  }

  get nodeViews() {
    const { renderer: Renderer } = this.editor

    if (!Renderer || !Renderer.type) {
      return {}
    }

    const prop = `to${capitalize(Renderer.type)}`

    return collect(this.extensions)
      .where('extensionType', 'node')
      .filter((extension: any) => extension.schema()[prop])
      .map((extension: any) => {
        return (
          node: ProsemirrorNode,
          view: EditorView,
          getPos: (() => number) | boolean,
          decorations: Decoration[],
        ) => {
          return new Renderer(extension.schema()[prop], {
            extension,
            editor: this.editor,
            node,
            getPos,
            decorations,
          })
        }
      })
      .all()
  }

}
