import { ROUTES } from '../../../app/routes'
import { HR_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderActionView } from '../../../components/ui/action_view'
import { renderSharedModal, setupSharedModal } from '../../../components/ui/modal'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSharedPagination, setupSharedPagination } from '../../../components/ui/pagination'
import { renderSharedPopover } from '../../../components/ui/popover'
import { renderSectionTitle } from '../../../components/ui/section_title_heading'
import { renderDepartmentDisplay } from '../../../components/ui/department_badge'
import { DEPARTMENTS } from '../../../data/departments'

type FacultyRecord = {
  schoolId: string
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  departmentCode: string
  department: string
  email: string
  mobileNumber: string
  role: 'Instructor'
  status: 'Active' | 'Inactive'
}

const FACULTY: FacultyRecord[] = Array.from({ length: 18 }, (_, index) => {
  const num = index + 1
  const department = DEPARTMENTS[index % DEPARTMENTS.length]
  return {
    schoolId: `FAC-${String(num).padStart(4, '0')}`,
    firstName: `Faculty${num}`,
    middleName: num % 3 === 0 ? '' : String.fromCharCode(65 + (num % 26)),
    lastName: `Lastname${num}`,
    suffix: num % 7 === 0 ? 'Jr.' : '',
    departmentCode: department.code,
    department: department.college,
    email: `faculty${num}@gwc.edu.ph`,
    mobileNumber: `09${String(700000000 + num).slice(0, 9)}`,
    role: 'Instructor',
    status: num % 5 === 0 ? 'Inactive' : 'Active',
  }
})

const FACULTY_BY_ID = new Map(FACULTY.map((faculty) => [faculty.schoolId, faculty]))

const buildFacultySearchValue = (faculty: FacultyRecord): string =>
  `${faculty.schoolId} ${faculty.firstName} ${faculty.middleName} ${faculty.lastName} ${faculty.suffix} ${faculty.departmentCode} ${faculty.department} ${faculty.role} ${faculty.status}`
    .trim()
    .toLowerCase()

const buildFullName = (faculty: FacultyRecord): string =>
  [faculty.firstName, faculty.middleName, faculty.lastName, faculty.suffix].filter(Boolean).join(' ')

const renderFacultyDetails = (faculty: FacultyRecord): string =>
  renderActionView([
    {
      title: 'Faculty Details',
      fields: [
        { label: 'School ID', value: faculty.schoolId },
        { label: 'Name', value: buildFullName(faculty) },
        { label: 'Department', value: faculty.departmentCode },
        { label: 'Role', value: faculty.role },
        { label: 'Email', value: faculty.email },
        { label: 'Mobile Number', value: faculty.mobileNumber },
        {
          label: 'Status',
          value: faculty.status,
          valueHtml: `<span class="admin-pill ${faculty.status === 'Active' ? 'is-active' : 'is-inactive'}">${faculty.status}</span>`,
        },
      ],
    },
  ])

const renderFacultyEditForm = (faculty: FacultyRecord): string => {
  const departmentOptions = DEPARTMENTS.map(
    (department) =>
      `<option value="${department.code}" ${department.code === faculty.departmentCode ? 'selected' : ''}>${department.code}</option>`,
  ).join('')

  return `
    <div class="action-view-wrap">
      <section class="action-view-section">
        ${renderSectionTitle('Basic Information')}
        <div class="shared-modal-grid shared-modal-grid-3">
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${faculty.firstName}" data-hr-faculty-edit="firstName" />
            <label>First Name</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${faculty.middleName}" data-hr-faculty-edit="middleName" />
            <label>Middle Name</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${faculty.lastName}" data-hr-faculty-edit="lastName" />
            <label>Last Name</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${faculty.suffix}" data-hr-faculty-edit="suffix" />
            <label>Suffix</label>
          </div>
          <div class="form-floating">
            <select class="form-select" data-hr-faculty-edit="departmentCode">
              ${departmentOptions}
            </select>
            <label>Department</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${faculty.role}" readonly />
            <label>Role</label>
          </div>
        </div>
      </section>

      <section class="action-view-section">
        ${renderSectionTitle('Contact')}
        <div class="shared-modal-grid shared-modal-grid-2">
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${faculty.email}" data-hr-faculty-edit="email" />
            <label>Email</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder=" " value="${faculty.mobileNumber}" data-hr-faculty-edit="mobileNumber" />
            <label>Mobile Number</label>
          </div>
        </div>
      </section>

      <section class="action-view-section">
        ${renderSectionTitle('Status')}
        <div class="shared-modal-grid shared-modal-grid-1">
          <div class="form-floating">
            <select class="form-select" data-hr-faculty-edit="status">
              <option value="Active" ${faculty.status === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${faculty.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
            <label>Status</label>
          </div>
        </div>
      </section>
    </div>
  `
}

