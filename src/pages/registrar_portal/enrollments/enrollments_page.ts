import { renderEnrollmentSessionsPage, setupEnrollmentSessionsPage } from './enrollment_sessions_page'

export function renderregistrar_enrollments_page(): string {
  return renderEnrollmentSessionsPage()
}

export function setupRegistrarEnrollmentsPage(root: HTMLElement): () => void {
  return setupEnrollmentSessionsPage(root)
}





