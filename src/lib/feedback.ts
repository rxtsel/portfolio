import { haptic } from "@/lib/haptic"

type FeedbackType = "error" | "success" | "tap"

let audioContext: AudioContext | null = null

function getAudioContext() {
  if (audioContext) {
    return audioContext
  }

  const audioWindow = window as Window & { webkitAudioContext?: typeof AudioContext }
  const AudioContextConstructor = window.AudioContext ?? audioWindow.webkitAudioContext

  if (!AudioContextConstructor) {
    return null
  }

  audioContext = new AudioContextConstructor()

  return audioContext
}

function playTone(frequency: number, duration: number) {
  if (document.visibilityState !== "visible") {
    return
  }

  const context = getAudioContext()

  if (!context) {
    return
  }

  if (context.state === "suspended") {
    void context.resume()
  }

  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const startsAt = context.currentTime
  const endsAt = startsAt + duration

  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(frequency, startsAt)
  gain.gain.setValueAtTime(0.0001, startsAt)
  gain.gain.exponentialRampToValueAtTime(0.025, startsAt + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, endsAt)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(startsAt)
  oscillator.stop(endsAt)
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches
}

function play(type: FeedbackType = "tap") {
  if (prefersReducedMotion()) {
    return
  }

  if (type === "error") {
    if (isTouchDevice()) {
      haptic([30, 40, 30])
      return
    }

    playTone(180, 0.08)
    return
  }

  if (isTouchDevice()) {
    haptic(type === "success" ? 40 : 20)
    return
  }

  playTone(type === "success" ? 880 : 660, 0.05)
}

export const feedback = {
  click: () => play("tap"),
  error: () => play("error"),
  success: () => play("success"),
  toggle: (enabled: boolean) => play(enabled ? "success" : "tap"),
}
