import { calculateDuration } from '@/utils/calculateDuration'

function updateDurations() {
  const nodes = document.querySelectorAll<HTMLTimeElement>('time.ts-duration')
  nodes.forEach((el) => {
    const startStr = el.getAttribute('data-start')
    const endStr = el.getAttribute('data-end')
    const locale = (el.getAttribute('data-locale') || 'es') as 'es' | 'en'
    if (!startStr) return

    const startDate = new Date(startStr)
    const endDate = endStr ? new Date(endStr) : undefined
    try {
      const text = calculateDuration({ startDate, endDate, locale })
      if (text && el.textContent !== text) el.textContent = text
    } catch {}
  })
}

// Montaje inicial
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateDurations)
} else {
  updateDurations()
}

// Navegación cliente (Astro)
window.addEventListener('astro:page-load', updateDurations)
window.addEventListener('astro:after-swap', updateDurations)
