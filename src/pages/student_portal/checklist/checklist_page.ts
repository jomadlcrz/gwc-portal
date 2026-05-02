import { STUDENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderstudent_checklist_page(): string {
  return renderSectionPlaceholderPage(
    STUDENT_SHELL_CONFIG,
    { contentClass: 'student-content', panelClass: 'student-panel' },
    'checklist',
    'Checklist',
    'Track and complete your required academic and portal checklist items.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Checklist', active: true },
      ]),
    },
  )
}
