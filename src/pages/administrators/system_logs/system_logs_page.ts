import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { formatDateTime, schedulingService } from '../../../features/scheduling/service'

export function rendersystem_logs_page(): string {
  const logs = schedulingService.listActivityLogs().slice(0, 40)

  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'system_logs',
    `
      <section class="admin-content">
        ${renderBreadcrumbNav([
          { label: 'System Logs', active: true },
        ])}
        <article class="admin-panel">
          <h3>Activity Logs</h3>
          <p>Full trace of changes, approvals, and modification requests.</p>
          <div class="admin-table-wrap mt-3">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Actor</th>
                  <th>Entity</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                ${logs
                  .map(
                    (log) => `
                      <tr>
                        <td>${formatDateTime(log.createdAt)}</td>
                        <td>${log.actorRole}:${log.actorId}</td>
                        <td>${log.entityType} (${log.entityId})</td>
                        <td>${log.action}</td>
                        <td>${log.metadata}</td>
                      </tr>
                    `,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    `,
  )
}
