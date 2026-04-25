import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderSharedModal } from '../../../components/ui/modal'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'
import { DEFAULT_DEPARTMENT_CODE, getDepartmentDisplayName } from '../../../data/departments'

export function renderdepartments_page(): string {
  const approved = schedulingService.listApprovedByDepartment(DEFAULT_DEPARTMENT_CODE)

  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'departments',
    `
      <section class="admin-content">
        ${renderBreadcrumbNav([
          { label: 'Departments', active: true },
        ])}
        <article class="admin-panel">
          <h3>Department Schedule Review</h3>
          <p>Approved schedules for ${getDepartmentDisplayName(DEFAULT_DEPARTMENT_CODE)}: <strong>${approved.length}</strong></p>

          <div class="admin-table-wrap mt-3">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Schedule ID</th>
                  <th>Term</th>
                  <th>Status</th>
                  <th>Request Modification</th>
                </tr>
              </thead>
              <tbody>
                ${approved
                  .map(
                    (schedule) => `
                      <tr data-dept-schedule-row data-schedule-id="${schedule.id}">
                        <td>${schedule.id}</td>
                        <td>${schedule.term}</td>
                        <td>${schedule.status}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary" data-dept-action="request">Request Change</button>
                        </td>
                      </tr>
                    `,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <h4 class="mt-4">Modification Requests</h4>
          <ul data-dept-request-list>
            ${schedulingService
              .listModificationRequests({ requesterRole: 'DEPARTMENT' })
              .map((request) => `<li>${request.scheduleId}: ${request.status} - ${request.reason}</li>`)
              .join('')}
          </ul>
        </article>
      </section>
      ${renderSharedModal('department-request-modal')}
    `,
  )
}
