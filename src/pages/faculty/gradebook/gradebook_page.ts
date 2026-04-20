import { ROUTES } from '../../../app/routes'
import { FACULTY_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderfaculty_gradebook_page(): string {
  return renderSectionPlaceholderPage(
    FACULTY_SHELL_CONFIG,
    { contentClass: 'faculty-content', panelClass: 'faculty-panel' },
    'gradebook',
    'Gradebook',
    'Review submissions, encode grades, and publish term results.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Home', href: ROUTES.FACULTY_DASHBOARD },
        { label: 'Gradebook', active: true },
      ]),
    },
  )
}


