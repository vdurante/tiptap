# Store content

## toc

## Introduction
You can store your content as a JSON object or as a good old HTML string. Both work fine. And of course, you can pass both formats to the editor to restore your content. Here is an interactive example, that exports the content as HTML and JSON when the document is changed:

## Export

### Option 1: JSON
JSON is probably easier to loop through, for example to look for a mention and it’s more like what tiptap uses under the hood. Anyway, if you want to use JSON to store the content we provide a method to retrieve the content as JSON:

```js
const json = editor.getJSON()
```

You can store that in your database (or send it to an API) and restore the document initially like that:

```js
new Editor({
  content: {
    "type": "document",
    "content": [
      // …
    ]
  },
})
```

Or if you need to wait for something, you can do it later through the editor instance:

```js
editor.setContent({
  "type": "document",
  "content": [
    // …
  ]
})
```

Here is an interactive example where you can see that in action:

<demo name="Guide/StoreContent/ExportJSON" :show-source="false"/>

### Option 2: HTML
HTML can be easily rendered in other places, for example in emails and it’s wildly used, so it’s probably easier to switch the editor at some point. Anyway, every editor instance provides a method to get HTML from the current document:

```js
const html = editor.getHTML()
```

This can then be used to restore the document initially:

```js
new Editor({
  content: `<p>Example Text</p>`,
})
```

Or if you want to restore the content later (e. g. after an API call has finished), you can do that too:
```js
editor.commands.setContent(`<p>Example Text</p>`)
```

Use this interactive example to fiddle around:

<demo name="Guide/StoreContent/ExportHTML" :show-source="false"/>

### Not an option: Markdown
Unfortunately, **tiptap doesn’t support Markdown as an input or output format**. We considered to add support for it, but those are the reasons why we decided to not do it:

* Both, HTML and JSON, can have deeply nested structures, Markdown is flat.
* There are enough packages to convert HTML to Markdown and vice-versa.
* Markdown standards vary.

You should really consider to work with HTML or JSON to store your content, they are perfectly fine for most use cases.

If you still think you need Markdown, ProseMirror has an [example on how to deal with Markdown](https://prosemirror.net/examples/markdown/) and [Nextcloud Text](https://github.com/nextcloud/text) uses tiptap 1 to work with Markdown. Maybe you can learn from them.

That said, tiptap does support [Markdown shortcuts](/examples/markdown-shortcuts) to format your content.

## Listening for changes
If you want to continuously store the updated content while people write, you can [hook into events](/api/events). Here is an example how that could look like:

```js
const editor = new Editor({
  // intial content
  content: `<p>Example Content</p>`,

  // triggered on every change
  onUpdate() {
    const json = this.getJSON()
    // send the content to an API here
  },
})
```

## Rendering

### Option 1: Read-only instance of tiptap
To render the saved content, set the editor to read-only. That’s how you can achieve the exact same rendering as it’s in the editor, without duplicating your CSS and other code.

<demo name="Guide/StoreContent/ReadOnly" highlight="3-6,22,28,41-47" />

### Option 2: Generate HTML from ProseMirror JSON
If you need to render the content on the server side, for example to generate the HTML for a blog post which has been written in tiptap, you’ll probably want to do just that without an actual editor instance.

That’s what the `generateHTML()` is for. It’s a helper function which renders HTML without an actual editor instance.

:::info Browser-only rendering
Import a lightweight implementation of `generateHTML()` from `@tiptap/core` if you’re using the function in a browser context only.
:::

<demo name="Api/Schema/GenerateHTML" highlight="6,43-48"/>
