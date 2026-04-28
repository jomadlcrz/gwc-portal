import { ROUTES } from '../../../app/routes'
import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSharedPagination, setupSharedPagination } from '../../../components/ui/pagination'
import { renderSharedPopover } from '../../../components/ui/popover'
import { renderSharedModal, setupSharedModal } from '../../../components/ui/modal'
import { renderActionView } from '../../../components/ui/action_view'
import { renderDepartmentDisplay } from '../../../components/ui/department_badge'
import { DEPARTMENT_SELECT_OPTIONS } from '../../../data/departments'
import { schedulingService } from '../../../features/scheduling/service'

type LifecycleStatus =
  | 'Draft'
  | 'Approved'
  | 'Published'
  | 'Active'
  | 'Completed'
  | 'Cancelled'
  | 'Archived'

type ScheduleAction = 'view' | 'approve' | 'publish' | 'activate' | 'complete' | 'cancel' | 'archive'

function mapToLifecycleStatus(rawStatus: string): LifecycleStatus {
  if (rawStatus === 'DRAFT') return 'Draft'
  if (rawStatus === 'SUBMITTED_FOR_APPROVAL' || rawStatus === 'UNDER_ADMIN_REVIEW' || rawStatus === 'APPROVED') return 'Approved'
  if (rawStatus === 'FINALIZED') return 'Published'
  if (rawStatus === 'COMPLETED') return 'Completed'
  if (rawStatus === 'REJECTED_BY_ADMIN') return 'Cancelled'
  if (rawStatus === 'MODIFICATION_REQUESTED') return 'Active'
  return 'Archived'
}

function countLifecycleStatus(status: LifecycleStatus): number {
  return schedulingService.listSchedules().filter((item) => mapToLifecycleStatus(item.status) === status).length
}

function resolveActionsByLifecycleStatus(status: LifecycleStatus): ScheduleAction[] {
  if (status === 'Draft') return ['view', 'approve', 'cancel']
  if (status === 'Approved') return ['view', 'publish', 'cancel']
  if (status === 'Published') return ['view', 'activate', 'cancel']
  if (status === 'Active') return ['view', 'complete']
  if (status === 'Completed' || status === 'Cancelled') return ['view', 'archive']
  return ['view']
}

function actionToLabel(action: ScheduleAction): string {
  if (action === 'approve') return 'Mark Approved'
  if (action === 'publish') return 'Publish'
  if (action === 'activate') return 'Mark Active'
  if (action === 'complete') return 'Mark Completed'
  if (action === 'cancel') return 'Cancel'
  if (action === 'archive') return 'Archive'
  return 'View'
}

function lifecycleStatusClass(status: LifecycleStatus): string {
  if (status === 'Draft') return 'is-draft'
  if (status === 'Approved') return 'is-approved'
  if (status === 'Published') return 'is-published'
  if (status === 'Active') return 'is-active'
  if (status === 'Completed') return 'is-completed'
  if (status === 'Cancelled') return 'is-cancelled'
  return 'is-archived'
}

function renderKpiCard(label: string, count: number, icon: string, tone: string): string {
  return `
    <article class="registrar-kpi-card registrar-kpi-card-${tone}">
      <span class="registrar-kpi-icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
      <div class="registrar-kpi-copy">
        <p>${label}</p>
        <strong>${count}</strong>
      </div>
    </article>
  `
}

function formatLastUpdated(value: string | null | undefined): string {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed)
}

function renderRows(): string {
  return schedulingService.listSchedules().map((schedule) => {
    const lifecycleStatus = mapToLifecycleStatus(schedule.status)
    const actions = resolveActionsByLifecycleStatus(lifecycleStatus)
    const current = schedule.versions.find((version) => version.versionNumber === schedule.currentVersion) ?? schedule.versions[0]
    const first = current.snapshot[0]
    const searchValue = [
      schedule.id,
      schedule.department,
      schedule.term,
      first?.subjectCode ?? '',
      first?.section ?? '',
      first?.faculty ?? '',
      schedule.status,
    ]
      .join(' ')
      .toLowerCase()

    return `
      <tr data-schedule-row data-schedule-id="${schedule.id}" data-department="${schedule.department}" data-search-value="${searchValue}">
        <td>${schedule.term}</td>
        <td>${renderDepartmentDisplay(schedule.department)}</td>
        <td>${current.snapshot.length}</td>
        <td><span class="admin-pill registrar-lifecycle-pill ${lifecycleStatusClass(lifecycleStatus)}">${lifecycleStatus}</span></td>
        <td>${formatLastUpdated(schedule.finalizedAt || schedule.approvedAt || schedule.submittedAt)}</td>
        <td>
          ${renderSharedPopover({
            ariaLabel: 'Schedule row actions',
            triggerLabel: '<i class="bi bi-three-dots-vertical" aria-hidden="true"></i>',
            actionDataAttribute: 'data-schedule-action',
            actions: actions.map((action) => ({ label: actionToLabel(action), value: action })),
          })}
        </td>
      </tr>
    `
  }).join('')
}

