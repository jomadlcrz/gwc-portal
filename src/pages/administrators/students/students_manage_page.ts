import { ROUTES } from '../../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSharedModal, setupSharedModal } from '../../../components/ui/modal'
import { renderSharedPagination, setupSharedPagination } from '../../../components/ui/pagination'
import { renderSharedPopover } from '../../../components/ui/popover'
import { renderAdminSectionTitle, renderAdminSubheading } from '../../../components/ui/admin_section_heading'
import { renderStudentAccountForm } from '../../../components/forms/student_account_form'

type StudentRecord = {
  studentNo: string
  firstName: string
  middleName: string
  lastName: string
  name: string
  course: string
  year: string
  email: string
  phone: string
  section: string
  studentType: 'Regular' | 'Irregular'
  semester: string
  gender: 'Male' | 'Female'
  birthDate: string
  province: string
  city: string
  barangay: string
  street: string
  fatherFirstName: string
  fatherMiddleName: string
  fatherLastName: string
  fatherContactNumber: string
  motherFirstName: string
  motherMiddleName: string
  motherLastName: string
  motherContactNumber: string
  guardianFirstName: string
  guardianMiddleName: string
  guardianLastName: string
  guardianContactNumber: string
  guardianRelation: string
  lastLogin: string
  status: 'Active' | 'Inactive'
}

const STUDENTS: StudentRecord[] = Array.from({ length: 30 }, (_, index) => {
  const num = index + 1
  const status: StudentRecord['status'] = num % 5 === 0 ? 'Inactive' : 'Active'
  const firstName = `Student${num}`
  const middleName = String.fromCharCode(65 + (num % 26))
  const lastName = `Lastname${num}`
  return {
    studentNo: `2025-${String(num).padStart(4, '0')}`,
    firstName,
    middleName,
    lastName,
    name: `${firstName} ${lastName}`,
    course: num % 2 === 0 ? 'BSIT' : 'BSCS',
    year: String((num % 4) + 1),
    email: `student${num}@gwc.edu.ph`,
    phone: `09${String(100000000 + num).slice(0, 9)}`,
    section: `${num % 2 === 0 ? 'A' : 'B'}-${(num % 4) + 1}`,
    studentType: num % 3 === 0 ? 'Irregular' : 'Regular',
    semester: num % 2 === 0 ? '2nd Semester' : '1st Semester',
    gender: num % 2 === 0 ? 'Male' : 'Female',
    birthDate: `200${num % 10}-0${(num % 9) + 1}-1${num % 9}`,
    province: 'Pampanga',
    city: num % 2 === 0 ? 'San Fernando' : 'Angeles City',
    barangay: `Barangay ${String((num % 12) + 1).padStart(2, '0')}`,
    street: `Block ${String((num % 8) + 1).padStart(2, '0')}, Lot ${String((num % 15) + 1).padStart(2, '0')}`,
    fatherFirstName: `Father${num}`,
    fatherMiddleName: String.fromCharCode(65 + ((num + 3) % 26)),
    fatherLastName: `Lastname${num}`,
    fatherContactNumber: `09${String(300000000 + num).slice(0, 9)}`,
    motherFirstName: `Mother${num}`,
    motherMiddleName: String.fromCharCode(65 + ((num + 6) % 26)),
    motherLastName: `Lastname${num}`,
    motherContactNumber: `09${String(400000000 + num).slice(0, 9)}`,
    guardianFirstName: `Guardian${num}`,
    guardianMiddleName: String.fromCharCode(65 + ((num + 9) % 26)),
    guardianLastName: `Lastname${num}`,
    guardianContactNumber: `09${String(500000000 + num).slice(0, 9)}`,
    guardianRelation: num % 2 === 0 ? 'Aunt' : 'Uncle',
    lastLogin: `2026-04-${String((num % 28) + 1).padStart(2, '0')} 08:${String((num % 6) * 10).padStart(2, '0')}`,
    status,
  }
})

const STUDENTS_BY_NO = new Map(STUDENTS.map((student) => [student.studentNo, student]))

