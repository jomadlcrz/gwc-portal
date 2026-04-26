import { ADMIN_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderadministrators_dashboard_page(): string {
  return renderSectionPlaceholderPage(
    ADMIN_SHELL_CONFIG,
    { contentClass: 'admin-content', panelClass: 'admin-panel' },
    'dashboard',
    'Dashboard',
    'Overview and quick access for administration tasks.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Dashboard', active: true },
      ]),
    },
  )
}
