import { ROUTES } from '../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../components/_layout'
import { renderAdminBreadcrumbNav } from '../../components/nav_breadcrumb'
import { renderStudentAccountForm } from '../../components/student_account_form'

function renderBulkCard(index: number): string {
  return `
    <article class="admin-bulk-card">
      <header>
        <h4>Student ${index}</h4>
        <button type="button" class="btn btn-outline-secondary btn-sm">Remove</button>
      </header>
      <p>Fill out the student details below.</p>
      ${renderStudentAccountForm(`bulk-${index}`)}
    </article>
  `
}

export function renderstudents_bulk_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'students',
    `
      <section class="admin-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Home', href: ROUTES.ADMINISTRATORS },
          { label: 'Students', href: ROUTES.ADMINISTRATORS_STUDENTS },
          { label: 'Manage Students', href: ROUTES.ADMINISTRATORS_STUDENTS_MANAGE },
          { label: 'Bulk Upload', active: true },
        ])}

        <article class="admin-student-page-shell">
          <header class="admin-student-head">
            <h2>Bulk Student Upload</h2>
            <p>Import multiple students using a CSV file.</p>
          </header>

          <section class="admin-student-toolbar admin-student-toolbar-start">
            <button type="button" class="btn btn-outline-primary btn-sm">Upload CSV</button>
            <button type="button" class="btn btn-outline-primary btn-sm">Paste Data</button>
            <button type="button" class="btn btn-outline-primary btn-sm">+ Add Student Card</button>
          </section>

          ${renderBulkCard(1)}

          <footer class="admin-student-form-footer">
            <a href="${ROUTES.ADMINISTRATORS_STUDENTS_MANAGE}" class="btn btn-light btn-sm">Cancel</a>
            <button type="button" class="btn btn-primary btn-sm">Create Accounts</button>
          </footer>
        </article>
      </section>
    `,
  )
}