function getScheduleDisplayName(scheduleId: string): string {
  const schedule = schedulingService.listSchedules().find((item) => item.id === scheduleId)
  if (!schedule) return 'Schedule Detail'
  const current = schedule.versions.find((version) => version.versionNumber === schedule.currentVersion) ?? schedule.versions[0]
  const first = current.snapshot[0]
  if (!first) return 'Schedule Detail'
  return `${first.subjectCode} ${first.section}`
}

export function renderregistrar_schedule_manage_page(): string {
  const total = schedulingService.listSchedules().length
  const draftCount = countLifecycleStatus('Draft')
  const approvedCount = countLifecycleStatus('Approved')
  const publishedCount = countLifecycleStatus('Published')
  const activeCount = countLifecycleStatus('Active')
  const completedCount = countLifecycleStatus('Completed')
  const cancelledCount = countLifecycleStatus('Cancelled')
  const archivedCount = countLifecycleStatus('Archived')

  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'schedule',
    `
      <section class="registrar-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Schedule', href: ROUTES.REGISTRAR_SCHEDULE },
          { label: 'Manage Schedule', active: true },
        ])}

        <article class="registrar-panel registrar-schedule-manage-panel">
          <header class="registrar-dashboard-head">
            <div>
              <h3>Schedule Management</h3>
              <p>Track draft, review, approved, and finalized schedules with department-level filtering.</p>
            </div>
            <div class="registrar-dashboard-actions">
              <a href="${ROUTES.REGISTRAR_SCHEDULE_CREATE}" class="btn btn-sm btn-primary">Create Schedule</a>
            </div>
          </header>

          <section class="registrar-kpi-grid mt-2">
            ${renderKpiCard('Total', total, 'bi-collection', 'total')}
            ${renderKpiCard('Draft', draftCount, 'bi-pencil-square', 'draft')}
            ${renderKpiCard('Approved', approvedCount, 'bi-patch-check', 'approved')}
            ${renderKpiCard('Published', publishedCount, 'bi-megaphone', 'published')}
            ${renderKpiCard('Active', activeCount, 'bi-play-circle', 'active')}
            ${renderKpiCard('Completed', completedCount, 'bi-check2-circle', 'completed')}
            ${renderKpiCard('Cancelled', cancelledCount, 'bi-x-circle', 'cancelled')}
            ${renderKpiCard('Archived', archivedCount, 'bi-archive', 'archived')}
          </section>

          <section class="admin-student-toolbar mt-3">
            <select class="form-select form-select-sm w-auto" data-schedule-department-filter>
              <option value="">All Departments</option>
              ${DEPARTMENT_SELECT_OPTIONS.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
            <label class="admin-directory-search admin-student-search">
              <span class="admin-search-icon" aria-hidden="true"><i class="bi bi-search"></i></span>
              <input type="search" placeholder="Search schedules" aria-label="Search schedules" data-schedule-search />
            </label>
          </section>

          <div class="admin-table-wrap mt-2">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Term</th>
                  <th>Department</th>
                  <th>Classes</th>
                  <th>Status</th>
                  <th>Last Update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows()}
                <tr class="d-none" data-schedule-empty-row>
                  <td colspan="6" class="text-center py-3">No schedules found.</td>
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
  const departmentFilter = root.querySelector<HTMLSelectElement>('[data-schedule-department-filter]')
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

  const applyFilters = (): void => {
    const query = (searchInput?.value ?? '').trim().toLowerCase()
    const selectedDepartment = departmentFilter?.value ?? ''
    filteredRows = allRows.filter((row) => {
      const matchesSearch = (row.dataset.searchValue ?? '').includes(query)
      const matchesDepartment = !selectedDepartment || row.dataset.department === selectedDepartment
      return matchesSearch && matchesDepartment
    })
    currentPage = 1
    renderVisibleRows()
  }

  const renderScheduleDetail = (scheduleId: string): string => {
    const schedule = schedulingService.listSchedules().find((item) => item.id === scheduleId)
    if (!schedule) return '<p class="mb-0">Schedule not found.</p>'

    const lifecycleStatus = mapToLifecycleStatus(schedule.status)
    const current = schedule.versions.find((version) => version.versionNumber === schedule.currentVersion) ?? schedule.versions[0]
    return renderActionView([
          {
            title: 'Schedule Information',
            fields: [
          { label: 'Status', value: lifecycleStatus, pillClass: `registrar-lifecycle-pill ${lifecycleStatusClass(lifecycleStatus)}` },
          { label: 'Total Classes', value: String(current.snapshot.length) },
          { label: 'Department', value: schedule.department, valueHtml: renderDepartmentDisplay(schedule.department) },
          { label: 'Registrar Notes', value: schedule.registrarNotes || '-' },
          { label: 'Admin Feedback', value: schedule.adminFeedback || '-' },
        ],
      },
      {
        title: 'Current Schedule Items',
        fields: current.snapshot.slice(0, 8).map((item) => ({
          label: `${item.subjectCode} ${item.section}`,
          value: `${item.day} ${item.startTime}-${item.endTime} (${item.room})`,
        })),
      },
    ])
  }

  const onActionClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const actionBtn = target?.closest<HTMLButtonElement>('[data-schedule-action]')
    if (!actionBtn) return

    const row = actionBtn.closest<HTMLTableRowElement>('[data-schedule-row]')
    if (!row) return

    const scheduleId = row.dataset.scheduleId
    if (!scheduleId) return

    const action = actionBtn.dataset.scheduleAction
    if (action === 'view') {
      modal.setMode('form')
      modal.setOnConfirm(null)
      modal.open({ title: getScheduleDisplayName(scheduleId), bodyHtml: renderScheduleDetail(scheduleId), hideConfirm: true })
      return
    }

    if (action === 'approve') {
      const sent = schedulingService.submitForApproval(scheduleId, 'registrar-1', 'Sent from manage page')
      if (sent) {
        schedulingService.approveSchedule({
          scheduleId,
          reviewerId: 'admin-1',
          comment: 'Approved from lifecycle flow',
          tags: ['lifecycle'],
        })
      }
      modal.setMode('confirm')
      modal.setOnConfirm(() => window.location.reload())
      modal.open({
        title: sent ? 'Marked as Approved' : 'Cannot Approve',
        confirmLabel: 'Refresh',
        bodyHtml: `<p class="mb-0">${sent ? 'Schedule advanced to Approved lifecycle status.' : 'Only eligible schedules can move to Approved.'}</p>`,
      })
      return
    }

    if (action === 'publish') {
      const done = schedulingService.finalizeSchedule(scheduleId, 'admin-1')
      modal.setMode('confirm')
      modal.setOnConfirm(() => window.location.reload())
      modal.open({
        title: done ? 'Published' : 'Cannot Publish',
        confirmLabel: 'Refresh',
        bodyHtml: `<p class="mb-0">${done ? 'Schedule advanced to Published lifecycle status.' : 'Only Approved schedules can be published.'}</p>`,
      })
      return
    }

    if (action === 'activate' || action === 'complete' || action === 'cancel' || action === 'archive') {
      modal.setMode('confirm')
      modal.setOnConfirm(() => null)
      modal.open({
        title: 'Lifecycle Step',
        hideConfirm: true,
        bodyHtml: '<p class="mb-0">This lifecycle action is shown by workflow design and will be wired to backend status transitions next.</p>',
      })
    }
  }

  searchInput?.addEventListener('input', applyFilters)
  departmentFilter?.addEventListener('change', applyFilters)
  root.addEventListener('click', onActionClick)
  renderVisibleRows()

  return () => {
    modal.destroy()
    pagination?.destroy()
    searchInput?.removeEventListener('input', applyFilters)
    departmentFilter?.removeEventListener('change', applyFilters)
    root.removeEventListener('click', onActionClick)
  }
}
