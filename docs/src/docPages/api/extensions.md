# Extensions

## toc

## Introduction
Extensions add new capabilities to tiptap. [Nodes](/api/nodes) and [marks](/api/marks) are rendered in HTML. Extensions can’t add to the schema, but can add functionality or change the behaviour of the editor.

## List of provided extensions
| Title                                                       | Default Extension | Source Code                                                                                            |
| ----------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------ |
| [CharacterCount](/api/extensions/character-count)           | –                 | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-character-count/)      |
| [Collaboration](/api/extensions/collaboration)              | –                 | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-collaboration/)        |
| [CollaborationCursor](/api/extensions/collaboration-cursor) | –                 | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-collaboration-cursor/) |
| [Dropcursor](/api/extensions/dropcursor)                    | Yes               | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-dropcursor/)           |
| [Focus](/api/extensions/focus)                              | –                 | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-focus/)                |
| [FontFamily](/api/extensions/font-family)                   | –                 | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-font-family/)          |
| [Gapcursor](/api/extensions/gapcursor)                      | Yes               | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-gapcursor/)            |
| [History](/api/extensions/history)                          | Yes               | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-history/)              |
| [TextAlign](/api/extensions/text-align)                     | –                 | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-text-align/)           |
| [Typography](/api/extensions/typography)                    | –                 | [GitHub](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-typography/)           |

You don’t have to use it, but we prepared a `@tiptap/starter-kit` which includes the most common extensions. See an example on [how to use `defaultExtensions()`](/examples/default).

## How extensions work
Although tiptap tries to hide most of the complexity of ProseMirror, it’s built on top of its APIs and we recommend you to read through the [ProseMirror Guide](https://ProseMirror.net/docs/guide/) for advanced usage. You’ll have a better understanding of how everything works under the hood and get more familiar with many terms and jargon used by tiptap.

Existing [nodes](/api/nodes), [marks](/api/marks) and [extensions](/api/extensions) can give you a good impression on how to approach your own extensions. To make it easier to switch between the documentation and the source code, we linked to the file on GitHub from every single extension documentation page.

We recommend to start with customizing existing extensions first, and create your own extensions with the gained knowledge later. That’s why all the below examples extend existing extensions, but all examples will work on newly created extensions aswell.

## Create a new extension
You’re free to create your own extensions for tiptap. Here is the boilerplate code that’s need to create and register your own extension:

```js
import { Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  // Your code here
})

const editor = new Editor({
  extensions: [
    // Register your custom extension with the editor.
    CustomExtension,
    // … and don’t forget all other extensions.
    Document,
    Paragraph,
    Text,
    // …
  ],
```

Learn [more about custom extensions in our guide](/guide/build-extensions).

### ProseMirror plugins
ProseMirror has a fantastic eco system with many amazing plugins. If you want to use one of them, you can register them with tiptap like that:

```js
import { history } from 'prosemirror-history'

const History = Extension.create({
  addProseMirrorPlugins() {
    return [
      history(),
      // …
    ]
  },
})
```
