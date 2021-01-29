# Commands

## toc

## Introduction
The editor provides a ton of commands to programmtically add or change content or alter the selection. If you want to build your own editor you definitely want to learn more about them.

## Execute a command
All available commands are accessible through an editor instance. Let’s say you want to make text bold when a user clicks on a button. That’s how that would look like:

```js
editor.commands.setBold()
```

While that’s perfectly fine and does make the selected bold, you’d likely want to change multiple commands in one run. Let’s have a look at how that works.

### Chain commands
Most commands can be combined to one call. That’s shorter than separate function calls in most cases. Here is an example to make the selected text bold:

```js
editor
  .chain()
  .focus()
  .toggleBold()
  .run()
```

The `.chain()` is required to start a new chain and the `.run()` is needed to actually execute all the commands in between.

In the example above two different commands are executed at once. When a user clicks on a button outside of the content, the editor isn’t in focus anymore. That’s why you probably want to add a `.focus()` call to most of your commands. It brings back the focus to the editor, so the user can continue to type.

All chained commands are kind of queued up. They are combined to one single transaction. That means, the content is only updated once, also the `update` event is only triggered once.

### Inline commands
In some cases, it’s helpful to put some more logic in a command. That’s why you can execute commands in commands. I know, that sounds crazy, but let’s look at an example:

```js
editor
  .chain()
  .focus()
  .command(({ tr }) => {
    // manipulate the transaction
    tr.insertText('hey, that’s cool!')

    return true
  })
  .run()
```

### Dry run for commands
Sometimes, you don’t want to actually run the commands, but only know if it would be possible to run commands, for example to show or hide buttons in a menu. That’s what we added `.can()` for. Everything coming after this method will be executed, without applying the changes to the document:

```js
editor
  .can()
  .toggleBold()
```

And you can use it together with `.chain()`, too. Here is an example which checks if it’s possible to apply all the commands:

```js
editor
  .can()
  .chain()
  .toggleBold()
  .toggleItalic()
  .run()
```

Both calls would return `true` if it’s possible to apply the commands, and `false` in case it’s not.

In order to make that work with your custom commands, don’t forget to return `true` or `false`.

For some of your own commands, you probably want to work with the raw [transaction](/api/concept). To make them work with `.can()` you should check if the transaction should be dispatched. Here is how we do that within `.insertText()`:

```js
export default (value: string): Command => ({ tr, dispatch }) => {
  if (dispatch) {
    tr.insertText(value)
  }

  return true
}
```

If you’re just wrapping another tiptap command, you don’t need to check that, we’ll do it for you.

```js
bold: (): Command => ({ commands }) => {
  return commands.toggleMark('bold')
},
```

If you’re just wrapping a ProseMirror command, you’ll need to pass `dispatch` anyway. Then there’s also no need to check it:

```js
export default (typeOrName: string | NodeType): Command => ({ state, dispatch }) => {
  const type = getNodeType(typeOrName, state.schema)

  return liftListItem(type)(state, dispatch)
}
```

### Try commands
If you want to run a list of commands, but want only the first successful command to be applied, you can do this with the `.first()` method. This method runs one command after the other and stops at the first which returns `true`.

For example, the backspace key tries to undo an input rule first. If that was successful, it stops there. If no input rule has been applied and thus can’t be reverted, it runs the next command and deletes the selection, if there is one. Here is the simplified example:

```js
editor.first(({ commands }) => [
  () => commands.undoInputRule(),
  () => commands.deleteSelection(),
  // …
])
```

Inside of commands you can do the same thing like that:

```js
commands.first([
  () => commands.undoInputRule(),
  () => commands.deleteSelection(),
  // …
])
```

## List of commands
Have a look at all of the core commands listed below. They should give you a good first impression of what’s possible.

### Content
| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| .clearContent() | Clear the whole document.                        |
| .insertHTML()   | Insert a string of HTML at the current position. |
| .insertText()   | Insert a string of text at the current position. |
| .setContent()   | Replace the whole document with new content.     |

### Nodes & Marks
| Command                 | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| .clearNodes()           | Normalize nodes to a simple paragraph.                    |
| .createParagraphNear()  | Create a paragraph nearby.                                |
| .exitCode()             | Exit from a code block.                                   |
| .extendMarkRange()      | Extends the text selection to the current mark.           |
| .joinBackward()         | Join two nodes backward.                                  |
| .joinForward()          | Join two nodes forward.                                   |
| .lift()                 | Removes an existing wrap.                                 |
| .liftEmptyBlock()       | Lift block if empty.                                      |
| .newlineInCode()        | Add a newline character in code.                          |
| .replace()              | Replaces text with a node.                                |
| .replaceRange()         | Replaces text with a node within a range.                 |
| .resetNodeAttributes()  | Resets all node attributes to the default value.          |
| .selectParentNode()     | Select the parent node.                                   |
| .setMark()              | Add a mark with new attributes.                           |
| .setNode()              | Replace a given range with a node.                        |
| .splitBlock()           | Forks a new node from an existing node.                   |
| .toggleMark()           | Toggle a mark on and off.                                 |
| .toggleNode()           | Toggle a node with another node.                          |
| .toggleWrap()           | Wraps nodes in another node, or removes an existing wrap. |
| .undoInputRule()        | Undo an input rule.                                       |
| .unsetAllMarks()        | Remove all marks in the current selection.                |
| .unsetMark()            | Remove a mark in the current selection.                   |
| .updateNodeAttributes() | Update attributes of a node.                              |

### Lists
| Command          | Description                                 |
| ---------------- | ------------------------------------------- |
| .liftListItem()  | Lift the list item into a wrapping list.    |
| .sinkListItem()  | Sink the list item down into an inner list. |
| .splitListItem() | Splits one list item into two list items.   |
| .toggleList()    | Toggle between different list types.        |
| .wrapInList()    | Wrap a node in a list.                      |

### Selection
| Command               | Description                             |
| --------------------- | --------------------------------------- |
| .blur()               | Removes focus from the editor.          |
| .deleteRange()        | Delete a given range.                   |
| .deleteSelection()    | Delete the selection, if there is one.  |
| .focus()              | Focus the editor at the given position. |
| .scrollIntoView()     | Scroll the selection into view.         |
| .selectAll()          | Select the whole document.              |
| .selectNodeBackward() | Select a node backward.                 |
| .selectNodeForward()  | Select a node forward.                  |
| .selectParentNode()   | Select the parent node.                 |

## Add your own commands
All extensions can add additional commands (and most do), check out the specific [documentation for the provided nodes](/api/nodes), [marks](/api/marks), and [extensions](/api/extensions) to learn more about those.

Of course, you can [add your custom extensions](/guide/build-extensions) with custom commands aswell.
