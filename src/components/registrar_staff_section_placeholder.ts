import { renderregistrar_staff_shell } from './registrar_staff_layout'
import type { RegistrarStaffSection } from './registrar_staff_layout'

export function renderregistrar_staff_placeholder_page(
  section: RegistrarStaffSection,
  title: string,
  description: string,
): string {
  return renderregistrar_staff_shell(
    section,
    `
      <section class="registrar_staff-content">
        <article class="registrar_staff-panel">
          <h3>${title}</h3>
          <p>${description}</p>
        </article>
      </section>
    `,
  )
}

