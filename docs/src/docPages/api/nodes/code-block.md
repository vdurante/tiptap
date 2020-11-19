# CodeBlock
With the CodeBlock extension you can add fenced code blocks to your documents. It’ll wrap the code in `<pre>` and `<code>` HTML tags.

Type <code>&grave;&grave;&grave;&nbsp;</code> (three backticks and a space) or <code>&Tilde;&Tilde;&Tilde;&nbsp;</code> (three tildes and a space) and a code block is instantly added for you. You can even specify the language, try writing <code>&grave;&grave;&grave;css&nbsp;</code>. That should add a `language-css` class to the `<code>`-tag.

::: warning Restrictions
The CodeBlock extension doesn’t come with styling and has no syntax highlighting built-in. It’s on our roadmap though.
:::

## Installation
```bash
# with npm
npm install @tiptap/extension-code-block

# with Yarn
yarn add @tiptap/extension-code-block
```

## Settings
| Option              | Type     | Default       | Description                                                           |
| ------------------- | -------- | ------------- | --------------------------------------------------------------------- |
| HTMLAttributes      | `Object` | `{}`          | Custom HTML attributes that should be added to the rendered HTML tag. |
| languageClassPrefix | `String` | `'language-'` | Adds a prefix to language classes that are applied to code tags.      |

## Commands
| Command   | Parameters | Description                   |
| --------- | ---------- | ----------------------------- |
| codeBlock | —          | Wrap content in a code block. |

## Keyboard shortcuts
* Windows/Linux: `Control`&nbsp;`Alt`&nbsp;`C`
* macOS: `Cmd`&nbsp;`Alt`&nbsp;`C`

## Source code
[packages/extension-code-block/](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-code-block/)

## Usage
<demo name="Nodes/CodeBlock" highlight="3-5,17,36" />
