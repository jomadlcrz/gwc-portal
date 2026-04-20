import { ArrowRight, createIcons, Megaphone, Menu, Newspaper, Search } from 'lucide'
import { ROUTES } from '../../app/routes'

export function setupSiteInteractions(root: HTMLElement): () => void {
  const homeHeader = root.querySelector<HTMLElement>('.site-header')
  const overlays = Array.from(root.querySelectorAll<HTMLElement>('[data-overlay]'))
  const openButtons = Array.from(root.querySelectorAll<HTMLElement>('[data-overlay-open]'))
  const closeButtons = Array.from(root.querySelectorAll<HTMLElement>('[data-overlay-close]'))
  const searchForm = root.querySelector<HTMLFormElement>('[data-search-form]')
  const searchInput = root.querySelector<HTMLInputElement>('[data-search-form] input[name="q"]')
  const submenuPanel = root.querySelector<HTMLElement>('[data-submenu-panel]')
  const mobileSubmenuPanel = root.querySelector<HTMLElement>('[data-mobile-submenu-panel]')
  const submenuTriggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-menu-target]'))
  const submenuTemplates = new Map(
    Array.from(root.querySelectorAll<HTMLTemplateElement>('[data-submenu-template]')).map((template) => [
      template.dataset.submenuTemplate ?? '',
      template,
    ]),
  )

  createIcons({
    icons: {
      ArrowRight,
      Megaphone,
      Menu,
      Newspaper,
      Search,
    },
  })

  const lockScroll = (): void => {
    document.body.classList.add('overlay-open')
    document.body.classList.add('no-scroll')
  }

  const unlockScroll = (): void => {
    document.body.classList.remove('overlay-open')
    document.body.classList.remove('no-scroll')
  }

  const applyBodyOverlayState = (openOverlayName: 'menu' | 'search' | null): void => {
    if (openOverlayName === 'menu') {
      document.body.classList.add('nav-open')
      document.body.classList.remove('nav-close')
      document.body.classList.remove('search-open')
      document.body.classList.add('search-close')
      return
    }

    if (openOverlayName === 'search') {
      document.body.classList.add('search-open')
      document.body.classList.remove('search-close')
      document.body.classList.remove('nav-open')
      document.body.classList.add('nav-close')
      return
    }

    document.body.classList.remove('nav-open')
    document.body.classList.remove('search-open')
    document.body.classList.add('nav-close')
    document.body.classList.add('search-close')
  }

  const hideAll = (): void => {
    overlays.forEach((overlay) => {
      overlay.classList.remove('is-open')
      overlay.setAttribute('aria-hidden', 'true')
    })
    submenuTriggers.forEach((trigger) => trigger.classList.remove('is-active'))
    if (submenuPanel) submenuPanel.innerHTML = ''
    if (mobileSubmenuPanel) mobileSubmenuPanel.innerHTML = ''
    applyBodyOverlayState(null)
    unlockScroll()
  }

  const openOverlay = (name: string): void => {
    hideAll()
    const target = root.querySelector<HTMLElement>(`[data-overlay="${name}"]`)
    if (!target) return
    target.classList.add('is-open')
    target.setAttribute('aria-hidden', 'false')
    applyBodyOverlayState(name === 'menu' ? 'menu' : 'search')
    lockScroll()

    if (name === 'menu') {
      submenuTriggers.forEach((item) => item.classList.remove('is-active'))
      if (submenuPanel) submenuPanel.innerHTML = ''
      if (mobileSubmenuPanel) mobileSubmenuPanel.innerHTML = ''
    }

    if (name === 'search' && searchInput) {
      window.setTimeout(() => searchInput.focus(), 1000)
    }
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
    }
  }

  const onSearchSubmit = (event: Event): void => {
    event.preventDefault()
    const query = searchInput?.value.trim() ?? ''
    hideAll()
    const target = query ? `${ROUTES.SEARCH}?q=${encodeURIComponent(query)}` : ROUTES.SEARCH
    window.location.assign(target)
  }

  const setSubmenuContent = (name: string): void => {
    const template = submenuTemplates.get(name)
    if (!template) {
      if (submenuPanel) submenuPanel.innerHTML = ''
      if (mobileSubmenuPanel) mobileSubmenuPanel.innerHTML = ''
      return
    }

    if (submenuPanel) submenuPanel.innerHTML = template.innerHTML
    if (mobileSubmenuPanel) mobileSubmenuPanel.innerHTML = template.innerHTML
  }

  const onSubmenuTriggerClick = (event: Event): void => {
    const trigger = event.currentTarget as HTMLButtonElement
    const targetName = trigger.dataset.menuTarget
    if (!targetName) return

    const isAlreadyActive = trigger.classList.contains('is-active')
    if (isAlreadyActive) {
      trigger.classList.remove('is-active')
      if (submenuPanel) submenuPanel.innerHTML = ''
      if (mobileSubmenuPanel) mobileSubmenuPanel.innerHTML = ''
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
  }

  const onPageShow = (): void => {
    // Browser scroll restoration can be applied after initial script run.
    // Re-check once page is shown before enabling header transitions.
    markHeaderReady()
  }

  // Keep transitions disabled until scroll restoration has settled.
  updateHeaderScrollState()
  requestAnimationFrame(() => {
    updateHeaderScrollState()
    requestAnimationFrame(() => {
      updateHeaderScrollState()
      markHeaderReady()
    })
  })
  window.addEventListener('load', onWindowLoad, { once: true })
  window.addEventListener('pageshow', onPageShow, { once: true })

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
    unlockScroll()
  }
}




