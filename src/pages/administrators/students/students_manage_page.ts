import { ROUTES } from '../../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSharedModal, setupSharedModal } from '../../../components/ui/modal'
import { renderSharedPagination, setupSharedPagination } from '../../../components/ui/pagination'
import { renderSharedPopover } from '../../../components/ui/popover'
import { renderStudentAccountForm } from '../../../components/forms/student_account_form'

type StudentRecord = {
  studentNo: string
  name: string
  course: string
  year: string
  email: string
  status: 'Active' | 'Inactive'
}

const STUDENTS: StudentRecord[] = Array.from({ length: 30 }, (_, index) => {
  const num = index + 1
  const status: StudentRecord['status'] = num % 5 === 0 ? 'Inactive' : 'Active'
  return {
    studentNo: `2025-${String(num).padStart(4, '0')}`,
    name: `Student ${num}`,
    course: num % 2 === 0 ? 'BSIT' : 'BSCS',
    year: String((num % 4) + 1),
    email: `student${num}@gwc.edu.ph`,
    status,
  }
})

function renderRows(): string {
  return STUDENTS.map((student) => {
    const statusClass = student.status === 'Active' ? 'is-active' : 'is-inactive'
    const searchValue = `${student.studentNo} ${student.name} ${student.course} ${student.email}`.toLowerCase()
    return `
      <tr data-student-row data-search-value="${searchValue}">
        <td>${student.studentNo}</td>
        <td>${student.name}</td>
        <td>${student.course}</td>
        <td>${student.year}</td>
        <td>${student.email}</td>
        <td><span class="admin-pill ${statusClass}">${student.status}</span></td>
        <td class="admin-student-actions">
          ${renderSharedPopover({
            ariaLabel: 'Student row actions',
            actionDataAttribute: 'data-student-action',
            actions: [
              { label: 'View', value: 'view' },
              { label: 'Reset', value: 'reset' },
              { label: 'Edit', value: 'edit' },
            ],
          })}
        </td>
      </tr>
    `
  }).join('')
}

export function renderstudents_manage_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'students',
    `
      <section class="admin-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Home', href: ROUTES.ADMINISTRATORS },
          { label: 'Students', href: ROUTES.ADMINISTRATORS_STUDENTS },
          { label: 'Manage Students', active: true },
        ])}

        <article class="admin-student-page-shell">
          <header class="admin-student-head">
            <h2>Manage Students</h2>
            <p>Total Students: <strong>${STUDENTS.length}</strong></p>
          </header>

          <section class="admin-student-toolbar">
            <div class="admin-student-toolbar-actions">
              <a href="${ROUTES.ADMINISTRATORS_STUDENTS_CREATE}" class="btn btn-primary btn-sm">+ Create Student</a>
              <a href="${ROUTES.ADMINISTRATORS_STUDENTS_BULK}" class="btn btn-outline-primary btn-sm">Bulk Upload</a>
            </div>
            <label class="admin-directory-search admin-student-search">
              <span class="admin-search-icon" aria-hidden="true"><i data-lucide="search"></i></span>
              <input
                type="search"
                placeholder="Search by student no, name, course, email"
                aria-label="Search students"
                data-student-search
              />
            </label>
          </section>

          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Student No.</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows()}
                <tr class="d-none" data-student-empty-row>
                  <td colspan="7" class="text-center py-3">No students found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="admin-student-pagination" data-student-pagination>
            ${renderSharedPagination()}
          </div>
        </article>
      </section>
      ${renderSharedModal('students-manage-modal')}
    `,
  )
}

