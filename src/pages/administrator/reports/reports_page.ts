import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'

function renderKpiCard(value: string, label: string, icon: string, tone: string): string {
  return `
    <article class="admin-report-metric admin-report-metric-${tone}">
      <span class="admin-report-metric-icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
      <div class="admin-report-metric-copy">
        <strong>${value}</strong>
        <p>${label}</p>
      </div>
    </article>
  `
}

export function renderreports_page(): string {
  const analytics = schedulingService.getAnalytics()
  const metrics = [
    { value: `${analytics.totalSchedules}`, label: 'Total schedules', icon: 'bi-collection', tone: 'total' },
    { value: `${analytics.pendingApprovals}`, label: 'Pending approvals', icon: 'bi-hourglass-split', tone: 'pending' },
    { value: `${analytics.unresolvedConflicts}`, label: 'Unresolved conflicts', icon: 'bi-exclamation-triangle', tone: 'conflict' },
    { value: `${analytics.finalizedSchedules}`, label: 'Finalized schedules', icon: 'bi-check2-circle', tone: 'finalized' },
    { value: `${analytics.avgApprovalHours.toFixed(2)}h`, label: 'Avg approval turnaround', icon: 'bi-stopwatch', tone: 'turnaround' },
    { value: `${analytics.completionRate.toFixed(1)}%`, label: 'Completion rate', icon: 'bi-graph-up-arrow', tone: 'completion' },
    { value: `${analytics.conflictFrequency.toFixed(1)}%`, label: 'Conflict frequency', icon: 'bi-activity', tone: 'frequency' },
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
                  ${renderKpiCard(metric.value, metric.label, metric.icon, metric.tone)}
                `,
              )
              .join('')}
          </div>
        </article>
      </section>
    `,
  )
}
