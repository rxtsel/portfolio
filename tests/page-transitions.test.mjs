import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { URL } from "node:url"
import { runInNewContext } from "node:vm"

const script = readFileSync(new URL("../src/scripts/page-transitions.js", import.meta.url), "utf8")
const deferred = () => {
  let resolve, reject
  const promise = new Promise((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}

function setup(from = "/projects/", to = "/projects/xavel/", phase = "pageswap") {
  const events = new Map()
  const ready = deferred(),
    finished = deferred()
  const rect = { top: 160, bottom: 190, width: 100, height: 30 }
  const type = `${from}${to}`.includes("/blog/") ? "blog" : "project"
  const parts =
    type === "blog"
      ? ["title", "description", "categories", "date"]
      : ["title", "logo", "description", "source"]
  const elements = Object.fromEntries(
    parts.map((part) => [
      part,
      { style: { viewTransitionName: "" }, getAttribute: () => part, getBoundingClientRect: () => rect },
    ]),
  )
  const header = { style: { viewTransitionName: "" }, getBoundingClientRect: () => ({ bottom: 64 }) }
  const toolbar = { style: { viewTransitionName: "" } }
  const project = { querySelector: () => elements.title, querySelectorAll: () => Object.values(elements) }
  let missing = false,
    reduced = false,
    supported = true,
    skipped = false
  const transition = {
    types: new Set(),
    ready: ready.promise,
    finished: finished.promise,
    skipTransition: () => {
      skipped = true
    },
  }
  const context = {
    URL,
    location: { href: `https://rxtsel.dev${phase === "pageswap" ? from : to}` },
    innerHeight: 900,
    CSS: { supports: () => supported, escape: (value) => value },
    document: {
      getElementById: () => header,
      querySelector: (selector) =>
        selector === "[data-page-toolbar]"
          ? toolbar
          : !missing &&
              ["/projects/xavel/", "/es/proyectos/xavel/", "/blog/post/", "/es/blog/post/"].some(
                (path) => selector === `[data-${type}-path="${path}"]`,
              )
            ? project
            : null,
    },
    window: {
      navigation: { activation: { from: { url: `https://rxtsel.dev${from}` } } },
      matchMedia: () => ({ matches: reduced }),
      addEventListener: (name, handler) => events.set(name, handler),
    },
  }
  runInNewContext(script, context)
  return {
    elements,
    header,
    toolbar,
    rect,
    transition,
    ready,
    finished,
    fire: () =>
      events.get(phase)({
        viewTransition: transition,
        activation: { entry: { url: `https://rxtsel.dev${to}` } },
      }),
    get skipped() {
      return skipped
    },
    set missing(value) {
      missing = value
    },
    set reduced(value) {
      reduced = value
    },
    set supported(value) {
      supported = value
    },
  }
}

test("only the selected project's four parts and chrome get temporary names", async () => {
  const s = setup()
  s.fire()
  assert.equal(s.skipped, false)
  assert.equal(s.transition.types.has("project"), true)
  for (const [part, element] of Object.entries(s.elements)) {
    assert.equal(element.style.viewTransitionName, `project-${part}`)
  }
  assert.equal(s.header.style.viewTransitionName, "project-header")
  assert.equal(s.toolbar.style.viewTransitionName, "project-toolbar")
  s.finished.resolve()
  await s.finished.promise
  assert(Object.values(s.elements).every((e) => e.style.viewTransitionName === ""))
  assert.equal(s.header.style.viewTransitionName, "")
})

test("incoming names are cleaned after capture, including rejected transitions", async () => {
  for (const reject of [false, true]) {
    const s = setup("/projects/xavel/", "/projects/", "pagereveal")
    s.elements.title.style.viewTransitionName = "previous"
    s.fire()
    assert.equal(s.elements.title.style.viewTransitionName, "project-title")
    if (reject) {
      s.ready.reject(new Error("Transition skipped"))
    } else {
      s.ready.resolve()
    }
    await s.ready.promise.catch(() => {})
    assert.equal(s.elements.title.style.viewTransitionName, "previous")
    assert.equal(s.toolbar.style.viewTransitionName, "")
  }
})

test("unsupported, missing, reduced-motion or offscreen targets skip instead of flying across the page", () => {
  for (const change of [
    (s) => {
      s.supported = false
    },
    (s) => {
      s.transition.types = undefined
    },
    (s) => {
      s.missing = true
    },
    (s) => {
      s.reduced = true
    },
    (s) => {
      s.rect.top = 40
    },
    (s) => {
      s.rect.bottom = 1000
    },
    (s) => {
      s.rect.width = 0
    },
  ]) {
    const s = setup()
    change(s)
    s.fire()
    assert.equal(s.skipped, true)
    assert(Object.values(s.elements).every((e) => e.style.viewTransitionName === ""))
  }
})

test("unrelated navigations and locales do not activate project transition rules", () => {
  for (const [from, to] of [
    ["/blog/", "/projects/xavel/"],
    ["/projects/xavel/", "/projects/nvim/"],
    ["/projects/", "/es/proyectos/xavel/"],
    ["/projects/", "/projects/"],
  ]) {
    const s = setup(from, to)
    s.fire()
    assert.equal(s.skipped, false)
    assert.equal(s.transition.types.size, 0)
    assert.equal(s.elements.title.style.viewTransitionName, "")
  }
})

test("blog navigation uses the same temporary capture and cleanup in both locales and directions", async () => {
  for (const prefix of ["", "/es"]) {
    const index = `${prefix}/blog/`
    const post = `${index}post/`
    for (const phase of ["pageswap", "pagereveal"]) {
      const s = phase === "pageswap" ? setup(index, post, phase) : setup(post, index, phase)
      s.fire()
      assert.equal(s.skipped, false)
      assert.equal(s.transition.types.has("blog"), true)
      assert.equal(s.transition.types.has("project"), false)
      for (const [part, element] of Object.entries(s.elements)) {
        assert.equal(element.style.viewTransitionName, `blog-${part}`)
      }
      assert.equal(s.header.style.viewTransitionName, "blog-header")
      assert.equal(s.toolbar.style.viewTransitionName, "blog-toolbar")
      const captured = phase === "pageswap" ? s.finished : s.ready
      captured.resolve()
      await captured.promise
      assert(Object.values(s.elements).every((element) => element.style.viewTransitionName === ""))
    }
  }
})

test("offscreen blog titles skip the transition rather than crossing the topbar", () => {
  for (const phase of ["pageswap", "pagereveal"]) {
    const s =
      phase === "pageswap" ? setup("/blog/", "/blog/post/", phase) : setup("/blog/post/", "/blog/", phase)
    s.rect.top = -100
    s.fire()
    assert.equal(s.skipped, true)
    assert.equal(s.transition.types.size, 0)
  }
})

test("blog markup marks only post parts, not list cards or the Blog heading", () => {
  const read = (file) => readFileSync(new URL(`../src/components/${file}.astro`, import.meta.url), "utf8")
  const card = read("BlogPostCard")
  const post = read("BlogPostPage")
  const index = read("BlogIndexPage")
  const list = read("BlogPostList")
  assert.match(card, /data-blog-path=\{getBlogPostPath\(post\)\}/)
  assert.match(post, /data-blog-path=\{getBlogPostAlternateHref\(post\)\}/)
  for (const part of ["title", "description", "categories", "date"]) {
    assert.ok(card.includes(`data-blog-part="${part}"`))
    assert.ok(post.includes(`"${part}"`))
  }
  assert.match(post, /data-blog-part=\{!updatedDate \? "date" : undefined\}/)
  assert.match(post, /class="not-prose[^"]*w-fit[^"]*"\s*data-blog-part="categories"/)
  assert.doesNotMatch(card + post + index + list, /view-transition-name|backTransitionName=/)
})

test("handlers do no per-frame work or scroll restoration", () => {
  assert.doesNotMatch(script, /sessionStorage|requestAnimationFrame|addEventListener\("scroll"/)
  const styles = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8")
  assert.match(styles, /:root:active-view-transition-type\(project, blog\)/)
  assert.match(styles, /::view-transition-old\(root\)[\s\S]*display: none/)
})
