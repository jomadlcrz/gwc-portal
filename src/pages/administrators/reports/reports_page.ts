import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'

export function renderreports_page(): string {
  const analytics = schedulingService.getAnalytics()
  const metrics = [
    { value: `${analytics.totalSchedules}`, label: 'Total schedules' },
    { value: `${analytics.pendingApprovals}`, label: 'Pending approvals' },
    { value: `${analytics.unresolvedConflicts}`, label: 'Unresolved conflicts' },
    { value: `${analytics.finalizedSchedules}`, label: 'Finalized schedules' },
    { value: `${analytics.avgApprovalHours.toFixed(2)}h`, label: 'Avg approval turnaround' },
    { value: `${analytics.completionRate.toFixed(1)}%`, label: 'Completion rate' },
    { value: `${analytics.conflictFrequency.toFixed(1)}%`, label: 'Conflict frequency' },
  ]

  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'reports',
    `
      <section class="admin-content">
        ${renderBreadcrumbNav([
          { label: 'Reports', active: true },
        ])}
        <article class="admin-panel">
          <h3>Scheduling Analytics</h3>
          <div class="admin-reports-grid mt-3">
            ${metrics
              .map(
                (metric) => `
                  <div class="admin-report-metric">
                    <strong>${metric.value}</strong>
                    <p>${metric.label}</p>
                  </div>
                `,
              )
              .join('')}
          </div>
        </article>
      </section>
    `,
  )
}
