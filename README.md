# tmux-json-inspect

A developer tool that simplifies inspecting objects during runtime using tmux.

The killer feature: View objects in a proper viewer (`jless`) with syntax
highlighting, folding, and search, through a convenient tmux (popup) window.

## install

```sh
$ npm install --save-dev tmux-json-inspect
```

### requirements

- tmux (duh)
- [jless](https://jless.io/)

## usage

```ts
import { tmuxJsonPopup } from "tmux-json-inspect"

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
`util.inspect()`. Useful for inspecting non-JSON objects like functions or
circular references.

#### `tmuxInspectWindow(obj: unknown)`

Opens a new tmux window displaying the object using Node.js's `util.inspect()`.

#### `tmuxInspectWindowAll(obj: unknown)`

Adds the object to a collection that will be displayed in a new window using
`util.inspect()` when the process exits.

#### `tmuxInspectPopupAll(obj: unknown)`

Adds the object to a collection that will be displayed in a popup using
`util.inspect()` when the process exits.
