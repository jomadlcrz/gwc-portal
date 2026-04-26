import { registrar_SHELL_CONFIG } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderSectionPlaceholderPage } from '../../../components/ui/section_placeholder'

export function renderregistrar_settings_page(): string {
  return renderSectionPlaceholderPage(
    registrar_SHELL_CONFIG,
    { contentClass: 'registrar-content', panelClass: 'registrar-panel' },
    'settings',
    'Settings',
    'Configure registrar office preferences and controls.',
    {
      breadcrumbHtml: renderBreadcrumbNav([
        { label: 'Settings', active: true },
      ]),
    },
  )
}






