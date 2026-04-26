import { ADMIN_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderregistrar_admin_page(): string {
  return renderSectionPlaceholderPage(
    ADMIN_SHELL_CONFIG,
    { contentClass: 'admin-content', panelClass: 'admin-panel' },
    'registrar',
    'Registrar',
    'Manage registrar accounts, roles, and access.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Registrar', active: true },
      ]),
    },
  )
}



