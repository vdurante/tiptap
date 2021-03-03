import {
  h,
  ref,
  Ref,
  unref,
  Teleport,
  PropType,
  defineComponent,
  DefineComponent,
  watchEffect,
  nextTick,
  onBeforeUnmount,
  getCurrentInstance,
} from 'vue'
import { Editor } from './Editor'

export const EditorContent = defineComponent({
  name: 'EditorContent',

  props: {
    editor: {
      default: null,
      type: Object as PropType<Editor>,
    },
  },

  setup(props) {
    const rootEl: Ref<Element | undefined> = ref()
    const instance = getCurrentInstance()

    watchEffect(() => {
      const editor = props.editor

      if (editor && editor.options.element && rootEl.value) {
        nextTick(() => {
          if (!rootEl.value || !editor.options.element.firstChild) {
            return
          }

          const el = unref(rootEl.value)

          rootEl.value.appendChild(editor.options.element.firstChild)

          // @ts-ignore
          editor.contentComponent = instance.ctx._

          editor.setOptions({
            element: el,
          })

          editor.createNodeViews()
        })
      }
    })

    onBeforeUnmount(() => {
      const editor = props.editor

      // destroy nodeviews before vue removes dom element
      // @ts-ignore
      if (editor.view?.docView) {
        editor.view.setProps({
          nodeViews: {},
        })
      }

      editor.contentComponent = null

      if (!editor.options.element.firstChild) {
        return
      }

      const newEl = document.createElement('div')

      newEl.appendChild(editor.options.element.firstChild)

      editor.setOptions({
        element: newEl,
      })
    })

    return { rootEl }
  },

  render() {
    const vueRenderers: any[] = []

    if (this.editor) {
      this.editor.vueRenderers.forEach(vueRenderer => {
        const node = h(
          Teleport,
          {
            to: vueRenderer.teleportElement,
            key: vueRenderer.id,
          },
          h(
            vueRenderer.component as DefineComponent,
            {
              ref: vueRenderer.id,
              ...vueRenderer.props,
            },
          ),
        )

        vueRenderers.push(node)
      })
    }

    return h(
      'div',
      {
        ref: (el: any) => { this.rootEl = el },
      },
      ...vueRenderers,
    )
  },
})
