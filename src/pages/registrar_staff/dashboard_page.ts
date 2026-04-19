import { renderregistrar_staff_shell } from '../../components/registrar_staff_layout'

export function renderregistrar_staff_dashboard_page(): string {
  return renderregistrar_staff_shell(
    'dashboard',
    `
      <section class="registrar_staff-content">
        <article class="registrar_staff-panel">
          <h3>Registrar Staff Dashboard</h3>
          <p>Monitor daily office transactions, pending requests, and record processing status.</p>
        </article>
      </section>
    `,
  )
}



