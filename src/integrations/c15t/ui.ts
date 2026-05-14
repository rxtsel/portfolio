import type { AllConsentNames, ConsentStoreState, ConsentType, Translations } from "c15t"

type ConsentStore = {
  getState(): ConsentStoreState
  subscribe(listener: (state: ConsentStoreState) => void): () => void
}

const CATEGORY_ORDER: AllConsentNames[] = ["necessary", "measurement", "marketing"]
const C15T_ICON_URL = new URL("../../assets/logos/c15t.svg", import.meta.url).href
const BANNER_TITLE_ID = "c15t-banner-title"
const BANNER_DESCRIPTION_ID = "c15t-banner-description"
const DIALOG_TITLE_ID = "c15t-dialog-title"
const DIALOG_DESCRIPTION_ID = "c15t-dialog-description"

const FALLBACK_COPY = {
  acceptAll: "Accept all",
  customize: "Manage preferences",
  dialogDescription: "Choose which optional cookies and trackers may run on this site.",
  dialogTitle: "Privacy preferences",
  rejectAll: "Reject all",
  save: "Save preferences",
  bannerDescription: "We use cookies to measure traffic and deliver advertising where allowed.",
  bannerTitle: "We value your privacy",
}

export function mountConsentUI(consentStore: ConsentStore): void {
  let root = getConsentRoot()

  const render = () => renderConsentUI(root, consentStore)
  const handlePageSwap = () => {
    root = getConsentRoot()
    injectConsentStyles()
    render()
  }

  injectConsentStyles()
  document.addEventListener("astro:after-swap", handlePageSwap)

  render()
  consentStore.subscribe(render)
}

function getConsentRoot(): HTMLElement {
  const existingRoot = document.getElementById("c15t-consent-ui")

  if (existingRoot) {
    return existingRoot
  }

  const root = document.createElement("div")
  root.id = "c15t-consent-ui"
  document.body.append(root)

  return root
}

function renderConsentUI(root: HTMLElement, consentStore: ConsentStore): void {
  const state = consentStore.getState()
  const translations = getTranslations(state)

  root.replaceChildren()

  if (state.activeUI === "banner") {
    root.append(createBanner(consentStore, translations))
    return
  }

  if (state.activeUI === "dialog") {
    root.append(createDialogSurface(consentStore, translations))
    return
  }

  if (!state.hasFetchedBanner) {
    return
  }

  if (state.locationInfo?.jurisdiction === "NONE") {
    return
  }

  root.append(createTrigger(consentStore, translations))
}

function createBanner(consentStore: ConsentStore, translations: Translations): HTMLElement {
  const state = consentStore.getState()
  const banner = document.createElement("aside")
  banner.className = "c15t-card c15t-banner"
  banner.setAttribute("role", "dialog")
  banner.setAttribute("aria-labelledby", BANNER_TITLE_ID)
  banner.setAttribute("aria-describedby", BANNER_DESCRIPTION_ID)

  const content = document.createElement("div")
  content.className = "c15t-content"

  const title = document.createElement("h2")
  title.id = BANNER_TITLE_ID
  title.className = "c15t-title"
  title.textContent = text(translations.cookieBanner.title, FALLBACK_COPY.bannerTitle)

  const description = document.createElement("p")
  description.id = BANNER_DESCRIPTION_ID
  description.className = "c15t-description"
  description.textContent = text(translations.cookieBanner.description, FALLBACK_COPY.bannerDescription)

  const meta = document.createElement("p")
  meta.className = "c15t-meta"
  meta.textContent = state.locationInfo
    ? `${state.locationInfo.jurisdiction} · ${state.locationInfo.countryCode ?? ""}`.trim()
    : ""

  content.append(title, description)

  if (meta.textContent) {
    content.append(meta)
  }

  const actions = document.createElement("div")
  actions.className = "c15t-actions"
  const secondaryActions = document.createElement("div")
  secondaryActions.className = "c15t-secondary-actions"
  secondaryActions.append(
    createButton(text(translations.common.rejectAll, FALLBACK_COPY.rejectAll), "secondary", () => {
      void consentStore.getState().saveConsents("necessary", { uiSource: "banner" })
    }),
    createButton(text(translations.common.acceptAll, FALLBACK_COPY.acceptAll), "secondary", () => {
      void consentStore.getState().saveConsents("all", { uiSource: "banner" })
    }),
  )
  actions.append(
    secondaryActions,
    createButton(text(translations.common.customize, FALLBACK_COPY.customize), "primary", () => {
      consentStore.getState().setActiveUI("dialog")
    }),
  )

  banner.append(content, actions)

  return banner
}

function createDialogSurface(consentStore: ConsentStore, translations: Translations): HTMLElement {
  const surface = document.createElement("div")
  surface.className = "c15t-scrim"

  surface.append(createDialog(consentStore, translations))

  return surface
}

