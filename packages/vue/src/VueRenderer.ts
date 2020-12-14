import { Editor, Node, NodeViewRendererProps } from '@tiptap/core'
import { Decoration, NodeView } from 'prosemirror-view'
import { NodeSelection } from 'prosemirror-state'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import Vue from 'vue'
import { VueConstructor } from 'vue/types/umd'

function getComponentFromElement(element: HTMLElement): Vue {
  // @ts-ignore
  // eslint-disable-next-line
  return element.__vue__
}

interface VueRendererOptions {
  stopEvent: ((event: Event) => boolean) | null,
  update: ((node: ProseMirrorNode, decorations: Decoration[]) => boolean) | null,
}

class VueNodeView implements NodeView {

  vm!: Vue

  editor: Editor

  extension!: Node

  node!: ProseMirrorNode

  decorations!: Decoration[]

  id!: string

  getPos!: any

  isDragging = false

  options: VueRendererOptions = {
    stopEvent: null,
    update: null,
  }

  constructor(component: Vue | VueConstructor, props: NodeViewRendererProps, options?: Partial<VueRendererOptions>) {
    this.options = { ...this.options, ...options }
    this.editor = props.editor
    this.extension = props.extension
    this.node = props.node
    this.getPos = props.getPos
    this.createUniqueId()
    this.mount(component)
  }

  createUniqueId() {
    this.id = `id_${Math.floor(Math.random() * 0xFFFFFFFF)}`
  }

  createNodeViewWrapper() {
    const { handleDragStart } = this
    const dragstart = handleDragStart.bind(this)

    return Vue.extend({
      props: {
        as: {
          type: String,
          default: 'div',
        },
      },
      render(createElement) {
        return createElement(
          this.as, {
            style: {
              whiteSpace: 'normal',
            },
            on: {
              dragstart,
            },
          },
          this.$slots.default,
        )
      },
    })
  }

  handleDragStart(event: DragEvent) {
    const { view } = this.editor
    const target = (event.target as HTMLElement)

    if (this.contentDOM?.contains(target)) {
      return
    }

    // sometimes `event.target` is not the `dom` element
    event.dataTransfer?.setDragImage(this.dom, 0, 0)

    const selection = NodeSelection.create(view.state.doc, this.getPos())
    const transaction = view.state.tr.setSelection(selection)

    view.dispatch(transaction)
  }

  createNodeViewContent() {
    const { id } = this
    const { isEditable } = this.editor

    return Vue.extend({
      inheritAttrs: false,
      props: {
        as: {
          type: String,
          default: 'div',
        },
      },
      render(createElement) {
        return createElement(
          this.as, {
            style: {
              whiteSpace: 'pre-wrap',
            },
            attrs: {
              id,
              contenteditable: isEditable,
            },
          },
        )
      },
    })
  }

  mount(component: Vue | VueConstructor) {
    const NodeViewWrapper = this.createNodeViewWrapper()
    const NodeViewContent = this.createNodeViewContent()

    const Component = Vue
      .extend(component)
      .extend({
        components: {
          NodeViewWrapper,
          NodeViewContent,
        },
      })

    const propsData = {
      NodeViewWrapper,
      NodeViewContent,
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      selected: false,
      extension: this.extension,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
    }

    const parent = this.editor.view.dom.parentElement
      ? getComponentFromElement(this.editor.view.dom.parentElement)
      : undefined

    this.vm = new Component({
      parent,
      propsData,
    }).$mount()
  }

  get dom() {
    return this.vm.$el
  }

  get contentDOM() {
    if (this.vm.$el.id === this.id) {
      return this.vm.$el
    }

    return this.vm.$el.querySelector(`#${this.id}`)
  }

  stopEvent(event: Event) {
    if (typeof this.options.stopEvent === 'function') {
      return this.options.stopEvent(event)
    }

    const target = (event.target as HTMLElement)
    const isInElement = this.dom.contains(target) && !this.contentDOM?.contains(target)

    // ignore all events from child nodes
    if (!isInElement) {
      return false
    }

    const { isEditable } = this.editor
    const isDraggable = this.node.type.spec.draggable
    const isCopyEvent = event.type === 'copy'
    const isPasteEvent = event.type === 'paste'
    const isCutEvent = event.type === 'cut'
    const isDragEvent = event.type.startsWith('drag') || event.type === 'drop'

    if (isDraggable && isDragEvent && !this.isDragging) {
      event.preventDefault()
      return false
    }

    // we have to store that dragging started
    if (isDraggable && isEditable && !this.isDragging && event.type === 'mousedown') {
      const dragHandle = target.closest('[data-drag-handle]')
      const isValidDragHandle = dragHandle
        && (this.dom === dragHandle || (this.dom.contains(dragHandle)))

      if (isValidDragHandle) {
        this.isDragging = true
        document.addEventListener('dragend', () => {
          this.isDragging = false
        }, { once: true })
      }
    }

    // these events are handled by prosemirror
    if (this.isDragging || isCopyEvent || isPasteEvent || isCutEvent) {
      return false
    }

    return true
  }

  ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element }) {
    if (mutation.type === 'selection') {
      if (this.node.isLeaf) {
        return true
      }

      return false
    }

    if (!this.contentDOM) {
      return true
    }

    const contentDOMHasChanged = !this.contentDOM.contains(mutation.target)
      || this.contentDOM === mutation.target

    return contentDOMHasChanged
  }

  destroy() {
    this.vm.$destroy()
  }

  update(node: ProseMirrorNode, decorations: Decoration[]) {
    if (typeof this.options.update === 'function') {
      return this.options.update(node, decorations)
    }

    if (node.type !== this.node.type) {
      return false
    }

    if (node === this.node && this.decorations === decorations) {
      return true
    }

    this.node = node
    this.decorations = decorations
    this.updateComponentProps({ node, decorations })

    return true
  }

  updateComponentProps(data: { [key: string]: any } = {}) {
    if (!this.vm.$props) {
      return
    }

    // prevents `Avoid mutating a prop directly` error message
    const originalSilent = Vue.config.silent
    Vue.config.silent = true

    Object
      .entries(data)
      .forEach(([key, value]) => {
        this.vm.$props[key] = value
      })

    Vue.config.silent = originalSilent
  }

  updateAttributes(attributes: {}) {
    if (!this.editor.view.editable) {
      return
    }

    const { state } = this.editor.view
    const pos = this.getPos()
    const transaction = state.tr.setNodeMarkup(pos, undefined, {
      ...this.node.attrs,
      ...attributes,
    })

    this.editor.view.dispatch(transaction)
  }

  selectNode() {
    this.updateComponentProps({
      selected: true,
    })
  }

  deselectNode() {
    this.updateComponentProps({
      selected: false,
    })
  }

}

export default function VueRenderer(component: Vue | VueConstructor, options?: Partial<VueRendererOptions>) {
  return (props: NodeViewRendererProps) => {
    // try to get the parent component
    // this is important for vue devtools to show the component hierarchy correctly
    // maybe it’s `undefined` because <editor-content> isn’t rendered yet
    const parent = props.editor.view.dom.parentElement
      ? getComponentFromElement(props.editor.view.dom.parentElement)
      : undefined

    if (!parent) {
      return undefined
    }

    return new VueNodeView(component, props, options) as NodeView
  }
}
