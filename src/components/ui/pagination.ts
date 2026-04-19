type SharedPaginationOptions = {
  pageSize: number
  totalItems: number
  currentPage: number
  onPageChange: (page: number) => void
}

type PaginationSnapshot = {
  pageSize: number
  totalItems: number
  currentPage: number
}

export type SharedPaginationController = {
  update: (snapshot: Partial<PaginationSnapshot>) => void
  getTotalPages: () => number
  destroy: () => void
}

export function renderSharedPagination(): string {
  return `
    <nav aria-label="Table pagination">
      <ul class="pagination pagination-sm mb-0" data-shared-pagination-list></ul>
    </nav>
  `
}

export function setupSharedPagination(
  container: HTMLElement,
  options: SharedPaginationOptions,
): SharedPaginationController {
  let pageSize = Math.max(1, options.pageSize)
  let totalItems = Math.max(0, options.totalItems)
  let currentPage = Math.max(1, options.currentPage)
  const list = container.querySelector<HTMLUListElement>('[data-shared-pagination-list]')

  if (!list) {
    return {
      update: () => undefined,
      getTotalPages: () => 1,
      destroy: () => undefined,
    }
  }

  const getTotalPages = (): number => Math.max(1, Math.ceil(totalItems / pageSize))

  const getVisiblePages = (totalPages: number, page: number): number[] => {
    const windowSize = 5
    if (totalPages <= windowSize) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const half = Math.floor(windowSize / 2)
    let start = Math.max(1, page - half)
    let end = start + windowSize - 1
    if (end > totalPages) {
      end = totalPages
      start = end - windowSize + 1
    }

    return Array.from({ length: windowSize }, (_, index) => start + index)
  }

  const render = (): void => {
    const totalPages = getTotalPages()
    const safePage = Math.min(Math.max(1, currentPage), totalPages)
    const visiblePages = getVisiblePages(totalPages, safePage)
    const canGoPrev = safePage > 1
    const canGoNext = safePage < totalPages

    list.innerHTML = `
      <li class="page-item ${canGoPrev ? '' : 'disabled'}">
        <button type="button" class="page-link" data-pagination-target="${safePage - 1}" aria-label="Previous page">Prev</button>
      </li>
      ${visiblePages
        .map(
          (page) => `
            <li class="page-item ${page === safePage ? 'active' : ''}">
              <button
                type="button"
                class="page-link"
                data-pagination-target="${page}"
                ${page === safePage ? 'aria-current="page"' : ''}
              >
                ${page}
              </button>
            </li>
          `,
        )
        .join('')}
      <li class="page-item ${canGoNext ? '' : 'disabled'}">
        <button type="button" class="page-link" data-pagination-target="${safePage + 1}" aria-label="Next page">Next</button>
      </li>
    `
  }

  const onClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLButtonElement>('[data-pagination-target]')
    if (!button || button.disabled) return

    const targetPage = Number(button.dataset.paginationTarget ?? '')
    const totalPages = getTotalPages()
    if (!Number.isFinite(targetPage)) return
    if (targetPage < 1 || targetPage > totalPages) return
    if (targetPage === currentPage) return

    options.onPageChange(targetPage)
  }

  container.addEventListener('click', onClick)
  render()

  return {
    update: (snapshot): void => {
      pageSize = Math.max(1, snapshot.pageSize ?? pageSize)
      totalItems = Math.max(0, snapshot.totalItems ?? totalItems)
      currentPage = Math.max(1, snapshot.currentPage ?? currentPage)
      render()
    },
    getTotalPages,
    destroy: (): void => {
      container.removeEventListener('click', onClick)
    },
  }
}
