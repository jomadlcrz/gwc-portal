import { FACULTY_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'

export function renderfaculty_dashboard_page(): string {
  return renderPortalShell(
    FACULTY_SHELL_CONFIG,
    'dashboard',
    `
      <section class="faculty-content">
        <article class="faculty-panel">
          <h3>Faculty Dashboard</h3>
          <p>Track classes, post updates, and monitor submissions from one workspace.</p>
        </article>
      </section>
    `,
  )
}
