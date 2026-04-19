import { ROUTES } from '../../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSharedModal, setupSharedModal } from '../../../components/ui/modal'
import { renderSharedPagination, setupSharedPagination } from '../../../components/ui/pagination'
import { renderSharedPopover } from '../../../components/ui/popover'

type AdministratorRecord = {
  name: string
  position: string
  office: string
  email: string
  status: 'Active' | 'On Leave' | 'Inactive'
}

const ADMIN_RECORDS: AdministratorRecord[] = [
  {
    name: 'Dr. Maria L. Santos',
    position: 'College President',
    office: 'Administration Office',
    email: 'maria.santos@gwc.edu.ph',
    status: 'Active',
  },
  {
    name: 'Prof. John R. Dela Cruz',
    position: 'Vice President for Academic Affairs',
    office: 'Academic Office',
    email: 'john.delacruz@gwc.edu.ph',
    status: 'Active',
  },
  {
    name: 'Ms. Angela P. Reyes',
    position: 'Registrar',
    office: "Registrar's Office",
    email: 'angela.reyes@gwc.edu.ph',
    status: 'Active',
  },
  {
    name: 'Mr. Carlo M. Garcia',
    position: 'Dean of Student Affairs',
    office: 'Student Affairs Office',
    email: 'carlo.garcia@gwc.edu.ph',
    status: 'On Leave',
  },
  {
    name: 'Ms. Hannah C. Torres',
    position: 'Human Resources Manager',
    office: 'Human Resources Office',
    email: 'hannah.torres@gwc.edu.ph',
    status: 'Active',
  },
  {
    name: 'Mr. Leo B. Mendoza',
    position: 'Finance Director',
    office: 'Finance Office',
    email: 'leo.mendoza@gwc.edu.ph',
    status: 'Active',
  },
  {
    name: 'Dr. Nica G. Alonzo',
    position: 'Dean of Engineering',
    office: 'Engineering Department',
    email: 'nica.alonzo@gwc.edu.ph',
    status: 'Active',
  },
  {
    name: 'Mr. Rafael I. Cruz',
    position: 'IT Systems Administrator',
    office: 'Information Technology Office',
    email: 'rafael.cruz@gwc.edu.ph',
    status: 'Inactive',
  },
  {
    name: 'Ms. Karen D. Domingo',
    position: 'Admissions Director',
    office: 'Admissions Office',
    email: 'karen.domingo@gwc.edu.ph',
    status: 'Active',
  },
  {
    name: 'Prof. Irene A. Villanueva',
    position: 'Dean of Education',
    office: 'Education Department',
    email: 'irene.villanueva@gwc.edu.ph',
    status: 'On Leave',
  },
  {
    name: 'Mr. Daniel S. Flores',
    position: 'Compliance Officer',
    office: 'Legal and Compliance Office',
    email: 'daniel.flores@gwc.edu.ph',
    status: 'Active',
  },
  {
    name: 'Ms. Nicole R. Velez',
    position: 'Campus Operations Manager',
    office: 'Campus Operations Office',
    email: 'nicole.velez@gwc.edu.ph',
    status: 'Active',
  },
]

function getStatusClass(status: AdministratorRecord['status']): string {
  if (status === 'Active') return 'is-active'
  if (status === 'On Leave') return 'is-warning'
  return 'is-inactive'
}

function renderTableRows(): string {
  return ADMIN_RECORDS.map((record) => {
    const searchValue = [record.name, record.position, record.office, record.email, record.status].join(' ').toLowerCase()
    return `
      <tr data-admin-row data-search-value="${searchValue}">
        <td><strong>${record.name}</strong></td>
        <td>${record.position}</td>
        <td>${record.office}</td>
        <td>${record.email}</td>
        <td><span class="admin-pill ${getStatusClass(record.status)}">${record.status}</span></td>
        <td>${renderSharedPopover({
          ariaLabel: 'Administrator row actions',
          actionDataAttribute: 'data-admin-action',
          actions: [
            { label: 'View', value: 'view' },
            { label: 'Edit', value: 'edit' },
            { label: 'Deactivate', value: 'deactivate' },
            { label: 'Delete', value: 'delete', danger: true },
          ],
        })}</td>
      </tr>
    `
  }).join('')
}