export function setupstudents_manage_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, ADMIN_SHELL_CONFIG)
  const modal = setupSharedModal(root, { modalSelector: '#students-manage-modal' })
  const searchInput = root.querySelector<HTMLInputElement>('[data-student-search]')
  const allRows = Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-student-row]'))
  const emptyRow = root.querySelector<HTMLTableRowElement>('[data-student-empty-row]')
  const paginationRoot = root.querySelector<HTMLElement>('[data-student-pagination]')
  const pageSize = 10
  let currentPage = 1
  let filteredRows = [...allRows]

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
    allRows.forEach((row) => row.classList.add('d-none'))
    const totalItems = filteredRows.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    if (currentPage > totalPages) currentPage = totalPages

    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    filteredRows.slice(start, end).forEach((row) => row.classList.remove('d-none'))
    emptyRow?.classList.toggle('d-none', totalItems > 0)
    pagination?.update({ totalItems, currentPage })
  }

  const applySearch = (): void => {
    const query = (searchInput?.value ?? '').trim().toLowerCase()
    filteredRows = allRows.filter((row) => (row.dataset.searchValue ?? '').includes(query))
    currentPage = 1
    renderVisibleRows()
  }

  const escapeHtml = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const readStudentFromRow = (
    row: HTMLTableRowElement,
  ): { studentNo: string; name: string; course: string; year: string; email: string; status: string } => {
    const cells = row.querySelectorAll<HTMLTableCellElement>('td')
    return {
      studentNo: cells[0]?.textContent?.trim() ?? '',
      name: cells[1]?.textContent?.trim() ?? '',
      course: cells[2]?.textContent?.trim() ?? '',
      year: cells[3]?.textContent?.trim() ?? '',
      email: cells[4]?.textContent?.trim() ?? '',
      status: cells[5]?.textContent?.trim() ?? '',
    }
  }

  const renderStudentView = (student: {
    studentNo: string
    name: string
    course: string
    year: string
    email: string
    status: string
  }): string => `
    <div class="admin-view-wrap">
      <h3><span class="admin-student-section-title">Student Information</span></h3>
      <div class="admin-view-row">
        <div class="admin-view-item"><p>Student No.</p><strong>${escapeHtml(student.studentNo)}</strong></div>
        <div class="admin-view-item"><p>Name</p><strong>${escapeHtml(student.name)}</strong></div>
        <div class="admin-view-item"><p>Course</p><strong>${escapeHtml(student.course)}</strong></div>
      </div>
      <div class="admin-view-row">
        <div class="admin-view-item"><p>Year</p><strong>${escapeHtml(student.year)}</strong></div>
        <div class="admin-view-item"><p>Email</p><strong>${escapeHtml(student.email)}</strong></div>
        <div class="admin-view-item"><p>Status</p><span class="admin-pill ${student.status === 'Active' ? 'is-active' : 'is-inactive'}">${escapeHtml(student.status)}</span></div>
      </div>
    </div>
  `

  const onActionClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const actionButton = target?.closest<HTMLButtonElement>('[data-student-action]')
    if (!actionButton) return

    const row = actionButton.closest<HTMLTableRowElement>('[data-student-row]')
    if (!row) return
    const studentName = row.querySelector('td:nth-child(2)')?.textContent?.trim() ?? 'Student'
    const action = actionButton.dataset.studentAction
    const student = readStudentFromRow(row)

    if (action === 'view') {
      modal.setMode('form')
      modal.setOnConfirm(null)
      modal.open({
        title: 'View Student',
        confirmLabel: 'Close',
        bodyHtml: renderStudentView(student),
        hideConfirm: true,
      })
      return
    }

    if (action === 'edit') {
      modal.setMode('form')
      modal.setOnConfirm(() => modal.close())
      modal.open({
        title: 'Edit Student',
        confirmLabel: 'Save Changes',
        bodyHtml: `
          ${renderStudentAccountForm('edit-student')}
        `,
      })
      return
    }

    modal.setMode('confirm')
    modal.setOnConfirm(() => modal.close())
    modal.open({
      title: 'Reset Student Account',
      confirmLabel: 'Reset',
      bodyHtml: `<p class="mb-0">Reset account credentials for <strong>${studentName}</strong>?</p>`,
    })
  }

  searchInput?.addEventListener('input', applySearch)
  root.addEventListener('click', onActionClick)
  renderVisibleRows()

  return () => {
    cleanupShell()
    modal.destroy()
    pagination?.destroy()
    searchInput?.removeEventListener('input', applySearch)
    root.removeEventListener('click', onActionClick)
  }
}


