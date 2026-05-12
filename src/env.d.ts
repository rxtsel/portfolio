declare function haptic(pattern?: number | number[]): void

interface Window {
  theme?: {
    apply(theme?: ThemeMode): void
    set(theme: ThemeMode): void
  }
}
