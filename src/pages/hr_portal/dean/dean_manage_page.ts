import { ROUTES } from '../../../app/routes'
import { HR_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderActionView } from '../../../components/ui/action_view'
import { renderSharedModal, setupSharedModal } from '../../../components/ui/modal'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderDepartmentDisplay } from '../../../components/ui/department_badge'
import { renderSharedPagination, setupSharedPagination } from '../../../components/ui/pagination'
import { renderSharedPopover } from '../../../components/ui/popover'
import { renderSectionTitle } from '../../../components/ui/section_title_heading'
import { DEPARTMENTS } from '../../../data/departments'

type DeanRecord = {
  schoolId: string
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  departmentCode: string
  department: string
  email: string
  mobileNumber: string
  role: 'Dean'
  status: 'Active' | 'Inactive'
}

const DEANS: DeanRecord[] = DEPARTMENTS.map((department, index) => {
  const num = index + 1
  return {
    schoolId: `DEAN-${String(num).padStart(3, '0')}`,
    firstName: `Dean${num}`,
    middleName: num % 2 === 0 ? '' : String.fromCharCode(65 + (num % 26)),
    lastName: `Lastname${num}`,
    suffix: num % 4 === 0 ? 'Jr.' : '',
    departmentCode: department.code,
    department: department.college,
    email: `dean${num}@gwc.edu.ph`,
    mobileNumber: `09${String(730000000 + num).slice(0, 9)}`,
    role: 'Dean',
    status: num % 6 === 0 ? 'Inactive' : 'Active',
  }
})

const DEANS_BY_ID = new Map(DEANS.map((dean) => [dean.schoolId, dean]))

const buildDeanSearchValue = (dean: DeanRecord): string =>
  `${dean.schoolId} ${dean.firstName} ${dean.middleName} ${dean.lastName} ${dean.suffix} ${dean.departmentCode} ${dean.department} ${dean.role} ${dean.status}`
    .trim()
    .toLowerCase()

const buildFullName = (dean: DeanRecord): string =>
  [dean.firstName, dean.middleName, dean.lastName, dean.suffix].filter(Boolean).join(' ')

const renderDeanDetails = (dean: DeanRecord): string =>
  renderActionView([
    {
      title: 'Dean Details',
      fields: [
        { label: 'School ID', value: dean.schoolId },
        { label: 'Name', value: buildFullName(dean) },
        { label: 'Department', value: dean.departmentCode },
        { label: 'Role', value: dean.role },
        { label: 'Email', value: dean.email },
        { label: 'Mobile Number', value: dean.mobileNumber },
        {
          label: 'Status',
          value: dean.status,
          valueHtml: `<span class="admin-pill ${dean.status === 'Active' ? 'is-active' : 'is-inactive'}">${dean.status}</span>`,
        },
      ],
    },
  ])

const renderDeanEditForm = (dean: DeanRecord): string => {
  const departmentOptions = DEPARTMENTS.map(
    (department) =>
      `<option value="${department.code}" ${department.code === dean.departmentCode ? 'selected' : ''}>${department.code}</option>`,
  ).join('')

  return `
    <div class="action-view-wrap">
      <section class="action-view-section">
        ${renderSectionTitle('Basic Information')}
        <div class="shared-modal-grid shared-modal-grid-3">
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${dean.firstName}" data-hr-dean-edit="firstName" />
            <label>First Name</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${dean.middleName}" data-hr-dean-edit="middleName" />
            <label>Middle Name</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${dean.lastName}" data-hr-dean-edit="lastName" />
            <label>Last Name</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${dean.suffix}" data-hr-dean-edit="suffix" />
            <label>Suffix</label>
          </div>
          <div class="form-floating">
            <select class="form-select" data-hr-dean-edit="departmentCode">
              ${departmentOptions}
            </select>
            <label>Department</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${dean.role}" readonly />
            <label>Role</label>
          </div>
        </div>
      </section>

      <section class="action-view-section">
        ${renderSectionTitle('Contact')}
        <div class="shared-modal-grid shared-modal-grid-2">
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${dean.email}" data-hr-dean-edit="email" />
            <label>Email</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${dean.mobileNumber}" data-hr-dean-edit="mobileNumber" />
            <label>Mobile Number</label>
          </div>
        </div>
      </section>

      <section class="action-view-section">
        ${renderSectionTitle('Status')}
        <div class="shared-modal-grid shared-modal-grid-1">
          <div class="form-floating">
            <select class="form-select" data-hr-dean-edit="status">
              <option value="Active" ${dean.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${dean.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
            <label>Status</label>
          </div>
        </div>
      </section>
    </div>
  `
}

