import { ROUTES } from '../../../app/routes'
import { STUDENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderstudent_schedule_page(): string {
  return renderSectionPlaceholderPage(
    STUDENT_SHELL_CONFIG,
    { contentClass: 'student-content', panelClass: 'student-panel' },
    'schedule',
    'Schedule',
    'Track your weekly class schedule, room assignments, and time changes.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Home', href: ROUTES.STUDENT_DASHBOARD },
        { label: 'Schedule', active: true },
      ]),
    },
  )
}


