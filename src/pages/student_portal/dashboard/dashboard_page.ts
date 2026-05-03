import { STUDENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderstudent_dashboard_page(): string {
  return renderSectionPlaceholderPage(
    STUDENT_SHELL_CONFIG,
    { contentClass: 'student-content', panelClass: 'student-panel' },
    'dashboard',
    'Dashboard',
    'Overview of your academic activity, schedules, and updates.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Dashboard', active: true },
      ]),
    },
  )
}