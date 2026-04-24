import { STUDENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderstudent_subjects_page(): string {
  return renderSectionPlaceholderPage(
    STUDENT_SHELL_CONFIG,
    { contentClass: 'student-content', panelClass: 'student-panel' },
    'subjects',
    'Subjects',
    'Review your current enrolled subjects and assigned instructors.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Subjects', active: true },
      ]),
    },
  )
}