function createDialog(consentStore: ConsentStore, translations: Translations): HTMLElement {
  const state = consentStore.getState()
  const dialog = document.createElement("aside")
  dialog.className = "c15t-card c15t-dialog"
  dialog.setAttribute("role", "dialog")
  dialog.setAttribute("aria-labelledby", DIALOG_TITLE_ID)
  dialog.setAttribute("aria-describedby", DIALOG_DESCRIPTION_ID)

  const title = document.createElement("h2")
  title.id = DIALOG_TITLE_ID
  title.className = "c15t-title"
  title.textContent = text(translations.consentManagerDialog.title, FALLBACK_COPY.dialogTitle)

  const description = document.createElement("p")
  description.id = DIALOG_DESCRIPTION_ID
  description.className = "c15t-description"
  description.textContent = text(
    translations.consentManagerDialog.description,
    FALLBACK_COPY.dialogDescription,
  )

  const list = document.createElement("div")
  list.className = "c15t-category-list"

  for (const category of CATEGORY_ORDER) {
    if (!state.consentCategories.includes(category)) {
      continue
    }

    list.append(createCategoryToggle(consentStore, translations, category, state.consentTypes))
  }

  const actions = document.createElement("div")
  actions.className = "c15t-actions"
  const secondaryActions = document.createElement("div")
  secondaryActions.className = "c15t-secondary-actions"
  secondaryActions.append(
    createButton(text(translations.common.rejectAll, FALLBACK_COPY.rejectAll), "secondary", () => {
      void consentStore.getState().saveConsents("necessary", { uiSource: "dialog" })
    }),
    createButton(text(translations.common.acceptAll, FALLBACK_COPY.acceptAll), "secondary", () => {
      void consentStore.getState().saveConsents("all", { uiSource: "dialog" })
    }),
  )
  actions.append(
    secondaryActions,
    createButton(text(translations.common.save, FALLBACK_COPY.save), "primary", () => {
      void consentStore.getState().saveConsents("custom", { uiSource: "dialog" })
    }),
  )

  dialog.append(title, description, list, actions)

  return dialog
}

function createTrigger(consentStore: ConsentStore, translations: Translations): HTMLElement {
  const label = text(translations.common.customize, FALLBACK_COPY.customize)
  const trigger = document.createElement("button")
  const icon = document.createElement("span")

  trigger.className = "c15t-button c15t-button-secondary c15t-trigger"
  trigger.type = "button"
  trigger.title = label
  trigger.setAttribute("aria-label", label)
  trigger.addEventListener("click", () => {
    consentStore.getState().setActiveUI("dialog", { force: true })
  })

  icon.className = "c15t-trigger-icon"
  icon.setAttribute("aria-hidden", "true")
  icon.style.setProperty("mask", `url("${C15T_ICON_URL}") center / contain no-repeat`)
  icon.style.setProperty("-webkit-mask", `url("${C15T_ICON_URL}") center / contain no-repeat`)
  trigger.append(icon)

  return trigger
}

function createCategoryToggle(
  consentStore: ConsentStore,
  translations: Translations,
  category: AllConsentNames,
  consentTypes: ConsentType[],
): HTMLElement {
  const state = consentStore.getState()
  const consentType = consentTypes.find((type) => type.name === category)
  const translatedType = translations.consentTypes[category]
  const label = document.createElement("label")
  label.className = "c15t-category"

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.checked = state.selectedConsents[category] ?? state.consents[category] ?? false
  checkbox.disabled = category === "necessary" || Boolean(consentType?.disabled)
  checkbox.addEventListener("change", () => {
    consentStore.getState().setSelectedConsent(category, checkbox.checked)
  })

  const text = document.createElement("span")
  text.className = "c15t-category-text"

  const title = document.createElement("span")
  title.className = "c15t-category-title"
  title.textContent = translatedType?.title ?? category

  const description = document.createElement("span")
  description.className = "c15t-category-description"
  description.textContent = translatedType?.description ?? consentType?.description ?? ""

  text.append(title, description)
  label.append(checkbox, text)

  return label
}

function createButton(
  label: string,
  variant: "primary" | "secondary",
  onClick: () => void,
): HTMLButtonElement {
  const button = document.createElement("button")
  button.className = `c15t-button c15t-button-${variant}`
  button.type = "button"
  button.textContent = label
  button.addEventListener("click", onClick)

  return button
}

function getTranslations(state: ConsentStoreState): Translations {
  const language = state.translationConfig.defaultLanguage ?? "en"
  const translations = state.translationConfig.translations[language]

  return (translations ?? state.translationConfig.translations.en ?? {}) as Translations
}

function text(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback
}

