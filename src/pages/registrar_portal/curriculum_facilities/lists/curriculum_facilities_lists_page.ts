import { ROUTES } from '../../../../app/routes'
import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../../components/layout/_layout'
import { renderSharedModal, setupSharedModal } from '../../../../components/ui/modal'
import { renderBreadcrumbNav } from '../../../../components/ui/nav_breadcrumb'
import { renderSharedPopover } from '../../../../components/ui/popover'
import { renderSharedToastContainer, setupSharedToast } from '../../../../components/ui/toast'
import { ACADEMIC_PROGRAMS } from '../../../../data/programs'

type Row = string[]

const PROGRAM_DEPT_CLASS_BY_CODE = new Map(
  ACADEMIC_PROGRAMS.map((program) => [program.code.toUpperCase(), `dept-code-${program.departmentCode.toLowerCase()}`]),
)

function renderProgramColorBadge(programCode: string): string {
  const normalizedCode = programCode.trim().toUpperCase()
  const toneClass = PROGRAM_DEPT_CLASS_BY_CODE.get(normalizedCode)
  const className = toneClass ? `dept-code-badge ${toneClass}` : 'dept-code-badge'
  return `<span class="${className}">${normalizedCode}</span>`
}

function renderListPage(title: string, headers: string[], rows: Row[]): string {
  const tableHeaders = [...headers, 'Actions']
  const itemLabel = title.endsWith('s') ? title.slice(0, -1) : title
  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'curriculum_facilities',
    `
      <section class="registrar-content cf-page cf-list-page">
        ${renderBreadcrumbNav([
          { label: 'Curriculum & Facilities', href: ROUTES.REGISTRAR_CURRICULUM_FACILITIES },
          { label: title, active: true },
        ])}
        <article class="cf-table-card cf-list-shell">
          <header class="cf-list-top-head">
            <div class="cf-head">
              <h2>${title}</h2>
            </div>
            <button type="button" class="btn btn-sm btn-primary" data-cf-add-item="${itemLabel}">+ Add ${itemLabel}</button>
          </header>
          <div class="cf-table-wrap cf-list-table-wrap">
            <div class="table-responsive">
            <table class="table table-striped table-hover cf-table">
              <thead>
                <tr>${tableHeaders.map((header) => `<th>${header}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${rows
                  .map(
                    (row) => `
                      <tr data-cf-row>
                        ${row.map((col) => `<td>${col}</td>`).join('')}
                        <td class="cf-actions-cell">
                          ${renderSharedPopover({
                            ariaLabel: `${title} row actions`,
                            triggerLabel: '<i class="bi bi-three-dots-vertical" aria-hidden="true"></i>',
                            actionDataAttribute: 'data-cf-row-action',
                            actions: [
                              { label: 'View', value: 'view' },
                              { label: 'Edit', value: 'edit' },
                              { label: 'Archive', value: 'archive' },
                              { label: 'Remove', value: 'remove', danger: true },
                            ],
                          })}
                        </td>
                      </tr>
                    `,
                  )
                  .join('')}
              </tbody>
            </table>
            </div>
          </div>
        </article>
      </section>
      <div class="offcanvas-backdrop fade" data-cf-add-backdrop hidden></div>
      <aside class="offcanvas offcanvas-end registrar-cf-list-offcanvas" tabindex="-1" aria-labelledby="registrar-cf-add-label" data-cf-add-offcanvas>
        <div class="offcanvas-header">
          <h4 id="registrar-cf-add-label" class="offcanvas-title" data-cf-add-title>New Item</h4>
          <button type="button" class="btn-close" aria-label="Close" data-cf-add-close></button>
        </div>
        <div class="offcanvas-body">
          <div data-cf-add-body></div>
          <div class="registrar-cf-list-offcanvas-actions mt-3">
            <button type="button" class="btn btn-light" data-cf-add-close>Cancel</button>
            <button type="button" class="btn btn-primary" data-cf-add-confirm>Save</button>
          </div>
        </div>
      </aside>
      ${renderSharedModal('registrar-cf-list-modal')}
      ${renderSharedToastContainer('registrar-cf-list-toast')}
    `,
  )
}

export function setupregistrar_curriculum_lists_page(root: HTMLElement): () => void {
  const modal = setupSharedModal(root, { modalSelector: '#registrar-cf-list-modal' })
  const toast = setupSharedToast(root, '#registrar-cf-list-toast')
  const addOffcanvas = root.querySelector<HTMLElement>('[data-cf-add-offcanvas]')
  const addBackdrop = root.querySelector<HTMLElement>('[data-cf-add-backdrop]')
  const addTitle = root.querySelector<HTMLElement>('[data-cf-add-title]')
  const addBody = root.querySelector<HTMLElement>('[data-cf-add-body]')
  const addConfirm = root.querySelector<HTMLButtonElement>('[data-cf-add-confirm]')
  let addConfirmHandler: (() => void) | null = null

  const getRowFromActionButton = (button: HTMLButtonElement): HTMLTableRowElement | null =>
    button.closest<HTMLTableRowElement>('tr[data-cf-row]')

  const rowTitleFromButton = (button: HTMLButtonElement): string =>
    getRowFromActionButton(button)?.querySelector('td')?.textContent?.trim() || 'item'

  const getCellValues = (row: HTMLTableRowElement): string[] =>
    Array.from(row.querySelectorAll<HTMLTableCellElement>('td'))
      .slice(0, -1)
      .map((cell) => cell.textContent?.trim() || '')

  const getTableHeaders = (row: HTMLTableRowElement): string[] =>
    Array.from(row.closest('table')?.querySelectorAll('thead th') || [])
      .slice(0, -1)
      .map((header) => header.textContent?.trim() || '')

  const renderReadOnlyFields = (labels: string[], values: string[]): string =>
    `
      <div class="shared-modal-grid shared-modal-grid-2">
        ${labels
          .map(
            (label, index) => `
              <div class="form-floating">
                <input class="form-control" placeholder=" " value="${values[index] || ''}" readonly />
                <label>${label}</label>
              </div>
            `,
          )
          .join('')}
      </div>
    `

  const renderEditableFields = (labels: string[], values: string[]): string =>
    `
      <div class="shared-modal-grid shared-modal-grid-2">
        ${labels
          .map(
            (label, index) => `
              <div class="form-floating">
                <input class="form-control" placeholder=" " value="${values[index] || ''}" data-cf-edit-field="${index}" />
                <label>${label}</label>
              </div>
            `,
          )
          .join('')}
      </div>
    `

  const renderAddFields = (labels: string[]): string =>
    `
      <div class="shared-modal-grid shared-modal-grid-2">
        ${labels
          .map(
            (label, index) => `
              <div class="form-floating">
                <input class="form-control" placeholder=" " value="" data-cf-add-field="${index}" />
                <label>${label}</label>
              </div>
            `,
          )
          .join('')}
      </div>
    `

  const closeAddOffcanvas = (): void => {
    if (!addOffcanvas || !addBackdrop) return
    addOffcanvas.classList.remove('show')
    addBackdrop.classList.remove('show')
    addBackdrop.setAttribute('hidden', '')
    document.body.classList.remove('registrar-cf-list-offcanvas-open')
  }

  const openAddOffcanvas = (title: string, bodyHtml: string, onConfirm: () => void): void => {
    if (!addOffcanvas || !addBackdrop || !addTitle || !addBody || !addConfirm) return
    addTitle.textContent = title
    addBody.innerHTML = bodyHtml
    addConfirmHandler = onConfirm
    addOffcanvas.classList.add('show')
    addBackdrop.removeAttribute('hidden')
    window.requestAnimationFrame(() => addBackdrop.classList.add('show'))
    document.body.classList.add('registrar-cf-list-offcanvas-open')
  }

  const onActionClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const actionButton = target?.closest<HTMLButtonElement>('[data-cf-row-action]')
    const addButton = target?.closest<HTMLButtonElement>('[data-cf-add-item]')
    const addCloseButton = target?.closest<HTMLElement>('[data-cf-add-close]')
    const addConfirmButton = target?.closest<HTMLElement>('[data-cf-add-confirm]')

    if (addCloseButton) {
      closeAddOffcanvas()
      return
    }

    if (addConfirmButton) {
      addConfirmHandler?.()
      return
    }

    if (addButton) {
      const itemLabel = addButton.dataset.cfAddItem || 'Item'
      const card = addButton.closest<HTMLElement>('.cf-table-card')
      const headers = Array.from(card?.querySelectorAll('thead th') || [])
        .slice(0, -1)
        .map((header) => header.textContent?.trim() || '')

      openAddOffcanvas(`Add ${itemLabel}`, renderAddFields(headers), () => {
        toast.show(`${itemLabel} saved successfully.`)
        closeAddOffcanvas()
      })
      return
    }

    if (!actionButton) return

    const action = actionButton.dataset.cfRowAction
    if (!action) return

    const row = getRowFromActionButton(actionButton)
    if (!row) return

    const rowLabel = rowTitleFromButton(actionButton)
    const headers = getTableHeaders(row)
    const values = getCellValues(row)

    if (action === 'view') {
      modal.setMode('default')
      modal.setOnConfirm(null)
      modal.open({
        title: `View ${rowLabel}`,
        bodyHtml: renderReadOnlyFields(headers, values),
        hideConfirm: true,
      })
      return
    }

    if (action === 'edit') {
      modal.setMode('form')
      modal.setOnConfirm(() => {
        const inputs = Array.from(root.querySelectorAll<HTMLInputElement>('[data-cf-edit-field]'))
        inputs.forEach((input) => {
          const index = Number.parseInt(input.dataset.cfEditField || '', 10)
          const cell = row.querySelectorAll<HTMLTableCellElement>('td')[index]
          if (!Number.isFinite(index) || !cell) return
          cell.textContent = input.value.trim()
        })
        toast.show(`${rowLabel} updated successfully.`)
        modal.close()
      })
      modal.open({
        title: `Edit ${rowLabel}`,
        bodyHtml: renderEditableFields(headers, values),
        confirmLabel: 'Save Changes',
      })
      return
    }

    if (action === 'archive') {
      modal.setMode('confirm')
      modal.setOnConfirm(() => {
        toast.show(`${rowLabel} archived.`)
        modal.close()
      })
      modal.open({
        title: `Archive ${rowLabel}?`,
        bodyHtml: '<p class="mb-0">This will mark the record as archived.</p>',
        confirmLabel: 'Archive',
      })
      return
    }

    if (action === 'remove') {
      modal.setMode('confirm')
      modal.setOnConfirm(() => {
        row.remove()
        toast.show(`${rowLabel} removed.`)
        modal.close()
      })
      modal.open({
        title: `Remove ${rowLabel}?`,
        bodyHtml: '<p class="mb-0">This action cannot be undone.</p>',
        confirmLabel: 'Remove',
      })
    }
  }

  const onEsc = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') closeAddOffcanvas()
  }

  root.addEventListener('click', onActionClick)
  document.addEventListener('keydown', onEsc)

  return () => {
    closeAddOffcanvas()
    toast.destroy()
    modal.destroy()
    root.removeEventListener('click', onActionClick)
    document.removeEventListener('keydown', onEsc)
  }
}

export function renderregistrar_curriculum_programs_page(): string {
  return renderListPage('Programs', ['Program Code', 'Program Name', 'Status'], [
    ['BSIT', 'Bachelor of Science in Information Technology', '<span class="cf-chip">Active</span>'],
    ['BSED', 'Bachelor of Secondary Education', '<span class="cf-chip">Active</span>'],
    ['BSBA', 'Bachelor of Science in Business Administration', '<span class="cf-chip">Active</span>'],
    ['BEED', 'Bachelor of Elementary Education', '<span class="cf-chip">Active</span>'],
    ['BSA', 'Bachelor of Science in Accountancy', '<span class="cf-chip">Active</span>'],
  ])
}

export function renderregistrar_curriculum_departments_page(): string {
  return renderListPage('Departments', ['Department', 'Building', 'Programs'], [
    ['College of Computing', 'Tech Building', renderProgramColorBadge('BSIT')],
    ['College of Education', 'Education Building', renderProgramColorBadge('BSED')],
    ['College of Business', 'Admin Building', renderProgramColorBadge('BSBA')],
    ['General Education', 'Education Building', renderProgramColorBadge('BSED')],
    ['Graduate School', 'Graduate Building', renderProgramColorBadge('BSED')],
  ])
}

export function renderregistrar_curriculum_buildings_page(): string {
  return renderListPage('Buildings', ['Building Name', 'Code', 'Departments'], [
    ['Technology Building', 'TECH', 'College of Computing'],
    ['Education Building', 'EDU', 'College of Education'],
    ['Administration Building', 'ADMIN', 'College of Business'],
    ['Library Building', 'LIB', 'General Education'],
    ['Graduate Building', 'GRAD', 'Graduate School'],
  ])
}

export function renderregistrar_curriculum_rooms_page(): string {
  return renderListPage('Rooms', ['Room Name', 'Room No.', 'Building', 'Capacity'], [
    ['IT Laboratory 1', 'TECH 101', 'Technology Building', '40'],
    ['IT Laboratory 2', 'TECH 102', 'Technology Building', '40'],
    ['Lecture Room 1', 'EDU 201', 'Education Building', '60'],
    ['Lecture Room 2', 'EDU 202', 'Education Building', '60'],
    ['Conference Room', 'ADMIN 301', 'Administration Building', '30'],
  ])
}

export function renderregistrar_curriculum_sets_page(): string {
  return renderListPage('Sets', ['Set Code', 'Set Name', 'Program', 'Year Level', 'SY'], [
    ['BSIT-1A', 'BSIT 1st Year - A', 'BSIT', '1st Year', '2024-2025'],
    ['BSIT-1B', 'BSIT 1st Year - B', 'BSIT', '1st Year', '2024-2025'],
    ['BSED-2A', 'BSED 2nd Year - A', 'BSED', '2nd Year', '2024-2025'],
    ['BSBA-3A', 'BSBA 3rd Year - A', 'BSBA', '3rd Year', '2024-2025'],
    ['BSA-4A', 'BSA 4th Year - A', 'BSA', '4th Year', '2024-2025'],
  ])
}

export function renderregistrar_curriculum_subjects_page(): string {
  return renderListPage('Subjects', ['Subject Code', 'Descriptive Title', 'Program', 'Units'], [
    ['IT101', 'Introduction to Computing', 'BSIT', '3'],
    ['IT102', 'Programming 1 (C++)', 'BSIT', '3'],
    ['ED201', 'Principles of Teaching', 'BSED', '3'],
    ['BA301', 'Financial Management', 'BSBA', '3'],
    ['GE001', 'Purposive Communication', 'All', '3'],
  ])
}

