export type SharedPopoverAction = {
  label: string
  value: string
  danger?: boolean
}

export type RenderSharedPopoverOptions = {
  ariaLabel: string
  triggerLabel?: string
  actionDataAttribute?: string
  actions: SharedPopoverAction[]
}

export function renderSharedPopover(options: RenderSharedPopoverOptions): string {
  const triggerLabel = options.triggerLabel ?? 'Actions'
  const actionDataAttribute = options.actionDataAttribute ?? 'data-action'

  const actionsHtml = options.actions
    .map((action) => {
      const dangerClass = action.danger ? ' class="is-danger"' : ''
      return `<button type="button" role="menuitem"${dangerClass} ${actionDataAttribute}="${action.value}">${action.label}</button>`
    })
    .join('')

  return `
    <div class="actions-popover">
      <button
        type="button"
        class="actions-trigger"
        data-actions-trigger
        aria-haspopup="menu"
        aria-expanded="false"
      >
        ${triggerLabel}
      </button>
      <div class="actions-menu" data-actions-menu role="menu" aria-label="${options.ariaLabel}">
        ${actionsHtml}
      </div>
    </div>
  `
}

export function setupSharedPopover(root: HTMLElement): () => void {
  const actionTriggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-actions-trigger]'))
  const actionMenus = Array.from(root.querySelectorAll<HTMLElement>('[data-actions-menu]'))

  const closeAllActions = (): void => {
    actionTriggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false')
      const wrapper = trigger.closest<HTMLElement>('.actions-popover')
      wrapper?.classList.remove('is-open')
      const menu = wrapper?.querySelector<HTMLElement>('[data-actions-menu]')
      menu?.style.removeProperty('--menu-left')
      menu?.style.removeProperty('--menu-top')
      menu?.classList.remove('is-dropup')
    })
  }

  const placeActionsMenu = (wrapper: HTMLElement, trigger: HTMLButtonElement): void => {
    const menu = wrapper.querySelector<HTMLElement>('[data-actions-menu]')
    if (!menu) return

    const gap = 6
    const viewportPadding = 8
    const triggerRect = trigger.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()

    let left = triggerRect.right - menuRect.width
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - menuRect.width - viewportPadding))

    const spaceBelow = window.innerHeight - triggerRect.bottom - viewportPadding
    const shouldDropUp = spaceBelow < menuRect.height + gap
    const top = shouldDropUp ? triggerRect.top - menuRect.height - gap : triggerRect.bottom + gap

    menu.style.setProperty('--menu-left', `${Math.max(viewportPadding, left)}px`)
    menu.style.setProperty('--menu-top', `${Math.max(viewportPadding, top)}px`)
    menu.classList.toggle('is-dropup', shouldDropUp)
  }

  const onActionTriggerClick = (event: Event): void => {
    const trigger = event.currentTarget as HTMLButtonElement
    const wrapper = trigger.closest<HTMLElement>('.actions-popover')
    if (!wrapper) return

    const isOpen = wrapper.classList.contains('is-open')
    closeAllActions()
    if (!isOpen) {
      wrapper.classList.add('is-open')
      trigger.setAttribute('aria-expanded', 'true')
      placeActionsMenu(wrapper, trigger)
    }
  }

  const onDocumentClick = (event: MouseEvent): void => {
    const target = event.target as Node | null
    if (!target) return
    const elementTarget = target as HTMLElement

    const clickedInsideModal =
      Boolean(elementTarget.closest?.('[data-shared-modal]')) ||
      Boolean(elementTarget.closest?.('.modal-backdrop')) ||
      Boolean(elementTarget.closest?.('[data-cf-add-offcanvas]')) ||
      Boolean(elementTarget.closest?.('[data-cf-add-backdrop]'))
    if (clickedInsideModal) return

    const clickedInside = actionMenus.some((menu) => menu.contains(target)) || actionTriggers.some((trigger) => trigger.contains(target))
    if (!clickedInside) closeAllActions()
  }

  const onViewportChange = (): void => {
    actionTriggers.forEach((trigger) => {
      const wrapper = trigger.closest<HTMLElement>('.actions-popover')
      if (!wrapper?.classList.contains('is-open')) return
      placeActionsMenu(wrapper, trigger)
    })
  }

  const onEscape = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return

    const modalOrPanelOpen =
      Boolean(document.querySelector('[data-shared-modal].show')) ||
      Boolean(document.querySelector('.modal-backdrop.show')) ||
      Boolean(document.querySelector('[data-cf-add-offcanvas].show')) ||
      Boolean(document.querySelector('[data-cf-add-backdrop].show'))
    if (modalOrPanelOpen) return

    closeAllActions()
  }

  actionTriggers.forEach((trigger) => trigger.addEventListener('click', onActionTriggerClick))
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onEscape)
  window.addEventListener('resize', onViewportChange, { passive: true })
  root.addEventListener('scroll', onViewportChange, { passive: true, capture: true })

  return () => {
    closeAllActions()
    actionTriggers.forEach((trigger) => trigger.removeEventListener('click', onActionTriggerClick))
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('keydown', onEscape)
    window.removeEventListener('resize', onViewportChange)
    root.removeEventListener('scroll', onViewportChange, true)
  }
}


