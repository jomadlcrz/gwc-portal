import { DEPARTMENT_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderdepartment_dashboard_page(): string {
  return renderSectionPlaceholderPage(
    DEPARTMENT_SHELL_CONFIG,
    { contentClass: 'department-content', panelClass: 'department-panel' },
    'dashboard',
    'Dashboard',
    'Overview and quick access for department operations.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Dashboard', active: true },
      ]),
    },
  )
}