export function renderadministrators_directory_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'administrators',
    `
      <section class="admin-content">
        ${renderBreadcrumbNav([
          { label: 'Home', href: ROUTES.ADMINISTRATORS },
          { label: 'Administrators', active: true },
        ])}
        <article class="admin-directory-shell">
          <header class="admin-directory-head">
            <div>
              <h2>Administrators</h2>
              <p>View and manage school administrators</p>
            </div>
            <label class="admin-directory-search">
              <span class="admin-search-icon" aria-hidden="true"><i data-lucide="search"></i></span>
              <input type="search" placeholder="Search..." aria-label="Search administrators" data-admin-search />
            </label>
          </header>

          <section class="admin-stats-grid" aria-label="Administrator statistics">
            <article class="admin-stat-card">
              <p>Total Administrators</p>
              <strong>12</strong>
            </article>
            <article class="admin-stat-card">
              <p>Active Today</p>
              <strong>10</strong>
            </article>
            <article class="admin-stat-card">
              <p>Departments Managed</p>
              <strong>8</strong>
            </article>
            <article class="admin-stat-card">
              <p>Pending Requests</p>
              <strong class="is-danger">3</strong>
            </article>
          </section>

          <section class="admin-directory-card">
            <header class="admin-directory-card-head">
              <div>
                <h3>Administrator Directory</h3>
                <p>List of current administrators and offices</p>
              </div>
              <button
                type="button"
                class="admin-add-btn"
                data-admin-open-add
              >
                + Add Admin
              </button>
            </header>

            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Office</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody data-admin-table-body>
                  ${renderTableRows()}
                  <tr class="d-none" data-admin-empty-row>
                    <td colspan="6" class="text-center py-3">No administrators found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <footer class="admin-directory-card-foot">
              <p class="admin-pagination-summary" data-admin-pagination-summary></p>
              <div data-admin-pagination>
                ${renderSharedPagination()}
              </div>
            </footer>
          </section>
        </article>
      </section>
      ${renderSharedModal('admin-directory-modal')}
    `,
  )
}

