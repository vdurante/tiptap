import { Node } from 'tiptap'
import { splitToDefaultListItem, liftListItem } from 'tiptap-commands'

export default class TodoItem extends Node {

  get name() {
    return 'todo_item'
  }

  get view() {
    return {
      props: ['node', 'updateAttrs', 'editable'],
      methods: {
        onChange() {
          this.updateAttrs({
            done: !this.node.attrs.done,
          })
        },
      },
      template: `
        <li :data-type="node.type.name" :data-done="node.attrs.done.toString()">
          <span class="todo-checkbox" contenteditable="false" @click="onChange"></span>
          <div class="todo-content" ref="content" :contenteditable="editable.toString()"></div>
        </li>
      `,
    }
  }

  get schema() {
    return {
      attrs: {
        done: {
          default: false,
        },
      },
      draggable: true,
      content: 'paragraph',
      toDOM: node => {
        const { done } = node.attrs

        return [
          'li',
          {
            'data-type': this.name,
            'data-done': done.toString(),
          },
          ['span', { class: 'todo-checkbox', contenteditable: 'false' }],
          ['div', { class: 'todo-content' }, 0],
        ]
      },
      parseDOM: [{
        priority: 51,
        tag: `[data-type="${this.name}"]`,
        getAttrs: dom => ({
          done: dom.getAttribute('data-done') === 'true',
        }),
      }],
    }
  }

  keys({ type }) {
    return {
      Enter: splitToDefaultListItem(type),
      'Shift-Tab': liftListItem(type),
    }
  }

}
