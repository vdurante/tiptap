---
description: Useless extension, just adds <span> tags (required by other extensions though).
icon: palette-line
---

# TextStyle
[![Version](https://img.shields.io/npm/v/@tiptap/extension-text-style.svg?label=version)](https://www.npmjs.com/package/@tiptap/extension-text-style)
[![Downloads](https://img.shields.io/npm/dm/@tiptap/extension-text-style.svg)](https://npmcharts.com/compare/@tiptap/extension-text-style?minimal=true)

This mark renders a `<span>` HTML tag and enables you to add a list of styling related attributes, for example font-family, font-size, or color. The extension doesn’t add any styling attribute by default, but other extensions use it as the foundation, for example [`FontFamily`](/api/extensions/font-family) or [`Color`](/api/extensions/color).

## Installation
```bash
npm install @tiptap/extension-text-style
```

## Commands

### removeEmptyTextStyle()
Remove `<span>` tags without an inline style.

```js
editor.command.removeEmptyTextStyle()
```

## Source code
[packages/extension-text-style/](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-style/)

## Usage
https://embed.tiptap.dev/preview/Marks/TextStyle