export function setupadministrators_directory_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, ADMIN_SHELL_CONFIG)
  const modalController = setupSharedModal(root, { modalSelector: '#admin-directory-modal' })
  const modalElement = root.querySelector<HTMLElement>('#admin-directory-modal')
  const searchInput = root.querySelector<HTMLInputElement>('[data-admin-search]')
  const allRows = Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-admin-row]'))
  const emptyRow = root.querySelector<HTMLTableRowElement>('[data-admin-empty-row]')
  const paginationRoot = root.querySelector<HTMLElement>('[data-admin-pagination]')
  const summary = root.querySelector<HTMLElement>('[data-admin-pagination-summary]')
  const pageSize = 5
  let currentPage = 1
  let filteredRows = [...allRows]

  const pagination = paginationRoot
    ? setupSharedPagination(paginationRoot, {
        totalItems: filteredRows.length,
        pageSize,
        currentPage,
        onPageChange: (page) => {
          currentPage = page
          renderVisibleRows()
        },
      })
    : null

  const renderVisibleRows = (): void => {
    allRows.forEach((row) => row.classList.add('d-none'))
    const totalItems = filteredRows.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

    if (currentPage > totalPages) {
      currentPage = totalPages
    }

    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    const visibleRows = filteredRows.slice(start, end)
    visibleRows.forEach((row) => row.classList.remove('d-none'))

    if (emptyRow) {
      emptyRow.classList.toggle('d-none', totalItems > 0)
    }

    if (summary) {
      if (totalItems === 0) {
        summary.textContent = 'Showing 0 of 0 administrators'
      } else {
        const from = start + 1
        const to = Math.min(end, totalItems)
        summary.textContent = `Showing ${from}-${to} of ${totalItems} administrators`
      }
    }

    pagination?.update({ totalItems, currentPage })
  }

  const applySearch = (): void => {
    const query = (searchInput?.value ?? '').trim().toLowerCase()
    filteredRows = allRows.filter((row) => {
      const value = row.dataset.searchValue ?? ''
      return value.includes(query)
    })
    currentPage = 1
    renderVisibleRows()
  }

  const escapeHtml = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const readRecordFromRow = (row: HTMLTableRowElement): AdministratorRecord => {
    const cells = row.querySelectorAll<HTMLTableCellElement>('td')
    const name = cells[0]?.textContent?.trim() ?? ''
    const position = cells[1]?.textContent?.trim() ?? ''
    const office = cells[2]?.textContent?.trim() ?? ''
    const email = cells[3]?.textContent?.trim() ?? ''
    const statusText = cells[4]?.textContent?.trim() ?? 'Active'
    const status: AdministratorRecord['status'] =
      statusText === 'On Leave' || statusText === 'Inactive' ? statusText : 'Active'

    return { name, position, office, email, status }
  }

  const renderAdminForm = (record?: AdministratorRecord, readonly = false): string => {
    const disabled = readonly ? 'readonly' : ''
    const selectDisabled = readonly ? 'disabled' : ''
    const activeSelected = record?.status === 'Active' ? 'selected' : ''
    const leaveSelected = record?.status === 'On Leave' ? 'selected' : ''
    const inactiveSelected = record?.status === 'Inactive' ? 'selected' : ''
    const nameParts = (record?.name ?? '').trim().split(/\s+/).filter(Boolean)
    const firstName = nameParts.shift() ?? ''
    const lastName = nameParts.pop() ?? ''
    const middleName = nameParts.join(' ')

    return `
      <form class="needs-validation" data-admin-modal-form novalidate>
        <div class="shared-modal-grid shared-modal-grid-4">
          <div class="form-floating">
            <input type="text" class="form-control" id="admin-modal-first-name" placeholder="First name" value="${escapeHtml(firstName)}" ${disabled} required />
            <label for="admin-modal-first-name">First name</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="admin-modal-middle-name" placeholder="Middle name (optional)" value="${escapeHtml(middleName)}" ${disabled} />
            <label for="admin-modal-middle-name">Middle name (optional)</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="admin-modal-last-name" placeholder="Last name" value="${escapeHtml(lastName)}" ${disabled} required />
            <label for="admin-modal-last-name">Last name</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="admin-modal-position" placeholder="Position" value="${escapeHtml(record?.position ?? '')}" ${disabled} required />
            <label for="admin-modal-position">Position</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="admin-modal-office" placeholder="Office" value="${escapeHtml(record?.office ?? '')}" ${disabled} required />
            <label for="admin-modal-office">Office</label>
          </div>
          <div class="form-floating">
            <input type="email" class="form-control" id="admin-modal-email" placeholder="Email address" value="${escapeHtml(record?.email ?? '')}" ${disabled} required />
            <label for="admin-modal-email">Email address</label>
          </div>
          <div class="form-floating">
            <select class="form-select" id="admin-modal-status" ${selectDisabled}>
              <option value="Active" ${activeSelected}>Active</option>
              <option value="On Leave" ${leaveSelected}>On Leave</option>
              <option value="Inactive" ${inactiveSelected}>Inactive</option>
            </select>
            <label for="admin-modal-status">Status</label>
          </div>
        </div>
      </form>
    `
  }

  const openFormModal = (
    title: string,
    confirmLabel: string,
    formHtml: string,
    onConfirm: (() => void) | null = null,
    hideConfirm = false,
  ): void => {
    modalController.setOnConfirm(onConfirm)
    modalController.open({
      title,
      bodyHtml: formHtml,
      confirmLabel,
      hideConfirm,
    })
  }

  const submitModalForm = (): void => {
    const form = modalElement?.querySelector<HTMLFormElement>('[data-admin-modal-form]')
    if (!form) {
      modalController.close()
      return
    }

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    modalController.close()
  }

  const onActionClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    if (!target) return

    if (target.closest('[data-admin-open-add]')) {
      modalController.setMode('form')
      openFormModal('Add Administrator', 'Add Admin', renderAdminForm(), submitModalForm)
      return
    }

    const actionButton = target.closest<HTMLButtonElement>('[data-admin-action]')
    if (!actionButton) return

    const row = actionButton.closest<HTMLTableRowElement>('[data-admin-row]')
    if (!row) return

    const action = actionButton.dataset.adminAction
    const record = readRecordFromRow(row)

    if (action === 'view') {
      modalController.setMode('form')
      openFormModal('View Administrator', 'Close', renderAdminForm(record, true), null, true)
      return
    }

    if (action === 'edit') {
      modalController.setMode('form')
      openFormModal('Edit Administrator', 'Save Changes', renderAdminForm(record), submitModalForm)
      return
    }

    if (action === 'deactivate') {
      modalController.setMode('confirm')
      openFormModal(
        'Deactivate Administrator',
        'Deactivate',
        `<p class="mb-0">Deactivate <strong>${escapeHtml(record.name)}</strong>?</p>`,
        () => modalController.close(),
      )
      return
    }

    if (action === 'delete') {
      modalController.setMode('confirm')
      openFormModal(
        'Delete Administrator',
        'Delete',
        `<p class="mb-0 text-danger">Delete <strong>${escapeHtml(record.name)}</strong> from the directory?</p>`,
        () => modalController.close(),
      )
    }
  }

  searchInput?.addEventListener('input', applySearch)
  root.addEventListener('click', onActionClick)
  renderVisibleRows()

  return () => {
    cleanupShell()
    modalController.destroy()
    pagination?.destroy()
    searchInput?.removeEventListener('input', applySearch)
    root.removeEventListener('click', onActionClick)
  }
}

