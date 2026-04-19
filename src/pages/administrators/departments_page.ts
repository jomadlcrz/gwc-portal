import { ROUTES } from '../../app/routes'
import { ADMIN_SHELL_CONFIG } from '../../components/_layout'
import { renderBreadcrumbNav } from '../../components/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../components/section_placeholder'

export function renderdepartments_page(): string {
  return renderSectionPlaceholderPage(
    ADMIN_SHELL_CONFIG,
    { contentClass: 'admin-content', panelClass: 'admin-panel' },
    'departments',
    'Departments',
    'Manage department structure and assigned administrators.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Home', href: ROUTES.ADMINISTRATORS },
        { label: 'Departments', active: true },
      ]),
    },
  )
}
