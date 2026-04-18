export type SharedModalController = {
  open: (options: SharedModalOpenOptions) => void
  setOnConfirm: (handler: (() => void) | null) => void
  setMode: (mode: 'default' | 'form' | 'confirm') => void
  close: () => void
  destroy: () => void
}

type SharedModalSetupOptions = {
  modalSelector?: string
}

export type SharedModalOpenOptions = {
  title: string
  bodyHtml: string
  confirmLabel?: string
  hideConfirm?: boolean
}

export function renderSharedModal(id: string): string {
  return `
    <div class="modal fade" id="${id}" tabindex="-1" aria-hidden="true" data-shared-modal>
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" data-shared-modal-title>Modal</h5>
            <button type="button" class="btn-close" aria-label="Close" data-shared-modal-close></button>
          </div>
          <div class="modal-body" data-shared-modal-body></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-shared-modal-close>Close</button>
            <button type="button" class="btn btn-primary" data-shared-modal-confirm>Save</button>
          </div>
        </div>
      </div>
    </div>
  `
}

export function setupSharedModal(root: HTMLElement, options: SharedModalSetupOptions = {}): SharedModalController {
  const modalSelector = options.modalSelector ?? '[data-shared-modal]'
  const modal = root.querySelector<HTMLElement>(modalSelector)
  const titleNode = modal?.querySelector<HTMLElement>('[data-shared-modal-title]')
  const bodyNode = modal?.querySelector<HTMLElement>('[data-shared-modal-body]')
  const confirmBtn = modal?.querySelector<HTMLButtonElement>('[data-shared-modal-confirm]')
  let backdrop: HTMLDivElement | null = null
  let isOpen = false
  let onConfirm: (() => void) | null = null

  if (!modal || !titleNode || !bodyNode || !confirmBtn) {
    return {
      open: () => undefined,
      setOnConfirm: () => undefined,
      setMode: () => undefined,
      close: () => undefined,
      destroy: () => undefined,
    }
  }

  const setMode = (mode: 'default' | 'form' | 'confirm'): void => {
    modal.classList.remove('is-modal-form', 'is-modal-confirm')
    if (mode === 'form') modal.classList.add('is-modal-form')
    if (mode === 'confirm') modal.classList.add('is-modal-confirm')
  }

  const close = (): void => {
    if (!isOpen) return
    isOpen = false
    modal.classList.remove('show')
    modal.style.display = 'none'
    modal.setAttribute('aria-hidden', 'true')
    bodyNode.innerHTML = ''
    onConfirm = null
    document.body.classList.remove('modal-open')
    document.body.style.removeProperty('overflow')
    backdrop?.remove()
    backdrop = null
  }

  const open = (options: SharedModalOpenOptions): void => {
    titleNode.textContent = options.title
    bodyNode.innerHTML = options.bodyHtml
    confirmBtn.textContent = options.confirmLabel ?? 'Save'
    confirmBtn.classList.toggle('d-none', options.hideConfirm ?? false)
    isOpen = true
    modal.style.display = 'block'
    modal.classList.add('show')
    modal.setAttribute('aria-hidden', 'false')
    document.body.classList.add('modal-open')
    document.body.style.overflow = 'hidden'

    if (!backdrop) {
      backdrop = document.createElement('div')
      backdrop.className = 'modal-backdrop fade show'
      backdrop.dataset.sharedModalBackdrop = 'true'
      document.body.append(backdrop)
    }
  }

  const onRootClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    if (!target) return

    const opener = target.closest<HTMLElement>('[data-modal-open]')
    if (opener) {
      const title = opener.dataset.modalTitle ?? 'Details'
      const body = opener.dataset.modalBody ?? 'No details available.'
      open({ title, bodyHtml: `<p class="mb-0">${body}</p>`, hideConfirm: true })
      return
    }

    if (target.closest('[data-shared-modal-confirm]')) {
      onConfirm?.()
      return
    }

    if (target.closest('[data-shared-modal-close]')) {
      close()
      return
    }

  }

  const onEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') close()
  }

  root.addEventListener('click', onRootClick)
  document.addEventListener('keydown', onEscape)

  return {
    open,
    setOnConfirm: (handler): void => {
      onConfirm = handler
    },
    setMode,
    close,
    destroy: (): void => {
      close()
      root.removeEventListener('click', onRootClick)
      document.removeEventListener('keydown', onEscape)
    },
  }
}