function renderRows(): string {
  return DEANS.map((dean) => {
    const statusClass = dean.status === 'Active' ? 'is-active' : 'is-inactive'
    const fullName = buildFullName(dean)
    const searchValue = buildDeanSearchValue(dean)
    return `
      <tr data-hr-dean-row data-hr-dean-id="${dean.schoolId}" data-search-value="${searchValue}">
        <td>${dean.schoolId}</td>
        <td>${fullName}</td>
        <td>${renderDepartmentDisplay(dean.departmentCode)}</td>
        <td>${dean.role}</td>
        <td><span class="admin-pill ${statusClass}">${dean.status}</span></td>
        <td class="admin-student-actions">
          ${renderSharedPopover({
            ariaLabel: 'Dean row actions',
            triggerLabel: '<i class="bi bi-three-dots-vertical" aria-hidden="true"></i>',
            actionDataAttribute: 'data-hr-dean-action',
            actions: [
              { label: 'View Details', value: 'view' },
              { label: 'Edit', value: 'edit' },
            ],
          })}
        </td>
      </tr>
    `
  }).join('')
}

export function renderhr_dean_manage_page(): string {
  return renderPortalShell(
    HR_SHELL_CONFIG,
    'dean',
    `
      <section class="hr-content">
        ${renderBreadcrumbNav([
          { label: 'Dean', href: ROUTES.HR_DEAN },
          { label: 'Manage Dean', active: true },
        ])}

        <article class="hr-faculty-page-shell">
          <header class="hr-faculty-head">
            <h2>Manage Dean</h2>
          </header>

          <section class="hr-faculty-toolbar">
            <div class="hr-faculty-toolbar-actions">
              <a href="${ROUTES.HR_DEAN_CREATE}" class="btn btn-primary btn-sm">+ Create Dean</a>
            </div>
            <label class="admin-directory-search hr-faculty-search">
              <span class="admin-search-icon" aria-hidden="true"><i class="bi bi-search"></i></span>
              <input
                type="search"
                placeholder="Search by school id, name, department"
                aria-label="Search dean"
                data-hr-dean-search
              />
            </label>
          </section>

          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>School ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows()}
                <tr class="d-none" data-hr-dean-empty-row>
                  <td colspan="6" class="text-center py-3">No dean found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="admin-student-pagination" data-hr-dean-pagination>
            <p class="admin-student-pagination-meta" data-hr-dean-pagination-meta>Showing 0 to 0 of 0</p>
            ${renderSharedPagination()}
          </div>
        </article>
      </section>
      ${renderSharedModal('hr-dean-manage-modal')}
    `,
  )
}