type DetailField = {
  label: string
  value: string
  pillClass?: string
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function renderDetailField(field: DetailField): string {
  const valueHtml = field.pillClass
    ? `<span class="admin-pill ${field.pillClass}">${escapeHtml(field.value)}</span>`
    : `<strong>${escapeHtml(field.value)}</strong>`
  return `<div class="action-view-item"><p>${escapeHtml(field.label)}</p>${valueHtml}</div>`
}

function renderDetailSection(title: string, fields: DetailField[]): string {
  return `
    <section class="action-view-section">
      ${renderAdminSectionTitle(title)}
      <div class="action-view-grid">
        ${fields.map((field) => renderDetailField(field)).join('')}
      </div>
    </section>
  `
}

function renderParentGuardianSection(student: StudentRecord): string {
  return `
    <section class="action-view-section">
      ${renderAdminSectionTitle("Parent and Guardian's Information")}
      <div class="admin-student-guardian-stack">
        <div>
          ${renderAdminSubheading('Father')}
          <div class="action-view-grid">
            ${renderDetailField({ label: 'First Name', value: student.fatherFirstName })}
            ${renderDetailField({ label: 'Middle Name', value: student.fatherMiddleName })}
            ${renderDetailField({ label: 'Last Name', value: student.fatherLastName })}
            ${renderDetailField({ label: 'Contact Number', value: student.fatherContactNumber })}
          </div>
        </div>

        <div>
          ${renderAdminSubheading('Mother')}
          <div class="action-view-grid">
            ${renderDetailField({ label: 'First Name', value: student.motherFirstName })}
            ${renderDetailField({ label: 'Middle Name', value: student.motherMiddleName })}
            ${renderDetailField({ label: 'Last Name', value: student.motherLastName })}
            ${renderDetailField({ label: 'Contact Number', value: student.motherContactNumber })}
          </div>
        </div>

        <div>
          ${renderAdminSubheading('Guardian')}
          <div class="action-view-grid">
            ${renderDetailField({ label: 'First Name', value: student.guardianFirstName })}
            ${renderDetailField({ label: 'Middle Name', value: student.guardianMiddleName })}
            ${renderDetailField({ label: 'Last Name', value: student.guardianLastName })}
            ${renderDetailField({ label: 'Contact Number', value: student.guardianContactNumber })}
            ${renderDetailField({ label: 'Relation', value: student.guardianRelation })}
          </div>
        </div>
      </div>
    </section>
  `
}

function renderStudentFullDetails(student: StudentRecord): string {
  return `
    <div class="action-view-wrap action-view-separated">
      ${renderDetailSection('Student Information', [
        { label: 'Student No.', value: student.studentNo },
        { label: 'First Name', value: student.firstName },
        { label: 'Middle Name', value: student.middleName },
        { label: 'Last Name', value: student.lastName },
        { label: 'Course', value: student.course },
        { label: 'Year Level', value: student.year },
        { label: 'Section', value: student.section },
        { label: 'Student Type', value: student.studentType },
        { label: 'Semester', value: student.semester },
        {
          label: 'Status',
          value: student.status,
          pillClass: student.status === 'Active' ? 'is-active' : 'is-inactive',
        },
      ])}
      ${renderDetailSection('Account and Contact', [
        { label: 'Email', value: student.email },
        { label: 'Phone', value: student.phone },
        { label: 'Last Login', value: student.lastLogin },
      ])}
      ${renderDetailSection('Personal and Address', [
        { label: 'Gender', value: student.gender },
        { label: 'Birth Date', value: student.birthDate },
        { label: 'Province', value: student.province },
        { label: 'City', value: student.city },
        { label: 'Barangay', value: student.barangay },
        { label: 'Street', value: student.street },
      ])}
      ${renderParentGuardianSection(student)}
    </div>
  `
}

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
            triggerLabel: '<i class="bi bi-three-dots-vertical" aria-hidden="true"></i>',
            actionDataAttribute: 'data-student-action',
            actions: [
              { label: 'View Full Details', value: 'view' },
              { label: 'Reset Password', value: 'reset-password' },
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
              <span class="admin-search-icon" aria-hidden="true"><i class="bi bi-search"></i></span>
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

  const onActionClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const actionButton = target?.closest<HTMLButtonElement>('[data-student-action]')
    if (!actionButton) return

    const row = actionButton.closest<HTMLTableRowElement>('[data-student-row]')
    if (!row) return
    const studentNo = row.querySelector('td:nth-child(1)')?.textContent?.trim() ?? ''
    const studentRecord = STUDENTS_BY_NO.get(studentNo)
    if (!studentRecord) return

    const studentName = studentRecord.name
    const action = actionButton.dataset.studentAction

    if (action === 'view') {
      modal.setMode('form')
      modal.setOnConfirm(null)
      modal.open({
        title: 'Student Full Details',
        confirmLabel: 'Close',
        bodyHtml: renderStudentFullDetails(studentRecord),
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
    modal.setOnConfirm(() => {
      modal.setMode('default')
      modal.setOnConfirm(null)
      modal.open({
        title: 'Password Reset Sent',
        bodyHtml: `
          <p class="mb-2">
            <strong>${studentName}</strong>'s password has been reset successfully.
          </p>
          <p class="mb-0">
            A new temporary password was generated and sent to <strong>${studentRecord.email}</strong>.
          </p>
        `,
        confirmLabel: 'Close',
        hideConfirm: true,
      })
    })
    modal.open({
      title: 'Reset Student Password',
      confirmLabel: 'Reset Password',
      bodyHtml: `
        <p class="mb-2">Reset password for <strong>${studentName}</strong>?</p>
        <p class="mb-0">This will generate a new temporary password and send it to <strong>${studentRecord.email}</strong>.</p>
      `,
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


