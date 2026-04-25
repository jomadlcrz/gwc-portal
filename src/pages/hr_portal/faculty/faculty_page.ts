import { HR_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'

export function renderhr_faculty_page(): string {
  const schedules = schedulingService.listSchedules()
  const allItems = schedules.flatMap((schedule) => {
    const current = schedule.versions.find((version) => version.versionNumber === schedule.currentVersion) ?? schedule.versions[0]
    return current.snapshot
  })

  const facultyLoad = allItems.reduce<Record<string, { load: number; departments: Set<string> }>>((acc, item) => {
    if (!acc[item.faculty]) {
      acc[item.faculty] = { load: 0, departments: new Set<string>() }
    }
    acc[item.faculty].load += 1
    acc[item.faculty].departments.add(item.department)
    return acc
  }, {})

  const rows = Object.entries(facultyLoad).sort((a, b) => b[1].load - a[1].load)

  return renderPortalShell(
    HR_SHELL_CONFIG,
    'faculty',
    `
      <section class="hr-content">
        ${renderBreadcrumbNav([{ label: 'Faculty', active: true }])}

        <article class="hr-panel">
          <h3>Faculty Directory and Load</h3>
          <p>Review faculty presence in active scheduling data.</p>

          <div class="admin-table-wrap mt-3">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Total Assigned Classes</th>
                  <th>Department Scope</th>
                </tr>
              </thead>
              <tbody>
                ${
                  rows.length
                    ? rows
                        .map(
                          ([name, stats]) => `
                            <tr>
                              <td>${name}</td>
                              <td>${stats.load}</td>
                              <td>${Array.from(stats.departments).join(', ')}</td>
                            </tr>
                          `,
                        )
                        .join('')
                    : '<tr><td colspan="3" class="text-center py-3">No faculty records found.</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </article>
      </section>
    `,
  )
}
