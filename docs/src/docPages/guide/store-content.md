# Store content

## toc

## Introduction
You can store your content as a JSON object or as a good old HTML string. Both work fine. And of course, you can pass both formats to the editor to restore your content.

You can store your content as JSON and restore the content from HTML, or the other way around. I don’t know why you would do that, but tiptap wouldn’t care.

## Option 1: JSON
JSON is probably easier to loop through, for example to look for a mention and it’s more like what tiptap uses under the hood. Anyway, if you want to use JSON to store the content we provide a method to retrieve the content as JSON:

```js
const json = editor.getJSON()
```

You can store that in your database (or send it to an API) and restore the document initially like that:

```js
new Editor({
  // …
  content: {
    "type": "document",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Example Text"
          }
        ]
      }
    ]
  },
})
```

Or if you need to wait for something, you can do it later through the editor instance:

```js
editor.setContent({
  "type": "document",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Example Text"
        }
      ]
    }
  ]
})
```

## Option 2: HTML
HTML can be easily rendered in other places, for example in emails and it’s wildly used, so it’s probably easier to switch the editor at some point. Anyway, every editor instance provides a method to get HTML from the current document:

```js
const html = editor.getHTML()
```

This can then be used to restore the document initially:

```js
new Editor({
  // …
  content: `<p>Example Text</p>`,
})
```

Or if you want to restore the content later (e. g. after an API call has finished), you can do that too:
```js
editor.commands.setContent(`<p>Example Text</p>`)
```

## Not an option: Markdown

Unfortunately, **tiptap doesn’t support Markdown as an input or output format**. We considered to add support for it, but there are a few limitations:

* HTML and JSON can both have deeply nested structures, Markdown can’t have those
* Tables are not part of the Markdown standard, and can’t easily be stored and restored from Markdown

You should really consider to work with HTML or JSON to store your content, they are perfectly fine for most use cases.

If you still think you need Markdown, [Nextcloud Text](https://github.com/nextcloud/text) uses tiptap 1 to work with Markdown. Their code is open source, so maybe you can learn from them.

That said, tiptap **does** support Markdown shortcuts to format your content. Try typing `**two asterisks**` to make your text bold for example.

## Generate HTML from ProseMirror JSON
If you need to render the content on the server side, for example to render a blog post which was written with tiptap, you’ll probably need a way to do just that without an actual editor instance.

That’s what `generateHTML()` is for. It’s a utility function that renders HTML without an actual editor instance. As an easy alternative, you can also use tiptap in a [read-only mode](/examples/read-only).

:::info Browser-only rendering
Import a lightweight implementation from `@tiptap/core` if you’re using the function in a browser context only.
:::

<demo name="Api/Schema/GenerateHTML" highlight="6,29-33"/>
