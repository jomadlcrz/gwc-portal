import { ROUTES } from '../../../app/routes'
import { REGISTRAR_STAFF_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSharedPagination, setupSharedPagination } from '../../../components/ui/pagination'
import { renderSharedPopover } from '../../../components/ui/popover'
import { renderSharedModal, setupSharedModal } from '../../../components/ui/modal'

type ScheduleRecord = {
  subjectCode: string
  title: string
  section: string
  faculty: string
  room: string
  dayTime: string
  status: 'Open' | 'Closed'
}

const SCHEDULES: ScheduleRecord[] = Array.from({ length: 20 }, (_, index) => {
  const num = index + 1
  const status: ScheduleRecord['status'] = num % 4 === 0 ? 'Closed' : 'Open'
  return {
    subjectCode: `CC${100 + num}`,
    title: num % 2 === 0 ? 'Data Structures' : 'Web Development',
    section: `BSIT-${(num % 4) + 1}A`,
    faculty: num % 2 === 0 ? 'Prof. Maria Dela Cruz' : 'Prof. John Santos',
    room: num % 3 === 0 ? 'Computer Lab 2' : 'Room 301',
    dayTime: num % 2 === 0 ? 'Mon/Wed 08:00-09:30' : 'Tue/Thu 10:00-11:30',
    status,
  }
})

function renderRows(): string {
  return SCHEDULES.map((schedule) => {
    const statusClass = schedule.status === 'Open' ? 'is-active' : 'is-inactive'
    const searchValue = [
      schedule.subjectCode,
      schedule.title,
      schedule.section,
      schedule.faculty,
      schedule.room,
      schedule.dayTime,
      schedule.status,
    ]
      .join(' ')
      .toLowerCase()

    return `
      <tr data-schedule-row data-search-value="${searchValue}">
        <td>${schedule.subjectCode}</td>
        <td>${schedule.title}</td>
        <td>${schedule.section}</td>
        <td>${schedule.faculty}</td>
        <td>${schedule.room}</td>
        <td>${schedule.dayTime}</td>
        <td><span class="admin-pill ${statusClass}">${schedule.status}</span></td>
        <td>
          ${renderSharedPopover({
            ariaLabel: 'Schedule row actions',
            actionDataAttribute: 'data-schedule-action',
            actions: [
              { label: 'View', value: 'view' },
              { label: 'Edit', value: 'edit' },
              { label: 'Close', value: 'close' },
            ],
          })}
        </td>
      </tr>
    `
  }).join('')
}

export function renderregistrar_staff_schedule_manage_page(): string {
  return renderPortalShell(
    REGISTRAR_STAFF_SHELL_CONFIG,
    'schedule',
    `
      <section class="registrar_staff-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Home', href: ROUTES.REGISTRAR_STAFF_DASHBOARD },
          { label: 'Schedule', href: ROUTES.REGISTRAR_STAFF_SCHEDULE },
          { label: 'Manage Schedule', active: true },
        ])}

        <article class="admin-student-page-shell">
          <header class="admin-student-head">
            <h2>Manage Schedule</h2>
            <p>Total Schedules: <strong>${SCHEDULES.length}</strong></p>
          </header>

          <section class="admin-student-toolbar">
            <div class="admin-student-toolbar-actions">
              <a href="${ROUTES.REGISTRAR_STAFF_SCHEDULE_CREATE}" class="btn btn-primary btn-sm">+ Create Schedule</a>
            </div>
            <label class="admin-directory-search admin-student-search">
              <span class="admin-search-icon" aria-hidden="true"><i data-lucide="search"></i></span>
              <input
                type="search"
                placeholder="Search by code, title, section, faculty, room"
                aria-label="Search schedules"
                data-schedule-search
              />
            </label>
          </section>

          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Descriptive Title</th>
                  <th>Section</th>
                  <th>Faculty</th>
                  <th>Room</th>
                  <th>Day/Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows()}
                <tr class="d-none" data-schedule-empty-row>
                  <td colspan="8" class="text-center py-3">No schedules found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="admin-student-pagination" data-schedule-pagination>
            ${renderSharedPagination()}
          </div>
        </article>
      </section>
      ${renderSharedModal('schedule-manage-modal')}
    `,
  )
}