function renderRows(): string {
  return FACULTY.map((faculty) => {
    const statusClass = faculty.status === 'Active' ? 'is-active' : 'is-inactive'
    const fullName = buildFullName(faculty)
    const searchValue = buildFacultySearchValue(faculty)
    return `
      <tr data-hr-faculty-row data-hr-faculty-id="${faculty.schoolId}" data-search-value="${searchValue}">
        <td>${faculty.schoolId}</td>
        <td>${fullName}</td>
        <td>${renderDepartmentDisplay(faculty.departmentCode)}</td>
        <td>${faculty.role}</td>
        <td><span class="admin-pill ${statusClass}">${faculty.status}</span></td>
        <td class="admin-student-actions">
          ${renderSharedPopover({
            ariaLabel: 'Faculty row actions',
            triggerLabel: '<i class="bi bi-three-dots-vertical" aria-hidden="true"></i>',
            actionDataAttribute: 'data-hr-faculty-action',
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

export function renderhr_faculty_manage_page(): string {
  return renderPortalShell(
    HR_SHELL_CONFIG,
    'faculty',
    `
      <section class="hr-content">
        ${renderBreadcrumbNav([
          { label: 'Faculty', href: ROUTES.HR_FACULTY },
          { label: 'Manage Faculty', active: true },
        ])}

        <article class="hr-faculty-page-shell">
          <header class="hr-faculty-head">
            <h2>Manage Faculty</h2>
          </header>

          <section class="hr-faculty-toolbar">
            <div class="hr-faculty-toolbar-actions">
              <a href="${ROUTES.HR_FACULTY_CREATE}" class="btn btn-primary btn-sm">+ Create Faculty</a>
            </div>
            <label class="admin-directory-search hr-faculty-search">
              <span class="admin-search-icon" aria-hidden="true"><i class="bi bi-search"></i></span>
              <input
                type="search"
                placeholder="Search by school id, name, department"
                aria-label="Search faculty"
                data-hr-faculty-search
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
                <tr class="d-none" data-hr-faculty-empty-row>
                  <td colspan="6" class="text-center py-3">No faculty found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="admin-student-pagination" data-hr-faculty-pagination>
            <p class="admin-student-pagination-meta" data-hr-faculty-pagination-meta>Showing 0 to 0 of 0</p>
            ${renderSharedPagination()}
          </div>
        </article>
      </section>
      ${renderSharedModal('hr-faculty-manage-modal')}
    `,
  )
}

export function setuphr_faculty_manage_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, HR_SHELL_CONFIG)
  const modal = setupSharedModal(root, { modalSelector: '#hr-faculty-manage-modal' })
  const searchInput = root.querySelector<HTMLInputElement>('[data-hr-faculty-search]')
  const rows = Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-hr-faculty-row]'))
  const emptyRow = root.querySelector<HTMLTableRowElement>('[data-hr-faculty-empty-row]')
  const paginationRoot = root.querySelector<HTMLElement>('[data-hr-faculty-pagination]')
  const paginationMeta = root.querySelector<HTMLElement>('[data-hr-faculty-pagination-meta]')
  const pageSize = 10
  let currentPage = 1
  let filteredRows = [...rows]
  let activeFacultyId: string | null = null

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

  const updateRow = (faculty: FacultyRecord): void => {
    const row = root.querySelector<HTMLTableRowElement>(`[data-hr-faculty-row][data-hr-faculty-id="${faculty.schoolId}"]`)
    if (!row) return

    const cells = row.querySelectorAll<HTMLTableCellElement>('td')
    if (cells[1]) cells[1].textContent = buildFullName(faculty)
    if (cells[2]) cells[2].innerHTML = renderDepartmentDisplay(faculty.departmentCode)
    if (cells[3]) cells[3].textContent = faculty.role
    if (cells[4]) {
      const statusClass = faculty.status === 'Active' ? 'is-active' : 'is-inactive'
      cells[4].innerHTML = `<span class="admin-pill ${statusClass}">${faculty.status}</span>`
    }

    row.dataset.searchValue = buildFacultySearchValue(faculty)
  }

  const onRootClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const actionButton = target?.closest<HTMLButtonElement>('[data-hr-faculty-action]')
    if (!actionButton) return

    const row = actionButton.closest<HTMLTableRowElement>('[data-hr-faculty-row]')
    const schoolId = row?.dataset.hrFacultyId
    if (!schoolId) return
    const faculty = FACULTY_BY_ID.get(schoolId)
    if (!faculty) return
    activeFacultyId = schoolId

    const action = actionButton.dataset.hrFacultyAction
    if (action === 'view') {
      modal.setMode('default')
      modal.setOnConfirm(null)
      modal.open({
        title: `Faculty ${schoolId}`,
        bodyHtml: renderFacultyDetails(faculty),
        hideConfirm: true,
      })
      return
    }

    if (action === 'edit') {
      modal.setMode('form')
      modal.setOnConfirm(() => {
        if (!activeFacultyId) return
        const current = FACULTY_BY_ID.get(activeFacultyId)
        if (!current) return

        const inputs = Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-hr-faculty-edit]'))
        inputs.forEach((input) => {
          const field = input.dataset.hrFacultyEdit as keyof FacultyRecord | undefined
          if (!field) return
          if (field === 'departmentCode') {
            const nextDept = DEPARTMENTS.find((dept) => dept.code === input.value)
            current.departmentCode = input.value
            current.department = nextDept?.college ?? current.department
            return
          }
          if (field === 'status') {
            current.status = input.value as FacultyRecord['status']
            return
          }
          if (field === 'role') return
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
        bodyHtml: renderFacultyEditForm(faculty),
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
