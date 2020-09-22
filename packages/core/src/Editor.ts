import { EditorState, Plugin, Transaction } from 'prosemirror-state'
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
import getHtmlFromFragment from './utils/getHtmlFromFragment'
import CommandManager from './CommandManager'
import ExtensionManager from './ExtensionManager'
import EventEmitter from './EventEmitter'
import Extension from './Extension'
import Node from './Node'
import Mark from './Mark'
import ComponentRenderer from './ComponentRenderer'
import defaultPlugins from './plugins'
import * as commands from './commands'

export type Command = (props: {
  editor: Editor,
  tr: Transaction,
  commands: SingleCommands,
  chain: () => ChainedCommands,
  state: EditorState,
  view: EditorView,
  dispatch: (args?: any) => any,
}) => boolean

export interface CommandSpec {
  [key: string]: (...args: any[]) => Command
}

export interface Commands {}

export type CommandNames = Extract<keyof Commands, string>

export type SingleCommands = {
  [Command in keyof Commands]: Commands[Command] extends (...args: any[]) => any
  ? (...args: Parameters<Commands[Command]>) => boolean
  : never
}

export type ChainedCommands = {
  [Command in keyof Commands]: Commands[Command] extends (...args: any[]) => any
  ? (...args: Parameters<Commands[Command]>) => ChainedCommands
  : never
} & {
  run: () => boolean
}

type EditorContent = string | JSON | null

interface HTMLElement {
  editor?: Editor
}

interface EditorOptions {
  element: Element,
  content: EditorContent,
  extensions: (Extension | Node | Mark)[],
  injectCSS: boolean,
  autoFocus: 'start' | 'end' | number | boolean | null,
  editable: boolean,
}

declare module './Editor' {
  interface Editor extends SingleCommands {}
}

@magicMethods
export class Editor extends EventEmitter {

