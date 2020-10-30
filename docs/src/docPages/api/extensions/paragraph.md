# Paragraph
Yes, the schema is very strict. Without this extension you won’t even be able to use paragraphs in the editor.

:::warning Breaking Change from 1.x → 2.x
Tiptap 1 tried to hide that node from you, but it has always been there. You have to explicitly import it from now on (or use `defaultExtensions()`).
:::

## Installation
```bash
# with npm
npm install @tiptap/extension-paragraph

# with Yarn
yarn add @tiptap/extension-paragraph
```

## Settings
| Option | Type   | Default | Description                                  |
| ------ | ------ | ------- | -------------------------------------------- |
| class  | string | –       | Add a custom class to the rendered HTML tag. |

## Commands
| Command   | Options | Description                                  |
| --------- | ------- | -------------------------------------------- |
| paragraph | —       | Transforms all selected nodes to paragraphs. |

## Keyboard shortcuts
* Windows & Linux: `Control`&nbsp;`Alt`&nbsp;`0`
* macOS: `Cmd`&nbsp;`Alt`&nbsp;`0`

## Source code
[packages/extension-paragraph/](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-paragraph/)

## Usage
<demo name="Extensions/Paragraph" highlight="11,29" />
