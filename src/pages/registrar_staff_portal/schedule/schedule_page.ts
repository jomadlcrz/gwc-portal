import { ROUTES } from '../../../app/routes'
import { REGISTRAR_STAFF_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'

export function renderregistrar_staff_schedule_page(): string {
  const analytics = schedulingService.getAnalytics()
  const notifications = schedulingService.listNotifications('REGISTRAR').slice(0, 5)
  const pendingAdmin = schedulingService.listPendingApprovals().slice(0, 5)
  const conflictQueue = schedulingService.listSchedulesByStatus(['CONFLICT_DETECTED']).slice(0, 5)
  const returnedQueue = schedulingService.listSchedulesByStatus(['REJECTED_BY_ADMIN']).slice(0, 5)
  const modRequests = schedulingService.listModificationRequests().slice(0, 5)
  const published = schedulingService.listSchedulesByStatus(['APPROVED', 'FINALIZED']).slice(0, 5)

  return renderPortalShell(
    REGISTRAR_STAFF_SHELL_CONFIG,
    'schedule',
    `
      <section class="registrar_staff-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Schedule', active: true },
        ])}

        <article class="registrar-panel registrar-dashboard">
          <header class="registrar-dashboard-head">
            <div>
              <h3>Schedule Operations</h3>
              <p>Monitor conflict detection, approval queue, published schedules, and incoming modification requests.</p>
            </div>
            <div class="registrar-dashboard-actions">
              <a href="${ROUTES.REGISTRAR_STAFF_SCHEDULE_MANAGE}" class="btn btn-sm btn-outline-primary">Manage Schedule</a>
              <a href="${ROUTES.REGISTRAR_STAFF_SCHEDULE_CREATE}" class="btn btn-sm btn-primary">Create Schedule</a>
            </div>
          </header>

          <section class="registrar-kpi-grid mt-3">
            <article class="registrar-kpi-card"><p>Total Schedules</p><strong>${analytics.totalSchedules}</strong></article>
            <article class="registrar-kpi-card"><p>In Admin Queue</p><strong>${analytics.pendingApprovals}</strong></article>
            <article class="registrar-kpi-card"><p>Unresolved Conflicts</p><strong>${analytics.unresolvedConflicts}</strong></article>
            <article class="registrar-kpi-card"><p>Published</p><strong>${analytics.approvedSchedules}</strong></article>
            <article class="registrar-kpi-card"><p>Finalized</p><strong>${analytics.finalizedSchedules}</strong></article>
            <article class="registrar-kpi-card"><p>Avg Approval Time</p><strong>${analytics.avgApprovalHours.toFixed(2)}h</strong></article>
          </section>

          <section class="registrar-dashboard-grid mt-3">
            <article class="registrar-dashboard-card">
              <h4>Conflict Queue</h4>
              <ul class="registrar-list">
                ${
                  conflictQueue.length
                    ? conflictQueue.map((item) => `<li><strong>${item.id}</strong> - ${item.department} - ${item.status}</li>`).join('')
                    : '<li>No conflict schedules.</li>'
                }
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Admin Review Queue</h4>
              <ul class="registrar-list">
                ${
                  pendingAdmin.length
                    ? pendingAdmin.map((item) => `<li><strong>${item.id}</strong> - ${item.department} - ${item.status}</li>`).join('')
                    : '<li>No schedules sent to admin.</li>'
                }
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Returned by Admin</h4>
              <ul class="registrar-list">
                ${
                  returnedQueue.length
                    ? returnedQueue.map((item) => `<li><strong>${item.id}</strong> - ${item.adminFeedback || 'Needs revision'}</li>`).join('')
                    : '<li>No returned schedules.</li>'
                }
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Modification Requests</h4>
              <ul class="registrar-list">
                ${
                  modRequests.length
                    ? modRequests.map((item) => `<li><strong>${item.scheduleId}</strong> - ${item.requesterRole} - ${item.status}</li>`).join('')
                    : '<li>No modification requests.</li>'
                }
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Published / Finalized</h4>
              <ul class="registrar-list">
                ${
                  published.length
                    ? published.map((item) => `<li><strong>${item.id}</strong> - v${item.currentVersion} - ${item.status}</li>`).join('')
                    : '<li>No published schedules yet.</li>'
                }
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Registrar Notifications</h4>
              <ul class="registrar-list">
                ${notifications.length ? notifications.map((note) => `<li>${note.message}</li>`).join('') : '<li>No notifications yet.</li>'}
              </ul>
            </article>

            <article class="registrar-dashboard-card">
              <h4>Quick Actions</h4>
              <div class="registrar-quick-links">
                <a href="${ROUTES.REGISTRAR_STAFF_SCHEDULE_CREATE}" class="btn btn-sm btn-outline-primary">New Schedule Draft</a>
                <a href="${ROUTES.REGISTRAR_STAFF_SCHEDULE_MANAGE}" class="btn btn-sm btn-outline-primary">Process Requests</a>
                <a href="${ROUTES.REGISTRAR_STAFF_REQUESTS}" class="btn btn-sm btn-outline-primary">Open Requests</a>
              </div>
            </article>
          </section>
        </article>
      </section>
    `,
  )
}
