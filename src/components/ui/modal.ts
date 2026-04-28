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

const SHARED_MODAL_STYLE_ID = 'shared-modal-inline-styles'
const OPEN_SHARED_MODAL_STACK: HTMLElement[] = []

const SHARED_MODAL_CSS = `
[data-shared-modal] {
  overflow-y: auto;
}

[data-shared-modal] .modal-dialog {
  max-width: min(880px, 94vw);
}

[data-shared-modal].is-modal-confirm .modal-dialog {
  max-width: min(560px, 92vw);
}

[data-shared-modal].is-modal-form .modal-dialog {
  max-width: min(1280px, 96vw);
}

[data-shared-modal] .modal-body {
  padding: 0.9rem 1rem;
}

[data-shared-modal] .form-control,
[data-shared-modal] .form-select {
  border: 1px solid #8fa1bc;
  border-radius: 0;
  background-color: #fff;
  color: #1e293b;
}

[data-shared-modal] .form-floating > label {
  color: #475569;
}

[data-shared-modal] .form-control:focus,
[data-shared-modal] .form-select:focus {
  border-color: #2a4f95;
  box-shadow: 0 0 0 0.1rem rgb(42 79 149 / 16%);
}

[data-shared-modal] .shared-modal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

[data-shared-modal] .shared-modal-grid-1 {
  grid-template-columns: 1fr;
}

[data-shared-modal] .shared-modal-grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

[data-shared-modal] .shared-modal-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

[data-shared-modal] .shared-modal-grid-4 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 991px) {
  [data-shared-modal].is-modal-form .modal-dialog {
    max-width: min(900px, 96vw);
  }

  [data-shared-modal] .shared-modal-grid-3,
  [data-shared-modal] .shared-modal-grid-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  [data-shared-modal] .modal-body {
    padding: 0.75rem;
  }

  [data-shared-modal] .shared-modal-grid {
    grid-template-columns: 1fr;
  }

  [data-shared-modal] .shared-modal-grid-2,
  [data-shared-modal] .shared-modal-grid-3,
  [data-shared-modal] .shared-modal-grid-4 {
    grid-template-columns: 1fr;
  }
}
`

function ensureSharedModalStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(SHARED_MODAL_STYLE_ID)) return

  const style = document.createElement('style')
  style.id = SHARED_MODAL_STYLE_ID
  style.textContent = SHARED_MODAL_CSS
  document.head.append(style)
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
  ensureSharedModalStyles()
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
    document.body.style.removeProperty('--site-body-overflow')
    backdrop?.remove()
    backdrop = null
    const stackIndex = OPEN_SHARED_MODAL_STACK.lastIndexOf(modal)
    if (stackIndex >= 0) OPEN_SHARED_MODAL_STACK.splice(stackIndex, 1)
    if (OPEN_SHARED_MODAL_STACK.length > 0) {
      document.body.classList.add('modal-open')
      document.body.style.setProperty('--site-body-overflow', 'hidden')
    }
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
    document.body.style.setProperty('--site-body-overflow', 'hidden')

    if (!backdrop) {
      backdrop = document.createElement('div')
      backdrop.className = 'modal-backdrop fade show'
      backdrop.dataset.sharedModalBackdrop = 'true'
      document.body.append(backdrop)
    }

    const stackIndex = OPEN_SHARED_MODAL_STACK.lastIndexOf(modal)
    if (stackIndex >= 0) OPEN_SHARED_MODAL_STACK.splice(stackIndex, 1)
    OPEN_SHARED_MODAL_STACK.push(modal)
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

    const ownerModal = target.closest<HTMLElement>('[data-shared-modal]')
    if (ownerModal !== modal) return

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
    if (event.key !== 'Escape' || !isOpen) return
    const topModal = OPEN_SHARED_MODAL_STACK[OPEN_SHARED_MODAL_STACK.length - 1]
    if (topModal !== modal) return
    close()
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


