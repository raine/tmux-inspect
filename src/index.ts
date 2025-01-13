import { execSync } from "child_process"

import { writeFileSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { randomBytes } from "crypto"
import { inspect } from "util"

export function tmuxJsonWindow(obj: unknown): void {
  displayInTmux(obj, "new-window -d")
}

export function tmuxJsonPopup(obj: unknown): void {
  displayInTmux(obj, "popup -E")
}

export function tmuxInspectWindow(obj: unknown): void {
  displayInTmuxInspect(obj, "new-window -d")
}

export function tmuxInspectPopup(obj: unknown): void {
  displayInTmuxInspect(obj, "popup -E")
}

const collectedWindowObjects: unknown[] = []
const collectedPopupObjects: unknown[] = []
const collectedInspectWindowObjects: unknown[] = []
const collectedInspectPopupObjects: unknown[] = []

let tempFilePathWindowAll: string | null = null
let tempFilePathPopupAll: string | null = null
let tempFilePathInspectWindowAll: string | null = null
let tempFilePathInspectPopupAll: string | null = null

function handleCollectionDisplay(
  collection: unknown[],
  tempFilePath: string | null,
  tmuxCommand: string,
  viewerType: "jless" | "inspect",
): void {
  if (collection.length > 0 && tempFilePath) {
    try {
      const content =
        viewerType === "inspect"
          ? inspect(collection, {
              colors: true,
              depth: null,
              showHidden: false,
              compact: false,
            })
          : JSON.stringify(collection)
      writeFileSync(tempFilePath, content)
      const viewer = viewerType === "inspect" ? "less" : "jless"
      execSync(
        `tmux ${tmuxCommand} 'sh -c "${viewer} ${tempFilePath}; rm -f ${tempFilePath}"'`,
        { stdio: "inherit" },
      )
    } catch (error) {
      handleTmuxError(error, tempFilePath, tmuxCommand)
    }
  }
}

let exitHandlerRegistered = false

function setupExitHandlerIfNeeded(): void {
  if (!exitHandlerRegistered) {
    process.on("exit", () => {
      handleCollectionDisplay(
        collectedWindowObjects,
        tempFilePathWindowAll,
        "new-window -d",
        "jless",
      )
      handleCollectionDisplay(
        collectedPopupObjects,
        tempFilePathPopupAll,
        "popup -E",
        "jless",
      )
      handleCollectionDisplay(
        collectedInspectWindowObjects,
        tempFilePathInspectWindowAll,
        "new-window -d",
        "inspect",
      )
      handleCollectionDisplay(
        collectedInspectPopupObjects,
        tempFilePathInspectPopupAll,
        "popup -E",
        "inspect",
      )
    })
    exitHandlerRegistered = true
  }
}

export function tmuxJsonWindowAll(obj: unknown): void {
  if (!process.env.TMUX) return

  collectedWindowObjects.push(obj)
  if (!tempFilePathWindowAll) {
    tempFilePathWindowAll = createTempFile("tmux-json-window-all")
    setupExitHandlerIfNeeded()
  }
}

export function tmuxJsonPopupAll(obj: unknown): void {
  if (!process.env.TMUX) return

  collectedPopupObjects.push(obj)
  if (!tempFilePathPopupAll) {
    tempFilePathPopupAll = createTempFile("tmux-json-popup-all")
    setupExitHandlerIfNeeded()
  }
}

export function tmuxInspectWindowAll(obj: unknown): void {
  if (!process.env.TMUX) return

  collectedInspectWindowObjects.push(obj)
  if (!tempFilePathInspectWindowAll) {
    tempFilePathInspectWindowAll = createTempFile("tmux-inspect-window-all")
    setupExitHandlerIfNeeded()
  }
}

export function tmuxInspectPopupAll(obj: unknown): void {
  if (!process.env.TMUX) return

  collectedInspectPopupObjects.push(obj)
  if (!tempFilePathInspectPopupAll) {
    tempFilePathInspectPopupAll = createTempFile("tmux-inspect-popup-all")
    setupExitHandlerIfNeeded()
  }
}

function displayInTmux(obj: unknown, tmuxCommand: string): void {
  if (!process.env.TMUX) return
  const tempFilePath = createTempFile("tmux-json")

  try {
    const json = JSON.stringify(obj)
    writeFileSync(tempFilePath, json)
    execSync(
      `tmux ${tmuxCommand} 'sh -c "jless ${tempFilePath}; rm -f ${tempFilePath}"'`,
      { stdio: "inherit" },
    )
  } catch (error) {
    handleTmuxError(error, tempFilePath, tmuxCommand)
  }
}

function displayInTmuxInspect(obj: unknown, tmuxCommand: string): void {
  if (!process.env.TMUX) return
  const tempFilePath = createTempFile("tmux-inspect")

  try {
    const inspected = inspect(obj, {
      colors: true,
      depth: null,
      showHidden: false,
      compact: false,
    })
    writeFileSync(tempFilePath, inspected)
    const command = `less ${tempFilePath}; rm -f ${tempFilePath}`
    execSync(`tmux ${tmuxCommand} 'sh -c "${command}"'`, { stdio: "inherit" })
  } catch (error) {
    handleTmuxError(error, tempFilePath, tmuxCommand)
  }
}

function handleTmuxError(
  error: unknown,
  tempFilePath: string,
  context: string,
): void {
  console.error(`Error opening tmux JSON (${context}):`, error)
  try {
    execSync(`rm -f ${tempFilePath}`)
  } catch (cleanupError) {
    console.error("Error cleaning up temp file:", cleanupError)
  }
}

function createTempFile(prefix: string): string {
  return join(tmpdir(), `${prefix}-${randomBytes(4).toString("hex")}.json`)
}
