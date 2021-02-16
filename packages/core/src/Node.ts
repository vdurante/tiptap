// @ts-nocheck
import {
  DOMOutputSpec,
  NodeSpec,
  Node as ProseMirrorNode,
  NodeType,
} from 'prosemirror-model'
import { Plugin, Transaction } from 'prosemirror-state'
import { InputRule } from 'prosemirror-inputrules'
import { ExtensionConfig } from './Extension'
import mergeDeep from './utilities/mergeDeep'
import {
  Attributes, NodeViewRenderer, Overwrite, RawCommands,
} from './types'
import { Editor } from './Editor'

export interface NodeConfig<Options = any> extends Overwrite<ExtensionConfig<Options>, {
  /**
   * TopNode
   */
  topNode?: boolean,

  /**
   * Content
   */
  content?: NodeSpec['content'] | ((this: { options: Options }) => NodeSpec['content']),

  /**
   * Marks
   */
  marks?: NodeSpec['marks'] | ((this: { options: Options }) => NodeSpec['marks']),

  /**
   * Group
   */
  group?: NodeSpec['group'] | ((this: { options: Options }) => NodeSpec['group']),

  /**
   * Inline
   */
  inline?: NodeSpec['inline'] | ((this: { options: Options }) => NodeSpec['inline']),

  /**
   * Atom
   */
  atom?: NodeSpec['atom'] | ((this: { options: Options }) => NodeSpec['atom']),

  /**
   * Selectable
   */
  selectable?: NodeSpec['selectable'] | ((this: { options: Options }) => NodeSpec['selectable']),

  /**
   * Draggable
   */
  draggable?: NodeSpec['draggable'] | ((this: { options: Options }) => NodeSpec['draggable']),

  /**
   * Code
   */
  code?: NodeSpec['code'] | ((this: { options: Options }) => NodeSpec['code']),

  /**
   * Defining
   */
  defining?: NodeSpec['defining'] | ((this: { options: Options }) => NodeSpec['defining']),

  /**
   * Isolating
   */
  isolating?: NodeSpec['isolating'] | ((this: { options: Options }) => NodeSpec['isolating']),

  // TODO: extend via extension-table
  /**
   * Table Role
   */
  tableRole?: NodeSpec['tableRole'] | ((this: { options: Options }) => NodeSpec['tableRole']),

  /**
   * Parse HTML
   */
  parseHTML?: (
    this: {
      options: Options,
    },
  ) => NodeSpec['parseDOM'],

  /**
   * Render HTML
   */
  renderHTML?: ((
    this: {
      options: Options,
    },
    props: {
      node: ProseMirrorNode,
      HTMLAttributes: { [key: string]: any },
    }
  ) => DOMOutputSpec) | null,

  /**
   * Render Text
   */
  renderText?: ((
    this: {
      options: Options,
      editor: Editor,
      type: NodeType,
    },
    props: {
      node: ProseMirrorNode,
    }
  ) => string) | null,

  /**
   * Add Attributes
   */
  addAttributes?: (
    this: {
      options: Options,
    },
  ) => Attributes | {},

  /**
   * Commands
   */
  addCommands?: (this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => Partial<RawCommands>,

  /**
   * Keyboard shortcuts
   */
  addKeyboardShortcuts?: (this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => {
    // [key: string]: any
    [key: string]: () => boolean
  },

  /**
   * Input rules
   */
  addInputRules?: (this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => InputRule[],

  /**
   * Paste rules
   */
  addPasteRules?: (this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => Plugin[],

  /**
   * ProseMirror plugins
   */
  addProseMirrorPlugins?: (this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => Plugin[],

  /**
   * Node View
   */
  addNodeView?: ((this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => NodeViewRenderer) | null,

  /**
   * The editor is ready.
   */
  onCreate?: ((this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => void) | null,

  /**
   * The content has changed.
   */
  onUpdate?: ((this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => void) | null,

  /**
   * The selection has changed.
   */
  onSelection?: ((this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => void) | null,

  /**
   * The editor state has changed.
   */
  onTransaction?: ((
    this: {
      options: Options,
      editor: Editor,
      type: NodeType,
    },
    props: {
      transaction: Transaction,
    },
  ) => void) | null,

  /**
   * The editor is focused.
   */
  onFocus?: ((
    this: {
      options: Options,
      editor: Editor,
      type: NodeType,
    },
    props: {
      event: FocusEvent,
    },
  ) => void) | null,

  /**
   * The editor isn’t focused anymore.
   */
  onBlur?: ((
    this: {
      options: Options,
      editor: Editor,
      type: NodeType,
    },
    props: {
      event: FocusEvent,
    },
  ) => void) | null,

  /**
   * The editor is destroyed.
   */
  onDestroy?: ((this: {
    options: Options,
    editor: Editor,
    type: NodeType,
  }) => void) | null,
}> {}

export class Node<Options = any> {
  type = 'node'

  config: Required<NodeConfig> = {
    name: 'node',
    defaultOptions: {},
    addGlobalAttributes: () => [],
    addCommands: () => ({}),
    addKeyboardShortcuts: () => ({}),
    addInputRules: () => [],
    addPasteRules: () => [],
    addProseMirrorPlugins: () => [],
    topNode: false,
    content: null,
    marks: null,
    group: null,
    inline: null,
    atom: null,
    selectable: null,
    draggable: null,
    code: null,
    defining: null,
    isolating: null,
    parseHTML: () => null,
    renderHTML: null,
    renderText: null,
    addAttributes: () => ({}),
    addNodeView: null,
    onCreate: null,
    onUpdate: null,
    onSelection: null,
    onTransaction: null,
    onFocus: null,
    onBlur: null,
    onDestroy: null,
  }

  options!: Options

  constructor(config: NodeConfig<Options>) {
    this.config = {
      ...this.config,
      ...config,
    }

    this.options = this.config.defaultOptions
  }

  static create<O>(config: NodeConfig<O>) {
    return new Node<O>(config)
  }

  configure(options: Partial<Options> = {}) {
    return Node
      .create<Options>(this.config as NodeConfig<Options>)
      .#configure(options)
  }

  #configure = (options: Partial<Options>) => {
    this.options = mergeDeep(this.config.defaultOptions, options) as Options

    return this
  }

  extend<ExtendedOptions = Options>(extendedConfig: Partial<NodeConfig<ExtendedOptions>>) {
    return new Node<ExtendedOptions>({
      ...this.config,
      ...extendedConfig,
    } as NodeConfig<ExtendedOptions>)
  }
}
