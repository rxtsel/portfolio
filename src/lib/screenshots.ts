export type ScreenshotOrientation = "vertical" | "horizontal"

export function getScreenshotPlaceholderCount(count: number, orientation: ScreenshotOrientation) {
  if (orientation === "horizontal" && count === 1) return 0
  return Math.max(0, (orientation === "vertical" ? 4 : 2) - count)
}
