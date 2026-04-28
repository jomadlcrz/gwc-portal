import { ROUTES } from '../../../app/routes'
import { HR_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderDepartmentDisplay } from '../../../components/ui/department_badge'
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

function renderRows(): string {
  return DEANS.map((dean) => {
    const statusClass = dean.status === 'Active' ? 'is-active' : 'is-inactive'
    const fullName = [dean.firstName, dean.middleName, dean.lastName, dean.suffix].filter(Boolean).join(' ')
    const searchValue = `${dean.schoolId} ${fullName} ${dean.departmentCode} ${dean.department} ${dean.email}`.toLowerCase()
    return `
      <tr data-hr-dean-row data-search-value="${searchValue}">
        <td>${dean.schoolId}</td>
        <td>${fullName}</td>
        <td>${renderDepartmentDisplay(dean.departmentCode)}</td>
        <td>${dean.email}</td>
        <td>${dean.mobileNumber}</td>
        <td>${dean.role}</td>
        <td><span class="admin-pill ${statusClass}">${dean.status}</span></td>
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
            <p>Total Dean Accounts: <strong>${DEANS.length}</strong></p>
          </header>

          <section class="hr-faculty-toolbar">
            <div class="hr-faculty-toolbar-actions">
              <a href="${ROUTES.HR_DEAN_CREATE}" class="btn btn-primary btn-sm">+ Create Dean</a>
            </div>
            <label class="admin-directory-search hr-faculty-search">
              <span class="admin-search-icon" aria-hidden="true"><i class="bi bi-search"></i></span>
              <input
                type="search"
                placeholder="Search by school id, name, department, email"
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
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows()}
                <tr class="d-none" data-hr-dean-empty-row>
                  <td colspan="7" class="text-center py-3">No dean found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    `,
  )
}

export function setuphr_dean_manage_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, HR_SHELL_CONFIG)
  const searchInput = root.querySelector<HTMLInputElement>('[data-hr-dean-search]')
  const rows = Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-hr-dean-row]'))
  const emptyRow = root.querySelector<HTMLTableRowElement>('[data-hr-dean-empty-row]')

  const applySearch = (): void => {
    const query = (searchInput?.value ?? '').trim().toLowerCase()
    let visibleCount = 0
    rows.forEach((row) => {
      const match = (row.dataset.searchValue ?? '').includes(query)
      row.classList.toggle('d-none', !match)
      if (match) visibleCount += 1
    })
    emptyRow?.classList.toggle('d-none', visibleCount > 0)
  }

  searchInput?.addEventListener('input', applySearch)

  return () => {
    searchInput?.removeEventListener('input', applySearch)
    cleanupShell()
  }
}
