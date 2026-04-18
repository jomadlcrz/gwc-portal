import { renderAdminActionsPopover, renderAdminShell } from '../../components/admin_layout'

export function renderadministrators_directory_page(): string {
  return renderAdminShell(
    'administrators',
    `
      <section class="admin-content">
        <article class="admin-directory-shell">
          <header class="admin-directory-head">
            <div>
              <h2>Administrators</h2>
              <p>View and manage school administrators</p>
            </div>
            <label class="admin-directory-search">
              <span class="admin-search-icon" aria-hidden="true"><i data-lucide="search"></i></span>
              <input type="search" placeholder="Search..." aria-label="Search administrators" />
            </label>
          </header>

          <section class="admin-stats-grid" aria-label="Administrator statistics">
            <article class="admin-stat-card">
              <p>Total Administrators</p>
              <strong>12</strong>
            </article>
            <article class="admin-stat-card">
              <p>Active Today</p>
              <strong>10</strong>
            </article>
            <article class="admin-stat-card">
              <p>Departments Managed</p>
              <strong>8</strong>
            </article>
            <article class="admin-stat-card">
              <p>Pending Requests</p>
              <strong class="is-danger">3</strong>
            </article>
          </section>

          <section class="admin-directory-card">
            <header class="admin-directory-card-head">
              <div>
                <h3>Administrator Directory</h3>
                <p>List of current administrators and offices</p>
              </div>
              <button type="button" class="admin-add-btn">+ Add Admin</button>
            </header>

            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Office</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Dr. Maria L. Santos</strong></td>
                    <td>College President</td>
                    <td>Administration Office</td>
                    <td>maria.santos@gwc.edu.ph</td>
                    <td><span class="admin-pill is-active">Active</span></td>
                    <td>${renderAdminActionsPopover()}</td>
                  </tr>
                  <tr>
                    <td><strong>Prof. John R. Dela Cruz</strong></td>
                    <td>Vice President for Academic Affairs</td>
                    <td>Academic Office</td>
                    <td>john.delacruz@gwc.edu.ph</td>
                    <td><span class="admin-pill is-active">Active</span></td>
                    <td>${renderAdminActionsPopover()}</td>
                  </tr>
                  <tr>
                    <td><strong>Ms. Angela P. Reyes</strong></td>
                    <td>Registrar</td>
                    <td>Registrar's Office</td>
                    <td>angela.reyes@gwc.edu.ph</td>
                    <td><span class="admin-pill is-active">Active</span></td>
                    <td>${renderAdminActionsPopover()}</td>
                  </tr>
                  <tr>
                    <td><strong>Mr. Carlo M. Garcia</strong></td>
                    <td>Dean of Student Affairs</td>
                    <td>Student Affairs Office</td>
                    <td>carlo.garcia@gwc.edu.ph</td>
                    <td><span class="admin-pill is-warning">On Leave</span></td>
                    <td>${renderAdminActionsPopover()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </article>
      </section>
    `,
  )
}
