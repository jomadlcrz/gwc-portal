import { STUDENT_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'

export function renderstudent_dashboard_page(): string {
  return renderPortalShell(
    STUDENT_SHELL_CONFIG,
    'dashboard',
    `
      <section class="student-content">
        <article class="student-panel">
          <h3>Student Dashboard</h3>
          <p>View your subjects, class schedule, and latest academic updates in one place.</p>
        </article>
      </section>
    `,
  )
}