export function setuphr_dean_manage_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, HR_SHELL_CONFIG)
  const modal = setupSharedModal(root, { modalSelector: '#hr-dean-manage-modal' })
  const searchInput = root.querySelector<HTMLInputElement>('[data-hr-dean-search]')
  const rows = Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-hr-dean-row]'))
  const emptyRow = root.querySelector<HTMLTableRowElement>('[data-hr-dean-empty-row]')
  const paginationRoot = root.querySelector<HTMLElement>('[data-hr-dean-pagination]')
  const paginationMeta = root.querySelector<HTMLElement>('[data-hr-dean-pagination-meta]')
  const pageSize = 10
  let currentPage = 1
  let filteredRows = [...rows]
  let activeDeanId: string | null = null

  const pagination = paginationRoot
    ? setupSharedPagination(paginationRoot, {
        pageSize,
        totalItems: filteredRows.length,
        currentPage,
        onPageChange: (page): void => {
          currentPage = page
          renderVisibleRows()
        },
      })
    : null

  const renderVisibleRows = (): void => {
    rows.forEach((row) => row.classList.add('d-none'))
    const totalItems = filteredRows.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    if (currentPage > totalPages) currentPage = totalPages

    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    filteredRows.slice(start, end).forEach((row) => row.classList.remove('d-none'))
    const showingStart = totalItems === 0 ? 0 : start + 1
    const showingEnd = Math.min(end, totalItems)
    if (paginationMeta) {
      paginationMeta.textContent = `Showing ${showingStart} to ${showingEnd} of ${totalItems}`
    }
    emptyRow?.classList.toggle('d-none', totalItems > 0)
    pagination?.update({ totalItems, currentPage })
  }

  const applySearch = (): void => {
    const query = (searchInput?.value ?? '').trim().toLowerCase()
    filteredRows = rows.filter((row) => (row.dataset.searchValue ?? '').includes(query))
    currentPage = 1
    renderVisibleRows()
  }

  const updateRow = (dean: DeanRecord): void => {
    const row = root.querySelector<HTMLTableRowElement>(`[data-hr-dean-row][data-hr-dean-id="${dean.schoolId}"]`)
    if (!row) return

    const cells = row.querySelectorAll<HTMLTableCellElement>('td')
    if (cells[1]) cells[1].textContent = buildFullName(dean)
    if (cells[2]) cells[2].innerHTML = renderDepartmentDisplay(dean.departmentCode)
    if (cells[3]) cells[3].textContent = dean.role
    if (cells[4]) {
      const statusClass = dean.status === 'Active' ? 'is-active' : 'is-inactive'
      cells[4].innerHTML = `<span class="admin-pill ${statusClass}">${dean.status}</span>`
    }

    row.dataset.searchValue = buildDeanSearchValue(dean)
  }

  const onRootClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const actionButton = target?.closest<HTMLButtonElement>('[data-hr-dean-action]')
    if (!actionButton) return

    const row = actionButton.closest<HTMLTableRowElement>('[data-hr-dean-row]')
    const schoolId = row?.dataset.hrDeanId
    if (!schoolId) return
    const dean = DEANS_BY_ID.get(schoolId)
    if (!dean) return
    activeDeanId = schoolId

    const action = actionButton.dataset.hrDeanAction
    if (action === 'view') {
      modal.setMode('default')
      modal.setOnConfirm(null)
      modal.open({
        title: `Dean ${schoolId}`,
        bodyHtml: renderDeanDetails(dean),
        hideConfirm: true,
      })
      return
    }

    if (action === 'edit') {
      modal.setMode('form')
      modal.setOnConfirm(() => {
        if (!activeDeanId) return
        const current = DEANS_BY_ID.get(activeDeanId)
        if (!current) return

        const inputs = Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-hr-dean-edit]'))
        inputs.forEach((input) => {
          const field = input.dataset.hrDeanEdit as keyof DeanRecord | undefined
          if (!field) return
          if (field === 'departmentCode') {
            const nextDept = DEPARTMENTS.find((dept) => dept.code === input.value)
            current.departmentCode = input.value
            current.department = nextDept?.college ?? current.department
            return
          }
          if (field === 'status') {
            current.status = input.value as DeanRecord['status']
            return
          }
          if (field in current) {
            current[field] = input.value
          }
        })

        updateRow(current)
        applySearch()
        modal.close()
      })
      modal.open({
        title: `Edit ${schoolId}`,
        bodyHtml: renderDeanEditForm(dean),
        confirmLabel: 'Save Changes',
      })
    }
  }

  searchInput?.addEventListener('input', applySearch)
  root.addEventListener('click', onRootClick)
  renderVisibleRows()

  return () => {
    modal.destroy()
    searchInput?.removeEventListener('input', applySearch)
    root.removeEventListener('click', onRootClick)
    pagination?.destroy()
    cleanupShell()
  }
}
