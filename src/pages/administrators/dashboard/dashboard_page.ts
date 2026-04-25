import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderSharedModal } from '../../../components/ui/modal'
import { renderSharedPopover } from '../../../components/ui/popover'
import { renderDepartmentDisplay } from '../../../components/ui/department_badge'
import { schedulingService, statusToLabel } from '../../../features/scheduling/service'

export function renderadministrators_dashboard_page(): string {
  const pending = schedulingService.listPendingApprovals()
  const conflicts = schedulingService.listConflicts().filter((item) => !item.resolved).slice(0, 8)

  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'dashboard',
    `
      <section class="admin-content">
        <article class="admin-panel">
          <h3>Schedule Approval Desk</h3>
          <p>Schedules waiting for decision: <strong>${pending.length}</strong> | Active conflicts: <strong>${conflicts.length}</strong></p>
          <div class="admin-dashboard-table-scroll mt-3">
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Schedule ID</th>
                    <th>Department</th>
                    <th>Term</th>
                    <th>Status</th>
                    <th>Registrar Notes</th>
                    <th>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  ${pending
                    .map(
                      (schedule) => `
                        <tr data-admin-schedule-row data-schedule-id="${schedule.id}">
                          <td>${schedule.id}</td>
                          <td>${renderDepartmentDisplay(schedule.department)}</td>
                          <td>${schedule.term}</td>
                          <td>${statusToLabel(schedule.status)}</td>
                          <td>${schedule.registrarNotes || '-'}</td>
                          <td>
                            ${renderSharedPopover({
                              ariaLabel: 'Approval actions',
                              triggerLabel: '<i class="bi bi-three-dots-vertical" aria-hidden="true"></i>',
                              actionDataAttribute: 'data-admin-action',
                              actions: [
                                { label: 'Approve', value: 'approve' },
                                { label: 'Reject', value: 'reject', danger: true },
                                { label: 'Feedback', value: 'feedback' },
                              ],
                            })}
                          </td>
                        </tr>
                      `,
                    )
                    .join('')}
                </tbody>
              </table>
            </div>

            <div class="admin-table-wrap mt-3">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Conflict</th>
                    <th>Severity</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    conflicts.length
                      ? conflicts.map((item) => `<tr><td>${item.type}</td><td>${item.severity}</td><td>${item.details}</td></tr>`).join('')
                      : '<tr><td colspan="3" class="text-center py-3">No active conflicts.</td></tr>'
                  }
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>
      ${renderSharedModal('admin-decision-modal')}
    `,
  )
}
