export type SearchableSelectController = {
  destroy: () => void
}

type SearchableSelectState = {
  wrapper: HTMLDivElement
  select: HTMLSelectElement
  input: HTMLInputElement
  icon: HTMLElement
  menu: HTMLDivElement
  closeTimer: number
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function listValues(select: HTMLSelectElement): string[] {
  return Array.from(select.options).map((option) => option.value).filter((value) => value.trim().length > 0)
}

function renderMenu(state: SearchableSelectState): void {
  const query = normalize(state.input.value)
  const values = listValues(state.select).filter((value) => normalize(value).includes(query))
  if (!values.length) {
    state.menu.innerHTML = '<button type="button" class="shared-searchable-select-item is-empty" disabled>No matches</button>'
    return
  }
  state.menu.innerHTML = values
    .map((value) => `<button type="button" class="shared-searchable-select-item" data-shared-searchable-value="${value}">${value}</button>`)
    .join('')
}

function openSearch(state: SearchableSelectState): void {
  state.wrapper.classList.add('is-searching')
  state.icon.hidden = false
  state.input.hidden = false
  state.menu.hidden = false
  state.input.value = ''
  renderMenu(state)
  window.requestAnimationFrame(() => state.input.focus())
}

function closeSearch(state: SearchableSelectState): void {
  state.wrapper.classList.remove('is-searching')
  state.icon.hidden = true
  state.input.hidden = true
  state.menu.hidden = true
  state.input.value = ''
}

export function setupSearchableSelects(root: HTMLElement, selector = '[data-searchable-select]'): SearchableSelectController {
  const states: SearchableSelectState[] = []
  const selects = Array.from(root.querySelectorAll<HTMLSelectElement>(selector))

  selects.forEach((select) => {
    if (select.dataset.searchableReady === 'true') return
    select.dataset.searchableReady = 'true'

    const wrapper = document.createElement('div')
    wrapper.className = 'shared-searchable-select'
    const input = document.createElement('input')
    input.type = 'text'
    input.className = 'form-control form-control-sm shared-searchable-select-input'
    input.placeholder = select.dataset.searchPlaceholder ?? 'Search...'
    input.hidden = true
    const icon = document.createElement('i')
    icon.className = 'bi bi-search'
    icon.setAttribute('aria-hidden', 'true')
    icon.hidden = true
    const menu = document.createElement('div')
    menu.className = 'shared-searchable-select-menu'
    menu.hidden = true

    select.classList.add('shared-searchable-select-native')
    select.parentElement?.insertBefore(wrapper, select)
    wrapper.append(select, input, icon, menu)

    const state: SearchableSelectState = { wrapper, select, input, icon, menu, closeTimer: 0 }
    states.push(state)

    const clearCloseTimer = (): void => {
      if (!state.closeTimer) return
      window.clearTimeout(state.closeTimer)
      state.closeTimer = 0
    }

    const onSelectPointer = (event: PointerEvent): void => {
      event.preventDefault()
      openSearch(state)
    }

    const onSelectFocus = (): void => openSearch(state)
    const onInput = (): void => renderMenu(state)
    const onInputFocus = (): void => clearCloseTimer()
    const onInputBlur = (): void => {
      clearCloseTimer()
      state.closeTimer = window.setTimeout(() => closeSearch(state), 120)
    }
    const onMenuClick = (event: Event): void => {
      const target = event.target as HTMLElement | null
      const item = target?.closest<HTMLElement>('[data-shared-searchable-value]')
      const value = item?.dataset.sharedSearchableValue
      if (!value) return
      event.preventDefault()
      event.stopPropagation()
      state.select.value = value
      state.select.dispatchEvent(new Event('change', { bubbles: true }))
      closeSearch(state)
    }
    const onMenuPointer = (event: PointerEvent): void => {
      event.preventDefault()
      clearCloseTimer()
    }
    const onInputKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        closeSearch(state)
        state.select.focus()
        return
      }
      if (event.key !== 'Enter') return
      const match = listValues(state.select).find((value) => normalize(value).includes(normalize(state.input.value)))
      if (!match) return
      state.select.value = match
      state.select.dispatchEvent(new Event('change', { bubbles: true }))
      closeSearch(state)
    }

    const observer = new MutationObserver(() => renderMenu(state))
    observer.observe(select, { childList: true, subtree: true })
    select.addEventListener('pointerdown', onSelectPointer)
    select.addEventListener('focus', onSelectFocus)
    input.addEventListener('input', onInput)
    input.addEventListener('focus', onInputFocus)
    input.addEventListener('blur', onInputBlur)
    input.addEventListener('keydown', onInputKeyDown)
    menu.addEventListener('click', onMenuClick)
    menu.addEventListener('pointerdown', onMenuPointer)

    ;(state as SearchableSelectState & { teardown?: () => void }).teardown = () => {
      clearCloseTimer()
      observer.disconnect()
      select.removeEventListener('pointerdown', onSelectPointer)
      select.removeEventListener('focus', onSelectFocus)
      input.removeEventListener('input', onInput)
      input.removeEventListener('focus', onInputFocus)
      input.removeEventListener('blur', onInputBlur)
      input.removeEventListener('keydown', onInputKeyDown)
      menu.removeEventListener('click', onMenuClick)
      menu.removeEventListener('pointerdown', onMenuPointer)
      select.classList.remove('shared-searchable-select-native')
      wrapper.parentElement?.insertBefore(select, wrapper)
      wrapper.remove()
      delete select.dataset.searchableReady
    }
  })

  return {
    destroy: () => {
      states.forEach((state) => {
        const teardown = (state as SearchableSelectState & { teardown?: () => void }).teardown
        teardown?.()
      })
    },
  }
}
