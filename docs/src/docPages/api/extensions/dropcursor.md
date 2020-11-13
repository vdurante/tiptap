# Dropcursor
This extension loads the [ProseMirror Dropcursor plugin](https://github.com/ProseMirror/prosemirror-dropcursor) by Marijn Haverbeke, which shows a cursor at the drop position when something is dragged over the editor.

Note that tiptap is headless, but the dropcursor needs CSS for its appearance. The default CSS is added to the usage example below.

## Installation
```bash
# with npm
npm install @tiptap/extension-dropcursor

# with Yarn
yarn add @tiptap/extension-dropcursor
```

## Source code
[packages/extension-dropcursor/](https://github.com/ueberdosis/tiptap-next/blob/main/packages/extension-dropcursor/)

## Usage
<demo name="Extensions/Dropcursor" highlight="12,33" />
