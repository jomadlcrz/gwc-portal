import { STUDENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderstudent_submitted_documents_page(): string {
  return renderSectionPlaceholderPage(
    STUDENT_SHELL_CONFIG,
    { contentClass: 'student-content', panelClass: 'student-panel' },
    'submitted_documents',
    'Submitted Documents',
    'View the list of documents you already submitted and their verification status.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Submitted Documents', active: true },
      ]),
    },
  )
}
