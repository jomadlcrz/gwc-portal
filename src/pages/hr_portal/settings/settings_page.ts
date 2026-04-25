import { HR_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderhr_settings_page(): string {
  return renderSectionPlaceholderPage(
    HR_SHELL_CONFIG,
    { contentClass: 'hr-content', panelClass: 'hr-panel' },
    'settings',
    'Settings',
    'Configure HR account preferences and portal access options.',
    {
      breadcrumbHtml: renderBreadcrumbNav([{ label: 'Settings', active: true }]),
    },
  )
}
