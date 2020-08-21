import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView} from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'

import magicMethods from './utils/magicMethods'
import elementFromString from './utils/elementFromString'
import getAllMethodNames from './utils/getAllMethodNames'
import nodeIsActive from './utils/nodeIsActive'
import markIsActive from './utils/markIsActive'
import getNodeAttrs from './utils/getNodeAttrs'
import getMarkAttrs from './utils/getMarkAttrs'
import removeElement from './utils/removeElement'
import getSchemaTypeByName from './utils/getSchemaTypeByName'
import ExtensionManager from './ExtensionManager'
import Extension from './Extension'
import Node from './Node'
import Mark from './Mark'
import EventEmitter from './EventEmitter'
import ComponentRenderer from './ComponentRenderer'
import defaultPlugins from './plugins'
import * as commands from './commands'

export type Command = (next: Function, editor: Editor) => (...args: any) => any

export interface CommandSpec {
  [key: string]: Command
}

type EditorContent = string | JSON | null

interface EditorOptions {
  element: Element,
  content: EditorContent,
  extensions: (Extension | Node | Mark)[],
  injectCSS: boolean,
  autoFocus: 'start' | 'end' | number | boolean | null,
  editable: boolean,
}

@magicMethods
export class Editor extends EventEmitter {

  public renderer!: any
  private proxy!: Editor
  private extensionManager!: ExtensionManager
  private commands: { [key: string]: any } = {}
  private css!: HTMLStyleElement
  private lastCommand = Promise.resolve()
  public schema!: Schema
  public view!: EditorView
  public selection = { from: 0, to: 0 }
  public isFocused = false
  public options: EditorOptions = {
    element: document.createElement('div'),
    content: '',
    injectCSS: true,
    extensions: [],
    autoFocus: false,
    editable: true,
  }

  constructor(options: Partial<EditorOptions> = {}) {
    super()
    this.options = { ...this.options, ...options }
  }

  private init() {
    this.createExtensionManager()
    this.createSchema()
    this.createView()
    this.registerCommands(commands)

    if (this.options.injectCSS) {
      require('./style.css')
    }
    
    this.proxy.focus(this.options.autoFocus)
  }

  private __get(name: string) {
    const command = this.commands[name]

    if (!command) {
      // TODO: prevent vue devtools to throw error
      // throw new Error(`tiptap: command '${name}' not found.`)
      return
    }

    return (...args: any) => command(...args)
  }

  public setOptions(options: Partial<EditorOptions> = {}) {
    this.options = { ...this.options, ...options }

    if (this.view && this.state) {
      this.view.updateState(this.state)
    }
  }

  public get isEditable() {
    return this.view && this.view.editable
  }

  public get state() {
    return this.view.state
  }

  public registerCommands(commands: CommandSpec) {
    Object
      .entries(commands)
      .forEach(([name, command]) => this.registerCommand(name, command))
  }

  public registerCommand(name: string, callback: Command): Editor {
    if (this.commands[name]) {
      throw new Error(`tiptap: command '${name}' is already defined.`)
    }

    if (getAllMethodNames(this).includes(name)) {
      throw new Error(`tiptap: '${name}' is a protected name.`)
    }

    this.commands[name] = this.chainCommand((...args: any) => {
      return new Promise(resolve => callback(resolve, this.proxy)(...args))
    })

    return this.proxy
  }

  public registerPlugin(plugin: Plugin, handlePlugins?: (plugin: Plugin, plugins: Plugin[]) => Plugin[]) {
    const plugins = typeof handlePlugins === 'function'
      ? handlePlugins(plugin, this.state.plugins)
      : [plugin, ...this.state.plugins]

    const state = this.state.reconfigure({ plugins })

    this.view.updateState(state)
  }

  public unregisterPlugin(name: string) {
    const state = this.state.reconfigure({
      // @ts-ignore
      plugins: this.state.plugins.filter(plugin => !plugin.key.startsWith(`${name}$`)),
    })

    this.view.updateState(state)
  }

  public command(name: string, ...args: any) {
    return this.commands[name](...args)
  }

  private createExtensionManager() {
    this.extensionManager = new ExtensionManager(this.options.extensions, this.proxy)
  }

  private createSchema() {
    this.schema = new Schema({
      topNode: this.extensionManager.topNode,
      nodes: this.extensionManager.nodes,
      marks: this.extensionManager.marks,
    })
    this.emit('schemaCreated')
  }

  private get plugins() {
    return [
      ...this.extensionManager.plugins,
      ...defaultPlugins.map(plugin => plugin(this.proxy)),
    ]
  }

  private createView() {
    this.view = new EditorView(this.options.element, {
      state: EditorState.create({
        doc: this.createDocument(this.options.content),
        plugins: this.plugins,
      }),
      dispatchTransaction: this.dispatchTransaction.bind(this),
      nodeViews: this.extensionManager.nodeViews,
    })
  }

  private chainCommand = (method: Function) => (...args: any) => {
    this.lastCommand = this.lastCommand
      .then(() => method.apply(this, args))
      .catch(console.error)

    return this.proxy
  }

  public createDocument = (content: EditorContent, parseOptions: any = {}): any => {
    if (content && typeof content === 'object') {
      try {
        return this.schema.nodeFromJSON(content)
      } catch (error) {
        console.warn('[tiptap warn]: Invalid content.', 'Passed value:', content, 'Error:', error)
        return this.createDocument('')
      }
    }

    if (typeof content === 'string') {
      return DOMParser
        .fromSchema(this.schema)
        .parse(elementFromString(content), parseOptions)
    }

    return this.createDocument('')
  }

  private storeSelection() {
    const { from, to } = this.state.selection
    this.selection = { from, to }
  }

  private dispatchTransaction(transaction: any): void {
    const state = this.state.apply(transaction)
    this.view.updateState(state)
    this.storeSelection()
    this.emit('transaction', { transaction })

    if (!transaction.docChanged || transaction.getMeta('preventUpdate')) {
      return
    }

    this.emit('update', { transaction })
  }

  public getNodeAttrs(name: string) {
    return getNodeAttrs(this.state, this.schema.nodes[name])
  }

  public getMarkAttrs(name: string) {
    return getMarkAttrs(this.state, this.schema.marks[name])
  }

  public isActive(name: string, attrs = {}) {
    const schemaType = getSchemaTypeByName(name, this.schema)

    if (schemaType === 'node') {
      return nodeIsActive(this.state, this.schema.nodes[name], attrs)
    } else if (schemaType === 'mark') {
      return markIsActive(this.state, this.schema.marks[name])
    }

    return false
  }

  // public setParentComponent(component = null) {
  //   if (!component) {
  //     return
  //   }

  //   this.view.setProps({
  //     nodeViews: this.initNodeViews({
  //       parent: component,
  //       extensions: [
  //         ...this.builtInExtensions,
  //         ...this.options.extensions,
  //       ],
  //     }),
  //   })
  // }

  public json() {
    return this.state.doc.toJSON()
  }

  public html() {
    const div = document.createElement('div')
    const fragment = DOMSerializer
      .fromSchema(this.schema)
      .serializeFragment(this.state.doc.content)

    div.appendChild(fragment)

    return div.innerHTML
  }

  public destroy() {
    if (this.view) {
      this.view.destroy()
    }

    this.removeAllListeners()
    removeElement(this.css)
  }

}
