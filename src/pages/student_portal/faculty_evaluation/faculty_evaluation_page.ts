import { STUDENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderstudent_faculty_evaluation_page(): string {
  return renderSectionPlaceholderPage(
    STUDENT_SHELL_CONFIG,
    { contentClass: 'student-content', panelClass: 'student-panel' },
    'faculty_evaluation',
    'Faculty Evaluation',
    'Submit your evaluations for assigned faculty members for this term.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Faculty Evaluation', active: true },
      ]),
    },
  )
}
