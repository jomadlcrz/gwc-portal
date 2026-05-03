import '../../../styles/enrollment_sessions.css'
import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { renderEnrollmentSessionForm, setupEnrollmentSessionForm } from '../../../components/forms/enrollment_session_form'
import { renderEnrollmentSessionStatus, updateEnrollmentSessionStatus } from '../../../components/ui/enrollment_session_status'
import { getCurrentEnrollmentSession } from '../../../api/v1/enrollment_sessions/enrollments'

export function renderEnrollmentSessionsPage(): string {
  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'enrollment_sessions',
    `
      <section class="registrar-content">
        <article class="registrar-panel">
          <div class="panel-breadcrumb">
            ${renderBreadcrumbNav([
              { label: 'Enrollment Sessions', active: true },
            ])}
          </div>

          <div class="panel-content">
            <div class="page-header mb-4">
              <h1 class="page-title">Enrollment Sessions</h1>
              <p class="page-subtitle">Manage and create enrollment sessions for different academic years and semesters.</p>
            </div>

            <div class="enrollment-sessions-grid">
              <div class="enrollment-sessions-status-section">
                ${renderEnrollmentSessionStatus()}
              </div>

              <div class="enrollment-sessions-form-section">
                ${renderEnrollmentSessionForm()}
              </div>
            </div>
          </div>
        </article>
      </section>
    `,
  )
}

export function setupEnrollmentSessionsPage(root: HTMLElement): () => void {
  const statusContainer = root.querySelector<HTMLElement>('.enrollment-session-status-container')
  if (statusContainer) {
    void getCurrentEnrollmentSession()
      .then((data) => {
        if (data) {
          updateEnrollmentSessionStatus(statusContainer, data)
        }
      })
      .catch(() => {})
  }

  // Setup form
  const formCleanup = setupEnrollmentSessionForm(root, (data) => {
    // Update status display after successful submission
    const statusContainer = root.querySelector<HTMLElement>('.enrollment-session-status-container')
    if (statusContainer && data) {
      updateEnrollmentSessionStatus(statusContainer, data)
    }
  })

  return () => {
    formCleanup()
  }
}
