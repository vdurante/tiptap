# Italic
Use this extension to render text in *italic*. If you pass `<em>`, `<i>` tags, or text with inline `style` attributes setting `font-style: italic` in the editor’s initial content, they all will be rendered accordingly.

Type `*one asterisk*` or `_one underline_` and it will magically transform to *italic* text while you type.

::: warning Restrictions
The extension will generate the corresponding `<em>` HTML tags when reading contents of the `Editor` instance. All text marked italic, regardless of the method will be normalized to `<em>` HTML tags.
:::

## Installation
```bash
# with npm
npm install @tiptap/extension-italic

# with Yarn
yarn add @tiptap/extension-italic
```

## Settings
| Option         | Type     | Default | Description                                                           |
| -------------- | -------- | ------- | --------------------------------------------------------------------- |
| HTMLAttributes | `Object` | `{}`    | Custom HTML attributes that should be added to the rendered HTML tag. |

## Commands
| Command      | Parameters | Description          |
| ------------ | ---------- | -------------------- |
| setItalic    | —          | Mark text as italic. |
| toggleItalic | —          | Toggle italic mark.  |
| unsetItalic  | —          | Remove italic mark.  |


## Keyboard shortcuts
* Windows/Linux: `Control`&nbsp;`I`
* macOS: `Cmd`&nbsp;`I`

## Source code
[packages/extension-italic/](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-italic/)

## Usage
<demo name="Marks/Italic" highlight="3-5,17,36" />
