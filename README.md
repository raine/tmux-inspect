# tmux-inspect

A library that simplifies inspecting objects during development using tmux
popups and jless.

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

const data = fetchSomeLargeJsonObject()
tmuxJsonPopup(data)
```

When the code executes, a tmux popup opens displaying `data` in a scrollable,
formatted UI powered by `jless`.

### API

#### `tmuxJsonPopup(obj: unknown)`

Opens a tmux popup window displaying the JSON object using jless.

#### `tmuxJsonWindow(obj: unknown)`

Opens a new tmux window displaying the JSON object using jless.

#### `tmuxJsonPopupAll(obj: unknown)`

Adds the object to a collection that will be displayed in a popup when the
process exits.

#### `tmuxJsonWindowAll(obj: unknown)`

Adds the object to a collection that will be displayed in a new window when the
process exits.

#### `tmuxInspectPopup(obj: unknown)`

Opens a tmux popup window displaying the object using Node.js's
`util.inspect()`.

Useful for inspecting non-JSON objects like functions or circular references.

#### `tmuxInspectWindow(obj: unknown)`

Opens a new tmux window displaying the object using Node.js's `util.inspect()`.

#### `tmuxInspectWindowAll(obj: unknown)`

Adds the object to a collection that will be displayed in a new window using
`util.inspect()` when the process exits.

#### `tmuxInspectPopupAll(obj: unknown)`

Adds the object to a collection that will be displayed in a popup using
`util.inspect()` when the process exits.
