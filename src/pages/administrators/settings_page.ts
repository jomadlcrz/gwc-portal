import { ROUTES } from '../../app/routes'
import { ADMIN_SHELL_CONFIG } from '../../components/_layout'
import { renderBreadcrumbNav } from '../../components/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../components/section_placeholder'

export function rendersettings_page(): string {
  return renderSectionPlaceholderPage(
    ADMIN_SHELL_CONFIG,
    { contentClass: 'admin-content', panelClass: 'admin-panel' },
    'settings',
    'Settings',
    'Configure system preferences and controls.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Home', href: ROUTES.ADMINISTRATORS },
        { label: 'Settings', active: true },
      ]),
    },
  )
}
