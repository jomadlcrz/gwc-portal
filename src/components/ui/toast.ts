export type SharedToastController = {
  show: (message: string, title?: string) => void
  destroy: () => void
}

export function renderSharedToastContainer(id: string): string {
  return `
    <div class="toast-container position-fixed top-0 end-0 p-3" data-shared-toast-container>
      <div id="${id}" class="toast text-bg-primary border-0" role="status" aria-live="polite" aria-atomic="true" data-shared-toast>
        <div class="d-flex">
          <div class="toast-body">
            <strong class="d-block" data-shared-toast-title>Notice</strong>
            <span data-shared-toast-message></span>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close" data-shared-toast-close></button>
        </div>
      </div>
    </div>
  `
}

export function setupSharedToast(root: HTMLElement, toastSelector: string): SharedToastController {
  const toast = root.querySelector<HTMLElement>(toastSelector)
  const title = toast?.querySelector<HTMLElement>('[data-shared-toast-title]')
  const message = toast?.querySelector<HTMLElement>('[data-shared-toast-message]')
  const closeButton = toast?.querySelector<HTMLButtonElement>('[data-shared-toast-close]')
  let hideTimer = 0

  const clearHideTimer = (): void => {
    if (!hideTimer) return
    window.clearTimeout(hideTimer)
    hideTimer = 0
  }

  const hide = (): void => {
    clearHideTimer()
    toast?.classList.remove('show')
  }

  const show = (nextMessage: string, nextTitle = 'Success'): void => {
    if (!toast || !message || !title) return
    title.textContent = nextTitle
    message.textContent = nextMessage
    toast.classList.add('show')
    clearHideTimer()
    hideTimer = window.setTimeout(() => {
      hide()
    }, 2600)
  }

  const onCloseClick = (): void => hide()
  closeButton?.addEventListener('click', onCloseClick)

  return {
    show,
    destroy: (): void => {
      clearHideTimer()
      closeButton?.removeEventListener('click', onCloseClick)
    },
  }
}
