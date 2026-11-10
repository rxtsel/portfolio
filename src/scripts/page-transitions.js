/* global CSS, document, innerHeight, location, URL, window */

;(() => {
  const detailRoute = /^(\/(?:projects|es\/proyectos|blog|es\/blog)\/)[^/]+\/$/
  const parts = new Set(["title", "logo", "description", "source", "categories", "date"])

  function prepare(from, to, transition, captured) {
    if (from.origin !== to.origin) {
      return
    }
    const incoming = detailRoute.exec(to.pathname)
    const outgoing = detailRoute.exec(from.pathname)
    const path =
      incoming && from.pathname === incoming[1]
        ? to.pathname
        : outgoing && to.pathname === outgoing[1]
          ? from.pathname
          : undefined
    if (!path) {
      return
    }

    const type = /^\/(?:es\/)?blog\//.test(path) ? "blog" : "project"
    if (
      !transition.types ||
      !CSS.supports(`selector(:active-view-transition-type(${type}))`) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      transition.skipTransition()
      return
    }

    const content = document.querySelector(`[data-${type}-path="${CSS.escape(path)}"]`)
    const title = content?.querySelector(`[data-${type}-part="title"]`)
    const rect = title?.getBoundingClientRect()
    const header = document.getElementById("header")
    const top = header?.getBoundingClientRect().bottom ?? 0
    if (!rect || !rect.width || !rect.height || rect.top < top || rect.bottom > innerHeight) {
      transition.skipTransition()
      return
    }

    transition.types.add(type)
    const entries = Array.from(content.querySelectorAll(`[data-${type}-part]`))
      .filter((element) => parts.has(element.getAttribute(`data-${type}-part`)))
      .map((element) => [element, `${type}-${element.getAttribute(`data-${type}-part`)}`])
    entries.push(
      [header, `${type}-header`],
      [document.querySelector("[data-page-toolbar]"), `${type}-toolbar`],
    )

    const restore = []
    for (const [element, name] of entries) {
      if (!element) {
        continue
      }
      restore.push([element, element.style.viewTransitionName, name])
      element.style.viewTransitionName = name
    }
    const cleanup = () => {
      for (const [element, previous, name] of restore) {
        if (element.style.viewTransitionName === name) {
          element.style.viewTransitionName = previous
        }
      }
    }
    void captured.then(cleanup, cleanup)
  }

  window.addEventListener("pageswap", (event) => {
    const destination = event.activation?.entry?.url
    if (event.viewTransition && destination) {
      prepare(
        new URL(location.href),
        new URL(destination),
        event.viewTransition,
        event.viewTransition.finished,
      )
    }
  })

  window.addEventListener("pagereveal", (event) => {
    const source = window.navigation?.activation?.from?.url
    if (event.viewTransition && source) {
      prepare(new URL(source), new URL(location.href), event.viewTransition, event.viewTransition.ready)
    }
  })
})()
