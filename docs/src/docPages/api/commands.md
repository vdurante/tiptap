# Commands

## toc

## Introduction
The editor provides a ton of commands to programmtically add or change content or alter the selection. If you want to build your own editor you definitely want to learn more about them.

## Execute a command
All available commands are accessible through an editor instance. Let’s say you want to make text bold when a user clicks on a button. That’s how that would look like:

```js
editor.commands.toggleBold()
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

### Try commands
If you want to run a list of commands, but want only the first successful command to be applied, you can do this with the `.try()` method. This method runs one command after the other and stops at the first which returns `true`.

For example, the backspace key tries to undo an input rule first. If that was successful, it stops there. If no input rule has been applied and thus can’t be reverted, it runs the next command and deletes the selection, if there is one. Here is the simplified example:

```js
editor.try(({ commands }) => [
  () => commands.undoInputRule(),
  () => commands.deleteSelection(),
  // …
])
```

Inside of commands you can do the same thing like that:

```js
commands.try([
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
| .extendMarkRange()      | Extends the text selection to the current mark.           |
| .removeMark()           | Remove a mark in the current selection.                   |
| .removeMarks()          | Remove all marks in the current selection.                |
| .removeMarks()          | Remove all marks in the current selection.                |
| .resetNodeAttributes()  | Resets all node attributes to the default value.          |
| .selectParentNode()     | Select the parent node.                                   |
| .setBlockType()         | Replace a given range with a node.                        |
| .splitBlock()           | Forks a new node from an existing node.                   |
| .toggleBlockType()      | Toggle a node with another node.                          |
| .toggleMark()           | Toggle a mark on and off.                                 |
| .toggleWrap()           | Wraps nodes in another node, or removes an existing wrap. |
| .updateMarkAttributes() | Update a mark with new attributes.                        |
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
| Command            | Description                             |
| ------------------ | --------------------------------------- |
| .blur()            | Removes focus from the editor.          |
| .deleteSelection() | Delete the selection, if there is one.  |
| .focus()           | Focus the editor at the given position. |
| .scrollIntoView()  | Scroll the selection into view.         |
| .selectAll()       | Select the whole document.              |

## Add your own commands
All extensions can add additional commands (and most do), check out the specific [documentation for the provided nodes](/api/nodes), [marks](/api/marks), and [extensions](/api/extensions) to learn more about those.

Of course, you can [add your custom extensions](/guide/build-custom-extensions) with custom commands aswell.
