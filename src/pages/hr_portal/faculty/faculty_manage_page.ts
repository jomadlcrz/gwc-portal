import { ROUTES } from '../../../app/routes'
import { HR_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
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

function renderRows(): string {
  return FACULTY.map((faculty) => {
    const statusClass = faculty.status === 'Active' ? 'is-active' : 'is-inactive'
    const fullName = [faculty.firstName, faculty.middleName, faculty.lastName, faculty.suffix].filter(Boolean).join(' ')
    const searchValue = `${faculty.schoolId} ${fullName} ${faculty.departmentCode} ${faculty.department} ${faculty.email}`.toLowerCase()
    return `
      <tr data-hr-faculty-row data-search-value="${searchValue}">
        <td>${faculty.schoolId}</td>
        <td>${fullName}</td>
        <td><span class="hr-dept-code hr-dept-code-${faculty.departmentCode.toLowerCase()}">${faculty.departmentCode}</span> - ${faculty.department}</td>
        <td>${faculty.email}</td>
        <td>${faculty.mobileNumber}</td>
        <td>${faculty.role}</td>
        <td><span class="admin-pill ${statusClass}">${faculty.status}</span></td>
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
            <p>Total Faculty: <strong>${FACULTY.length}</strong></p>
          </header>

          <section class="hr-faculty-toolbar">
            <div class="hr-faculty-toolbar-actions">
              <a href="${ROUTES.HR_FACULTY_CREATE}" class="btn btn-primary btn-sm">+ Create Faculty</a>
            </div>
            <label class="admin-directory-search hr-faculty-search">
              <span class="admin-search-icon" aria-hidden="true"><i class="bi bi-search"></i></span>
              <input
                type="search"
                placeholder="Search by school id, name, department, email"
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
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows()}
                <tr class="d-none" data-hr-faculty-empty-row>
                  <td colspan="7" class="text-center py-3">No faculty found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    `,
  )
}

export function setuphr_faculty_manage_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, HR_SHELL_CONFIG)
  const searchInput = root.querySelector<HTMLInputElement>('[data-hr-faculty-search]')
  const rows = Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-hr-faculty-row]'))
  const emptyRow = root.querySelector<HTMLTableRowElement>('[data-hr-faculty-empty-row]')

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
