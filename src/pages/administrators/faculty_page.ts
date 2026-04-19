import { ROUTES } from '../../app/routes'
import { ADMIN_SHELL_CONFIG } from '../../components/_layout'
import { renderBreadcrumbNav } from '../../components/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../components/section_placeholder'

export function renderfaculty_page(): string {
  return renderSectionPlaceholderPage(
    ADMIN_SHELL_CONFIG,
    { contentClass: 'admin-content', panelClass: 'admin-panel' },
    'faculty',
    'Faculty',
    'Manage faculty records and assignments.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Home', href: ROUTES.ADMINISTRATORS },
        { label: 'Faculty', active: true },
      ]),
    },
  )
}
