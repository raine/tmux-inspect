# tmux-inspect

A Node.js library for inspecting objects during development using tmux popups
and jless.

![demo](https://github.com/user-attachments/assets/cb6769af-ad02-4508-922c-45f8132d0c86)

## install

```sh
$ npm install --save-dev tmux-inspect
```

### requirements

- [tmux](https://github.com/tmux/tmux) (duh)
- [jless](https://jless.io/)

## usage

### basic example

```ts
import { tmuxJsonPopup } from "tmux-inspect"

const data = await fetchData()
tmuxJsonPopup(data)
```

When the code executes, a tmux popup opens displaying `data` in a scrollable,
formatted UI powered by `jless`.

### API

#### `tmuxJsonPopup(obj: unknown)`

Opens a tmux popup window displaying the given object using jless. The object is
serialized to JSON with `JSON.serialize`. Note that this call blocks program
execution until the popup is closed.

#### `tmuxJsonWindow(obj: unknown)`

Opens a new tmux window displaying the given object using jless. The object is
serialized to JSON with `JSON.serialize`.

#### `tmuxJsonPopupAll(obj: unknown)`

Similar to `tmuxJsonPopup`, but opening of the popup is deferred to process
exit. Multiple calls to this function will collect all objects and display them
together in a single popup when the process terminates.

#### `tmuxJsonWindowAll(obj: unknown)`

Similar to `tmuxJsonWindow`, but opening of the window is deferred to process
exit. Multiple calls to this function will collect all objects and display them
together in a single popup when the process terminates.

#### `tmuxInspectPopup(obj: unknown)`

Opens a tmux popup window displaying the object using Node.js's
`util.inspect()`.

Useful for inspecting objects that contain values that cannot be serialized to
JSON.

#### `tmuxInspectWindow(obj: unknown)`

Opens a new tmux window displaying the object using Node.js's `util.inspect()`.

#### `tmuxInspectWindowAll(obj: unknown)`

Adds the object to a collection that will be displayed in a new window using
`util.inspect()` when the process exits.

#### `tmuxInspectPopupAll(obj: unknown)`

Adds the object to a collection that will be displayed in a popup using
`util.inspect()` when the process exits.
