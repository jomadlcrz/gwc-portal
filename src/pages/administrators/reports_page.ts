import { ROUTES } from '../../app/routes'
import { ADMIN_SHELL_CONFIG } from '../../components/_layout'
import { renderBreadcrumbNav } from '../../components/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../components/section_placeholder'

export function renderreports_page(): string {
  return renderSectionPlaceholderPage(
    ADMIN_SHELL_CONFIG,
    { contentClass: 'admin-content', panelClass: 'admin-panel' },
    'reports',
    'Reports',
    'Review analytics and operational reports.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Home', href: ROUTES.ADMINISTRATORS },
        { label: 'Reports', active: true },
      ]),
    },
  )
}
