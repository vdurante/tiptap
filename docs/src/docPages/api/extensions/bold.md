# Bold
Use this extension to render text in **bold**. If you pass `<strong>`, `<b>` tags, or text with inline `style` attributes setting the `font-weight` CSS rule in the editor’s initial content, they all will be rendered accordingly.

Type `**two asterisks**` or `__two underlines__` and it will magically transform to **bold** text while you type.

::: warning Restrictions
The extension will generate the corresponding `<strong>` HTML tags when reading contents of the `Editor` instance. All text marked bold, regardless of the method will be normalized to `<strong>` HTML tags.
:::

## Installation
```bash
# with npm
npm install @tiptap/extension-bold

# with Yarn
yarn add @tiptap/extension-bold
```

## Settings
| Option | Type   | Default | Description                                  |
| ------ | ------ | ------- | -------------------------------------------- |
| class  | string | –       | Add a custom class to the rendered HTML tag. |

## Commands
| Command | Options | Description     |
| ------- | ------- | --------------- |
| bold    | —       | Mark text bold. |

## Keyboard shortcuts
* Windows/Linux: `Control`&nbsp;`B`
* macOS: `Cmd`&nbsp;`B`

## Source code
[packages/extension-bold/](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-bold/)

## Usage
<demo name="Extensions/Bold" highlight="3-5,17,36" />
