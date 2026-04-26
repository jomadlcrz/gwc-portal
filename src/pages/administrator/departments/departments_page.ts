import { ADMIN_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderdepartments_page(): string {
  return renderSectionPlaceholderPage(
    ADMIN_SHELL_CONFIG,
    { contentClass: 'admin-content', panelClass: 'admin-panel' },
    'departments',
    'Departments',
    'Manage department records and configurations.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Departments', active: true },
      ]),
    },
  )
}
