import { ROUTES } from '../../../app/routes'
import { STUDENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderstudent_grades_page(): string {
  return renderSectionPlaceholderPage(
    STUDENT_SHELL_CONFIG,
    { contentClass: 'student-content', panelClass: 'student-panel' },
    'grades',
    'Grades',
    'Check term grades, subject performance, and posted evaluation results.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Home', href: ROUTES.STUDENT_DASHBOARD },
        { label: 'Grades', active: true },
      ]),
    },
  )
}


