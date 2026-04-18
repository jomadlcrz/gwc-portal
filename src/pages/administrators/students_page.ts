import { ROUTES } from '../../app/routes'
import { renderAdminShell } from '../../components/admin_layout'

export function renderstudents_page(): string {
  return renderAdminShell(
    'students',
    `
      <section class="admin-content">
        <article class="admin-students-home">
          <h2>Students</h2>
          <p>Create, upload, and manage student records.</p>
          <div class="admin-students-home-actions">
            <a href="${ROUTES.ADMINISTRATORS_STUDENTS_MANAGE}" class="btn btn-outline-primary">Manage Students</a>
            <a href="${ROUTES.ADMINISTRATORS_STUDENTS_CREATE}" class="btn btn-primary">Create Student</a>
            <a href="${ROUTES.ADMINISTRATORS_STUDENTS_BULK}" class="btn btn-outline-primary">Bulk Upload</a>
          </div>
        </article>
      </section>
    `,
  )
}
