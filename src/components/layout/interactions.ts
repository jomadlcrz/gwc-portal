import { ROUTES } from '../../app/routes'

const loaderLogoUrl = '/images/gwc_logo.avif'
const loaderGearImageUrl = '/images/gwc_logo_gear.avif'
const searchRedirectDelayMs = 520

const showGlobalLoader = (): void => {
  const existing = document.querySelector<HTMLDivElement>('#loading')
  if (existing) {
    existing.classList.remove('is-hidden')
    return
  }

  const loader = document.createElement('div')
  loader.id = 'loading'
  loader.setAttribute('aria-label', 'Loading')
  loader.setAttribute('role', 'status')
  loader.innerHTML = `
    <img id="loading-animating-image" src="${loaderGearImageUrl}" alt="" aria-hidden="true" />
    <img id="loading-image" src="${loaderLogoUrl}" alt="Golden West Colleges logo" />
  `
  document.body.append(loader)
}

export function setupSiteInteractions(root: HTMLElement): () => void {
  const homeHeader = root.querySelector<HTMLElement>('.site-header')
  const overlays = Array.from(root.querySelectorAll<HTMLElement>('[data-overlay]'))
  const openButtons = Array.from(root.querySelectorAll<HTMLElement>('[data-overlay-open]'))
  const closeButtons = Array.from(root.querySelectorAll<HTMLElement>('[data-overlay-close]'))
  const searchForm = root.querySelector<HTMLFormElement>('[data-search-form]')
  const searchInput = root.querySelector<HTMLInputElement>('[data-search-form] input[name="q"]')
  const submenuPanel = root.querySelector<HTMLElement>('[data-submenu-panel]')
  const mobileSubmenuPanels = new Map(
    Array.from(root.querySelectorAll<HTMLElement>('[data-mobile-submenu-for]')).map((panel) => [
      panel.dataset.mobileSubmenuFor ?? '',
      panel,
    ]),
  )
  const submenuTriggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-menu-target]'))
  const submenuTemplates = new Map(
    Array.from(root.querySelectorAll<HTMLTemplateElement>('[data-submenu-template]')).map((template) => [
      template.dataset.submenuTemplate ?? '',
      template,
    ]),
  )
  const brandElements = Array.from(
    root.querySelectorAll<HTMLElement>('.site-brand, .site-overlay-brand'),
  )

  let brandResizeFrame = 0

  const lockScroll = (): void => {
    document.body.classList.add('overlay-open', 'no-scroll')
  }

  const unlockScroll = (): void => {
    document.body.classList.remove('overlay-open', 'no-scroll')
  }

  const applyBodyOverlayState = (openOverlayName: 'menu' | 'search' | null): void => {
    if (openOverlayName === 'menu') {
      document.body.classList.add('nav-open')
      document.body.classList.remove('nav-close', 'search-open')
      document.body.classList.add('search-close')
      return
    }

    if (openOverlayName === 'search') {
      document.body.classList.add('search-open')
      document.body.classList.remove('search-close', 'nav-open')
      document.body.classList.add('nav-close')
      return
    }

    document.body.classList.remove('nav-open', 'search-open')
    document.body.classList.add('nav-close', 'search-close')
  }

  const hideAll = (): void => {
    overlays.forEach((overlay) => {
      overlay.classList.remove('is-open')
      overlay.setAttribute('aria-hidden', 'true')
    })
    submenuTriggers.forEach((trigger) => trigger.classList.remove('is-active'))
    if (submenuPanel) submenuPanel.innerHTML = ''
    mobileSubmenuPanels.forEach((panel) => (panel.innerHTML = ''))
    applyBodyOverlayState(null)
    unlockScroll()
    updateBrandVariants()
  }

  const openOverlay = (name: string): void => {
    hideAll()
    const target = root.querySelector<HTMLElement>(`[data-overlay="${name}"]`)
    if (!target) return
    target.classList.add('is-open')
    target.setAttribute('aria-hidden', 'false')
    applyBodyOverlayState(name === 'menu' ? 'menu' : 'search')
    lockScroll()

    if (name === 'search' && searchInput) {
      setTimeout(() => searchInput.focus(), 300)
    }
    updateBrandVariants()
  }

  const parsePixelValue = (value: string): number | null => {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  const doesBrandFit = (brand: HTMLElement): boolean => {
    const previousMaxWidth = brand.style.maxWidth
    brand.style.maxWidth = '100%'

    const widthFits = brand.scrollWidth <= brand.clientWidth + 1

    const parent = brand.parentElement
    let heightLimit = brand.clientHeight
    if (parent) {
      const parentStyles = window.getComputedStyle(parent)
      const minHeight = parsePixelValue(parentStyles.minHeight)
      const explicitHeight = parsePixelValue(parentStyles.height)
      heightLimit = minHeight ?? explicitHeight ?? parent.clientHeight
    }
    const heightFits = brand.scrollHeight <= heightLimit + 1

    brand.style.maxWidth = previousMaxWidth
    return widthFits && heightFits
  }

  const fitBrandVariant = (brand: HTMLElement): void => {
    const variants: Array<'full' | 'medium' | 'short'> = ['full', 'medium', 'short']
    for (const variant of variants) {
      brand.dataset.brandVariant = variant
      if (doesBrandFit(brand)) return
    }
    brand.dataset.brandVariant = 'short'
  }

  const updateBrandVariants = (): void => {
    brandElements.forEach((brand) => fitBrandVariant(brand))
  }

  const onWindowResize = (): void => {
    if (brandResizeFrame) return
    brandResizeFrame = window.requestAnimationFrame(() => {
      brandResizeFrame = 0
      updateBrandVariants()
    })
  }

  const onOpenClick = (event: Event): void => {
    const trigger = event.currentTarget as HTMLElement
    const targetName = trigger.getAttribute('data-overlay-open')
    if (!targetName) return
    openOverlay(targetName)
  }

  const onCloseClick = (): void => {
    hideAll()
  }

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      hideAll()
      return
    }

    if (event.defaultPrevented || event.repeat) return

    const target = event.target as HTMLElement | null
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target?.isContentEditable

    if (isTyping) return

    const isMac = navigator.platform.toLowerCase().includes('mac')

    const isMacCombo = isMac && event.metaKey && event.shiftKey
    const isWindowsCombo = !isMac && event.ctrlKey && event.shiftKey

    if (!isMacCombo && !isWindowsCombo) return

    const key = event.code.replace('Key', '').toLowerCase()

    const shortcutRouteByKey: Record<string, string> = {
      a: ROUTES.ADMINISTRATORS_LOGIN,
      r: ROUTES.REGISTRAR_STAFF_LOGIN,
      d: ROUTES.DEPARTMENT_LOGIN,
    }

    const targetRoute = shortcutRouteByKey[key]
    if (!targetRoute) return

    event.preventDefault()
    hideAll()
    window.location.assign(targetRoute)
  }

  const onSearchSubmit = (event: Event): void => {
    event.preventDefault()
    const query = searchInput?.value.trim() ?? ''
    hideAll()
    const target = query ? `${ROUTES.SEARCH}?q=${encodeURIComponent(query)}` : ROUTES.SEARCH

    showGlobalLoader()

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.location.assign(target)
        }, searchRedirectDelayMs)
      })
    })
  }

  const setSubmenuContent = (name: string): void => {
    const template = submenuTemplates.get(name)
    if (!template) {
      if (submenuPanel) submenuPanel.innerHTML = ''
      mobileSubmenuPanels.forEach((panel) => (panel.innerHTML = ''))
      return
    }

    if (submenuPanel) submenuPanel.innerHTML = template.innerHTML
    mobileSubmenuPanels.forEach((panel, panelName) => {
      panel.innerHTML = panelName === name ? template.innerHTML : ''
    })
  }

  const onSubmenuTriggerClick = (event: Event): void => {
    const trigger = event.currentTarget as HTMLButtonElement
    const targetName = trigger.dataset.menuTarget
    if (!targetName) return

    const isAlreadyActive = trigger.classList.contains('is-active')
    if (isAlreadyActive) {
      trigger.classList.remove('is-active')
      if (submenuPanel) submenuPanel.innerHTML = ''
      mobileSubmenuPanels.forEach((panel) => (panel.innerHTML = ''))
      return
    }

    submenuTriggers.forEach((item) => item.classList.remove('is-active'))
    trigger.classList.add('is-active')
    setSubmenuContent(targetName)
  }

  const updateHeaderScrollState = (): void => {
    if (!homeHeader) return
    if (homeHeader.classList.contains('site-header-solid')) {
      homeHeader.classList.remove('is-scrolled')
      return
    }
    homeHeader.classList.toggle('is-scrolled', window.scrollY > 24)
  }

  const markHeaderReady = (): void => {
    if (!homeHeader || homeHeader.classList.contains('is-ready')) return
    updateHeaderScrollState()
    requestAnimationFrame(() => {
      updateHeaderScrollState()
      homeHeader.classList.add('is-ready')
    })
  }

  const onWindowLoad = (): void => {
    markHeaderReady()
    updateBrandVariants()
  }

  const onPageShow = (): void => {
    markHeaderReady()
    updateBrandVariants()
  }

  // Apply the best-fitting brand variant immediately to avoid first-paint flicker.
  updateBrandVariants()

  // Keep transitions disabled until scroll restoration has settled.
  updateHeaderScrollState()
  requestAnimationFrame(() => {
    updateHeaderScrollState()
    requestAnimationFrame(() => {
      updateHeaderScrollState()
      markHeaderReady()
      updateBrandVariants()
    })
  })

  window.addEventListener('load', onWindowLoad, { once: true })
  window.addEventListener('pageshow', onPageShow, { once: true })
  window.addEventListener('resize', onWindowResize, { passive: true })

  openButtons.forEach((button) => button.addEventListener('click', onOpenClick))
  submenuTriggers.forEach((button) => button.addEventListener('click', onSubmenuTriggerClick))
  closeButtons.forEach((button) => button.addEventListener('click', onCloseClick))
  document.addEventListener('keydown', onKeydown)
  searchForm?.addEventListener('submit', onSearchSubmit)
  window.addEventListener('scroll', updateHeaderScrollState, { passive: true })

  return () => {
    openButtons.forEach((button) => button.removeEventListener('click', onOpenClick))
    submenuTriggers.forEach((button) => button.removeEventListener('click', onSubmenuTriggerClick))
    closeButtons.forEach((button) => button.removeEventListener('click', onCloseClick))
    document.removeEventListener('keydown', onKeydown)
    searchForm?.removeEventListener('submit', onSearchSubmit)
    window.removeEventListener('scroll', updateHeaderScrollState)
    window.removeEventListener('load', onWindowLoad)
    window.removeEventListener('pageshow', onPageShow)
    window.removeEventListener('resize', onWindowResize)
    if (brandResizeFrame) {
      window.cancelAnimationFrame(brandResizeFrame)
      brandResizeFrame = 0
    }
    unlockScroll()
  }
}