export function setupschedule_manage_page(root: HTMLElement): () => void {
  const modal = setupSharedModal(root, { modalSelector: '#schedule-manage-modal' })
  const searchInput = root.querySelector<HTMLInputElement>('[data-schedule-search]')
  const allRows = Array.from(root.querySelectorAll<HTMLTableRowElement>('[data-schedule-row]'))
  const emptyRow = root.querySelector<HTMLTableRowElement>('[data-schedule-empty-row]')
  const paginationRoot = root.querySelector<HTMLElement>('[data-schedule-pagination]')
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

  const readRow = (row: HTMLTableRowElement): ScheduleRecord => {
    const cells = row.querySelectorAll<HTMLTableCellElement>('td')
    const statusText = cells[6]?.textContent?.trim() === 'Closed' ? 'Closed' : 'Open'
    return {
      subjectCode: cells[0]?.textContent?.trim() ?? '',
      title: cells[1]?.textContent?.trim() ?? '',
      section: cells[2]?.textContent?.trim() ?? '',
      faculty: cells[3]?.textContent?.trim() ?? '',
      room: cells[4]?.textContent?.trim() ?? '',
      dayTime: cells[5]?.textContent?.trim() ?? '',
      status: statusText,
    }
  }

  const renderForm = (schedule: ScheduleRecord, readonly = false): string => {
    const disabled = readonly ? 'readonly' : ''
    const selectDisabled = readonly ? 'disabled' : ''
    const openSelected = schedule.status === 'Open' ? 'selected' : ''
    const closedSelected = schedule.status === 'Closed' ? 'selected' : ''

    return `
      <form class="needs-validation" data-schedule-modal-form novalidate>
        <div class="shared-modal-grid shared-modal-grid-3">
          <div class="form-floating">
            <input type="text" class="form-control" id="schedule-modal-code" placeholder="Subject Code" value="${escapeHtml(schedule.subjectCode)}" ${disabled} required />
            <label for="schedule-modal-code">Subject Code</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="schedule-modal-title" placeholder="Descriptive Title" value="${escapeHtml(schedule.title)}" ${disabled} required />
            <label for="schedule-modal-title">Descriptive Title</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="schedule-modal-section" placeholder="Section" value="${escapeHtml(schedule.section)}" ${disabled} required />
            <label for="schedule-modal-section">Section</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="schedule-modal-faculty" placeholder="Faculty" value="${escapeHtml(schedule.faculty)}" ${disabled} required />
            <label for="schedule-modal-faculty">Faculty</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="schedule-modal-room" placeholder="Room" value="${escapeHtml(schedule.room)}" ${disabled} required />
            <label for="schedule-modal-room">Room</label>
          </div>
          <div class="form-floating">
            <input type="text" class="form-control" id="schedule-modal-day-time" placeholder="Day/Time" value="${escapeHtml(schedule.dayTime)}" ${disabled} required />
            <label for="schedule-modal-day-time">Day/Time</label>
          </div>
          <div class="form-floating">
            <select class="form-select" id="schedule-modal-status" ${selectDisabled}>
              <option value="Open" ${openSelected}>Open</option>
              <option value="Closed" ${closedSelected}>Closed</option>
            </select>
            <label for="schedule-modal-status">Status</label>
          </div>
        </div>
      </form>
    `
  }

  const onActionClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const actionBtn = target?.closest<HTMLButtonElement>('[data-schedule-action]')
    if (!actionBtn) return

    const row = actionBtn.closest<HTMLTableRowElement>('[data-schedule-row]')
    if (!row) return

    const action = actionBtn.dataset.scheduleAction
    const schedule = readRow(row)

    if (action === 'view') {
      modal.setMode('form')
      modal.setOnConfirm(null)
      modal.open({
        title: 'View Schedule',
        confirmLabel: 'Close',
        bodyHtml: renderForm(schedule, true),
        hideConfirm: true,
      })
      return
    }

    if (action === 'edit') {
      modal.setMode('form')
      modal.setOnConfirm(() => modal.close())
      modal.open({
        title: 'Edit Schedule',
        confirmLabel: 'Save Changes',
        bodyHtml: renderForm(schedule),
      })
      return
    }

    if (action === 'close') {
      modal.setMode('confirm')
      modal.setOnConfirm(() => modal.close())
      modal.open({
        title: 'Close Schedule',
        confirmLabel: 'Close Schedule',
        bodyHtml: `<p class="mb-0">Set <strong>${escapeHtml(schedule.subjectCode)} - ${escapeHtml(schedule.section)}</strong> to Closed?</p>`,
      })
    }
  }

  searchInput?.addEventListener('input', applySearch)
  root.addEventListener('click', onActionClick)
  renderVisibleRows()

  return () => {
    modal.destroy()
    pagination?.destroy()
    searchInput?.removeEventListener('input', applySearch)
    root.removeEventListener('click', onActionClick)
  }
}
