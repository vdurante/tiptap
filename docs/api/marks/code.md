---
description: Developers love to add some inline code to their texts.
icon: code-view
---

# Code
[![Version](https://img.shields.io/npm/v/@tiptap/extension-code.svg?label=version)](https://www.npmjs.com/package/@tiptap/extension-code)
[![Downloads](https://img.shields.io/npm/dm/@tiptap/extension-code.svg)](https://npmcharts.com/compare/@tiptap/extension-code?minimal=true)

The Code extensions enables you to use the `<code>` HTML tag in the editor. If you paste in text with `<code>` tags it will rendered accordingly.

Type something with <code>\`back-ticks around\`</code> and it will magically transform to `inline code` while you type.

## Installation
```bash
npm install @tiptap/extension-code
```

## Settings

### HTMLAttributes
Custom HTML attributes that should be added to the rendered HTML tag.

```js
Code.configure({
  HTMLAttributes: {
    class: 'my-custom-class',
  },
})
```

## Commands

### setCode()
Mark text as inline code.

```js
editor.commands.setCode()
```

### toggleCode()
Toggle inline code mark.

```js
editor.commands.toggleCode()
```

### unsetCode()
Remove inline code mark.

```js
editor.commands.unsetCode()
```

## Keyboard shortcuts
| Command      | Windows/Linux      | macOS          |
| ------------ | ------------------ | -------------- |
| toggleCode() | `Control`&nbsp;`E` | `Cmd`&nbsp;`E` |

## Source code
[packages/extension-code/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-code/)

## Usage
https://embed.tiptap.dev/preview/Marks/Code
