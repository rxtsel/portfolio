/* global document, window */

;(function () {
  const currentScript = document.currentScript
  const containerId = currentScript && currentScript.dataset.containerId

  if (!containerId) {
    return
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" })

  const script = document.createElement("script")

  script.async = true
  script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(containerId)
  currentScript.parentNode.insertBefore(script, currentScript.nextSibling)
})()
