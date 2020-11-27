# Events

## toc

## Introduction
The editor fires a few different events that you can hook into. There are two ways to register event listeners:

## Option 1: Right-away
You can define your event listeners on a new editor instance right-away:

```js
const editor = new Editor({
  onInit() {
    // The editor is ready.
  },
  onUpdate() {
    // The content has changed.
  },
  onSelection() {
    // The selection has changed.
  },
  onTransaction({ transaction }) {
    // The editor state has changed.
  },
  onFocus({ event }) {
    // The editor is focused.
  },
  onBlur({ event }) {
    // The editor isn’t focused anymore.
  },
})
```

## Option 2: Later
Or you can register your event listeners on a running editor instance:

### Bind event listeners
```js
editor.on('init', () => {
  // The editor is ready.
}

editor.on('update', () => {
  // The content has changed.
}

editor.on('selection', () => {
  // The selection has changed.
}

editor.on('transaction', ({ transaction }) => {
  // The editor state has changed.
}

editor.on('focus', ({ event }) => {
  // The editor is focused.
}

editor.on('blur', ({ event }) => {
  // The editor isn’t focused anymore.
}
```

### Unbind event listeners
If you need to unbind those event listeners at some point, you should register your event listeners with `.on()` and unbind them with `.off()` then.

```js
const onUpdate = () => {
  // The content has changed.
}

// Bind …
editor.on('update', onUpdate)

// … and unbind.
editor.off('update', onUpdate)
```