function injectConsentStyles(): void {
  if (document.getElementById("c15t-consent-styles")) {
    return
  }

  const style = document.createElement("style")
  style.id = "c15t-consent-styles"
  style.textContent = `
    #c15t-consent-ui {
      color: var(--foreground);
      font-family: var(--font-sans);
    }

    .c15t-card {
      position: fixed;
      z-index: 60;
      bottom: 1rem;
      left: 1rem;
      width: calc(100vw - 2rem);
      display: grid;
      gap: 1rem;
      max-width: 42rem;
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: 0;
      background: color-mix(in oklab, var(--popover) 96%, transparent);
      box-shadow: 0 24px 70px rgb(0 0 0 / 18%);
      backdrop-filter: blur(14px);
    }

    .c15t-scrim {
      position: fixed;
      inset: 0;
      z-index: 59;
      background: rgb(0 0 0 / 10%);
    }

    .c15t-banner {
      width: calc(100vw - 2rem);
      max-width: 488px;
      margin-inline: auto;
    }

    .c15t-dialog {
      width: calc(100vw - 2rem);
      max-width: 488px;
      max-height: min(42rem, calc(100vh - 2rem));
      overflow: auto;
      margin-inline: auto;
    }

    .c15t-title {
      margin: 0 0 .5rem 0;
      font-size: 1rem;
      font-weight: 650;
      line-height: 1.25;
    }

    .c15t-description,
    .c15t-meta,
    .c15t-category-description {
      margin: 0;
      color: var(--muted-foreground);
      font-size: 0.875rem;
      line-height: 1.55;
    }

    .c15t-meta {
      margin-top: 0.5rem;
      font-size: 0.75rem;
    }

    .c15t-actions {
      display: grid;
      gap: 0.5rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .c15t-secondary-actions {
      display: grid;
      gap: 0.5rem;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
    }

    .c15t-actions > .c15t-button-primary {
      grid-column: 1 / -1;
    }

    .c15t-button {
      min-height: 2.5rem;
      width: 100%;
      border-radius: 0;
      padding: 0.5rem 0.875rem;
      border: 1px solid var(--border);
      font: inherit;
      font-size: 0.875rem;
      font-weight: 550;
      outline: none;
      transition: transform 150ms ease, background-color 150ms ease, border-color 160ms ease;
    }

    .c15t-button:hover {
      color: var(--foreground);
    }

    .c15t-button:active {
      transform: scale(0.98);
    }

    .c15t-button:focus-visible {
      border-color: var(--ring);
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent);
    }

    .c15t-button-primary {
      border-color: var(--primary);
      background: var(--primary);
      color: var(--primary-foreground);

      &:hover {
        background:  color-mix(in oklab, var(--primary) 80%, transparent);
      }
    }

    .c15t-button-secondary {
      background: var(--secondary);
      color: var(--secondary-foreground);

      &:hover {
        background: color-mix(in oklab, var(--secondary) 80%, transparent);
      }
    }

    .c15t-trigger {
      position: fixed;
      z-index: 50;
      left: 1rem;
      bottom: 1rem;
      display: inline-grid;
      place-items: center;
      width: 2rem;
      min-height: 2rem;
      padding: 0;
      color: var(--muted-foreground);
      background: var(--background);
      backdrop-filter: blur(8px);
      transition: transform 200ms ease, color 200ms ease, opacity 200ms ease;
    }

    .c15t-trigger-icon {
      display: block;
      width: 1rem;
      height: 1rem;
      background: currentColor;
    }

    .c15t-category-list {
      display: grid;
    }

    .c15t-category {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      padding: 0.875rem;
      border: 1px solid var(--border);
      border-radius: 0;
      background: var(--background);
    }

    .c15t-category + .c15t-category {
      border-top: 0;
    }

    .c15t-category input {
      margin-top: 0.25rem;
      accent-color: var(--primary);
    }

    .c15t-category-text {
      display: grid;
      gap: 0.25rem;
    }

    .c15t-category-title {
      font-size: 0.9rem;
      font-weight: 600;
    }

    @media (min-width: 700px) {
      .c15t-card {
        bottom: 1.5rem;
        left: 1.5rem;
        width: min(42rem, calc(100vw - 3rem));
        padding: 1.25rem;
      }

      .c15t-banner {
        width: min(488px, calc(100vw - 3rem));
      }

      .c15t-dialog {
        width: min(488px, calc(100vw - 3rem));
      }

      .c15t-category-list {
        gap: 0.5rem;
      }

      .c15t-category + .c15t-category {
        border-top: 1px solid var(--border);
      }

      .c15t-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      .c15t-secondary-actions {
        display: flex;
        flex-wrap: wrap;
      }

      .c15t-actions > .c15t-button-primary {
        width: auto;
      }

      .c15t-actions .c15t-button-secondary {
        width: auto;
      }

    }

    @media (min-width: 1024px) {
      .c15t-trigger {
        left: 1.5rem;
        bottom: 1.5rem;
      }
    }
  `

  document.head.append(style)
}
