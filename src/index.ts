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

let tempFilePathWindowAll: string | null = null
let tempFilePathPopupAll: string | null = null

function handleCollectionDisplay(
  collection: unknown[],
  tempFilePath: string | null,
  tmuxCommand: string,
): void {
  if (collection.length > 0 && tempFilePath) {
    try {
      const json = JSON.stringify(collection)
      writeFileSync(tempFilePath, json)
      execSync(
        `tmux ${tmuxCommand} 'sh -c "jless ${tempFilePath}; rm -f ${tempFilePath}"'`,
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
      )
      handleCollectionDisplay(
        collectedPopupObjects,
        tempFilePathPopupAll,
        "popup -E",
      )
    })
    exitHandlerRegistered = true
  }
}

export function tmuxJsonWindowAll(obj: unknown): void {
  collectedWindowObjects.push(obj)
  if (!tempFilePathWindowAll) {
    tempFilePathWindowAll = createTempFile("tmux-json-window-all")
    setupExitHandlerIfNeeded()
  }
}

export function tmuxJsonPopupAll(obj: unknown): void {
  collectedPopupObjects.push(obj)
  if (!tempFilePathPopupAll) {
    tempFilePathPopupAll = createTempFile("tmux-json-popup-all")
    setupExitHandlerIfNeeded()
  }
}

function displayInTmux(obj: unknown, tmuxCommand: string): void {
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