  public renderer!: any
  private proxy!: Editor
  private commandManager!: CommandManager
  private extensionManager!: ExtensionManager
  private commands: { [key: string]: any } = {}
  private css!: HTMLStyleElement
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
    this.on('createdProxy', this.init)
  }

  /**
   * This method is called after the proxy is initialized.
   */
  private init() {
    this.createExtensionManager()
    this.createSchema()
    this.extensionManager.resolveConfigs()
    this.createView()
    this.registerCommands(commands)
    this.createCommandManager()

    if (this.options.injectCSS) {
      require('./style.css')
    }

    this.proxy.focus(this.options.autoFocus)
  }

  /**
   * A magic method to call commands.
   *
   * @param name The name of the command
   */
  private __get(name: string) {
    return this.commandManager.runSingleCommand(name)
  }

  /**
   * Create a command chain to call multiple commands at once.
   */
  public chain() {
    return this.commandManager.createChain()
  }

  /**
   * Update editor options.
   *
   * @param options A list of options
   */
  public setOptions(options: Partial<EditorOptions> = {}) {
    this.options = { ...this.options, ...options }

    if (this.view && this.state) {
      this.view.updateState(this.state)
    }
  }

  /**
   * Returns whether the editor is editable.
   */
  public get isEditable() {
    return this.view && this.view.editable
  }

  /**
   * Returns the editor state.
   */
  public get state() {
    return this.view.state
  }

  /**
   * Register a list of commands.
   *
   * @param commands A list of commands
   */
  public registerCommands(commands: CommandSpec) {
    Object
      .entries(commands)
      .forEach(([name, command]) => this.registerCommand(name, command))
  }

  /**
   * Register a command.
   *
   * @param name The name of your command
   * @param callback The method of your command
   */
  public registerCommand(name: string, callback: (bla?: any) => Command): Editor {
    if (this.commands[name]) {
      throw new Error(`tiptap: command '${name}' is already defined.`)
    }

    if (getAllMethodNames(this).includes(name)) {
      throw new Error(`tiptap: '${name}' is a protected name.`)
    }

    this.commands[name] = callback

    return this.proxy
  }

  /**
   * Call a command.
   *
   * @param name The name of the command you want to call.
   * @param options The options of the command.
   */
  public command(name: string, ...options: any) {
    return this.commands[name](...options)
  }

  /**
   * Register a ProseMirror plugin.
   *
   * @param plugin A ProseMirror plugin
   * @param handlePlugins Control how to merge the plugin into the existing plugins.
   */
  public registerPlugin(plugin: Plugin, handlePlugins?: (plugin: Plugin, plugins: Plugin[]) => Plugin[]) {
    const plugins = typeof handlePlugins === 'function'
      ? handlePlugins(plugin, this.state.plugins)
      : [plugin, ...this.state.plugins]

    const state = this.state.reconfigure({ plugins })

    this.view.updateState(state)
  }

  /**
   * Unregister a ProseMirror plugin.
   *
   * @param name The plugins name
   */
  public unregisterPlugin(name: string) {
    const state = this.state.reconfigure({
      // @ts-ignore
      plugins: this.state.plugins.filter(plugin => !plugin.key.startsWith(`${name}$`)),
    })

    this.view.updateState(state)
  }

  /**
   * Creates an extension manager.
   */
  private createExtensionManager() {
    this.extensionManager = new ExtensionManager(this.options.extensions, this.proxy)
  }

  /**
   * Creates an command manager.
   */
  private createCommandManager() {
    this.commandManager = new CommandManager(this.proxy, this.commands)
  }

  /**
   * Creates a ProseMirror schema.
   */
  private createSchema() {
    this.schema = this.extensionManager.schema
  }

  /**
   * Creates a ProseMirror view.
   */
  private createView() {
    this.view = new EditorView(this.options.element, {
      state: EditorState.create({
        doc: this.createDocument(this.options.content),
        plugins: [
          ...this.extensionManager.plugins,
          ...defaultPlugins.map(plugin => plugin(this.proxy)),
        ],
      }),
      dispatchTransaction: this.dispatchTransaction.bind(this),
      nodeViews: this.extensionManager.nodeViews,
    })

    // store editor in dom element for better testing
    const dom = this.view.dom as HTMLElement
    dom.editor = this.proxy
  }

  /**
   * Creates a ProseMirror document.
   */
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

  /**
   * Store the current selection.
   */
  private storeSelection() {
    const { from, to } = this.state.selection
    this.selection = { from, to }
  }

  /**
   * The callback over which to send transactions (state updates) produced by the view.
   *
   * @param transaction An editor state transaction
   */
  private dispatchTransaction(transaction: Transaction) {
    const state = this.state.apply(transaction)
    this.view.updateState(state)
    this.storeSelection()
    this.emit('transaction', { transaction })

    if (!transaction.docChanged || transaction.getMeta('preventUpdate')) {
      return
    }

    this.emit('update', { transaction })
  }

  /**
   * Get attributes of the currently selected node.
   *
   * @param name Name of the node
   */
  public getNodeAttrs(name: string) {
    return getNodeAttrs(this.state, this.schema.nodes[name])
  }

  /**
   * Get attributes of the currently selected mark.
   *
   * @param name Name of the mark
   */
  public getMarkAttrs(name: string) {
    return getMarkAttrs(this.state, this.schema.marks[name])
  }

  /**
   * Returns if the currently selected node or mark is active.
   *
   * @param name Name of the node or mark
   * @param attrs Attributes of the node or mark
   */
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

  /**
   * Get the document as JSON.
   */
  public json() {
    return this.state.doc.toJSON()
  }

  /**
   * Get the document as HTML.
   */
  public html() {
    return getHtmlFromFragment(this.state.doc, this.schema)
  }

  /**
   * Destroy the editor.
   */
  public destroy() {
    if (this.view) {
      this.view.destroy()
    }

    this.removeAllListeners()
    removeElement(this.css)
  }

}
