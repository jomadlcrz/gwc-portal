import { DEPARTMENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderdepartment_schedule_page(): string {
  return renderSectionPlaceholderPage(
    DEPARTMENT_SHELL_CONFIG,
    { contentClass: 'department-content', panelClass: 'department-panel' },
    'schedule',
    'Schedule Review',
    'Review schedules and coordinate updates.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Schedule Review', active: true },
      ]),
    },
  )
}
