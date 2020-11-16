# Working with TypeScript

## toc

## Introduction
The whole tiptap is code base is written in TypeScript. If you haven’t heard of it or never used it, no worries. You don’t have to.

TypeScript extends JavaScript by adding types (hence the name). It adds new syntax, which doesn’t exist in plain JavaScript. It’s actually removed before running in the browser, but this step – the compilation – is important to find bugs early. It checks if you passe the right types of data to functions. For a big and complex project, that’s very valuable. It means we’ll get notified of lot of bugs, before shipping code to you.

Anyway, if you don’t use TypeScript in your project, that’s fine. You’ll still be able to use tiptap and even get a really nice autocomplete for the tiptap API (if your editor supports it, but most do).

If you’re using TypeScript in your project and want to extend tiptap, there are two things that are good to know.

## Options type
To extend or create default options for an extension, you’ll need to define a custom type, here is an example:

```js
import { Extension } from '@tiptap/core'

export interface CustomExtensionOptions {
  awesomeness: number,
}

const CustomExtension = Extension.create({
  defaultOptions: <CustomExtensionOptions>{
    awesomeness: 100,
  },
})
```

## Command type
The core package also exports a `Command` type, which needs to be added to all commands that you specify in your code. Here is an example:

```js
import { Command, Extension } from '@tiptap/core'

const CustomExtension = Extension.create({
  addCommands() {
    return {
      /**
       * Comments will be added to the autocomplete.
       */
      yourCommand: (): Command => ({ commands }) => {
        // …
      },
    }
  },
})
```

That’s basically it. We’re doing all the rest automatically.
