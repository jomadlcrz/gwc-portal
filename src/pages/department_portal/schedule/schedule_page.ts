import { DEPARTMENT_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderSharedModal } from '../../../components/ui/modal'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService, statusToLabel } from '../../../features/scheduling/service'
import { DEFAULT_DEPARTMENT_CODE } from '../../../data/departments'

export function renderdepartment_schedule_page(): string {
  const schedules = schedulingService.listApprovedByDepartment(DEFAULT_DEPARTMENT_CODE)

  return renderPortalShell(
    DEPARTMENT_SHELL_CONFIG,
    'schedule',
    `
      <section class="department-content">
        ${renderBreadcrumbNav([
          { label: 'Schedule Review', active: true },
        ])}

        <article class="department-panel">
          <h3>Department Schedule Review</h3>
          <p>Validate approved schedules for delivery readiness and submit modifications when needed.</p>

          <div class="admin-table-wrap mt-3">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Schedule Code</th>
                  <th>Term</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${schedules
                  .map(
                    (schedule) => `
                      <tr data-department-row data-schedule-id="${schedule.id}">
                        <td>${schedule.id}</td>
                        <td>${schedule.term}</td>
                        <td>${statusToLabel(schedule.status)}</td>
                        <td><button class="btn btn-sm btn-outline-primary" data-department-action="request">Request Modification</button></td>
                      </tr>
                    `,
                  )
                  .join('') || '<tr><td colspan="4" class="text-center py-3">No approved schedules available.</td></tr>'}
              </tbody>
            </table>
          </div>
        </article>
      </section>
      ${renderSharedModal('department-schedule-request-modal')}
    `,
  )
}
