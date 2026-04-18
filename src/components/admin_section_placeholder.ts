import { renderAdminShell } from './admin_layout'
import type { AdminSection } from './admin_layout'

export function renderAdminPlaceholderPage(section: AdminSection, title: string, description: string): string {
  return renderAdminShell(
    section,
    `
      <section class="admin-content">
        <article class="admin-panel">
          <h3>${title}</h3>
          <p>${description}</p>
        </article>
      </section>
    `,
  )
}
