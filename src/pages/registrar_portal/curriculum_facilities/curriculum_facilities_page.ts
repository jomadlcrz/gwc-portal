import { ROUTES } from '../../../app/routes'
import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'

export function renderregistrar_curriculum_facilities_page(): string {
  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'curriculum_facilities',
    `
      <section class="registrar-content cf-page cf-overview-page">
        ${renderBreadcrumbNav([
          { label: 'Curriculum & Facilities', active: true },
        ])}

        <article class="registrar-panel cf-head-card">
          <header class="cf-head">
            <h2>Curriculum & Facilities</h2>
            <p>Manage programs, departments, buildings, rooms, sets and subjects.</p>
          </header>
        </article>

        <section class="cf-stat-grid" aria-label="Curriculum overview">
          ${renderStatCard('bi-book', '24', 'Programs', 'violet')}
          ${renderStatCard('bi-people', '18', 'Departments', 'green')}
          ${renderStatCard('bi-building', '12', 'Buildings', 'amber')}
          ${renderStatCard('bi-door-open', '84', 'Rooms', 'blue')}
          ${renderStatCard('bi-diagram-3', '45', 'Sets', 'pink')}
          ${renderStatCard('bi-journal-text', '156', 'Subjects', 'teal')}
        </section>

        <section class="cf-table-grid">
          ${renderTableCard('Programs', ['Program Code', 'Program Name', 'Status'], [
            ['BSIT', 'Bachelor of Science in Information Technology', '<span class="cf-chip">Active</span>'],
            ['BSED', 'Bachelor of Secondary Education', '<span class="cf-chip">Active</span>'],
            ['BSBA', 'Bachelor of Science in Business Administration', '<span class="cf-chip">Active</span>'],
            ['BEED', 'Bachelor of Elementary Education', '<span class="cf-chip">Active</span>'],
            ['BSA', 'Bachelor of Science in Accountancy', '<span class="cf-chip">Active</span>'],
          ], 'View All', ROUTES.REGISTRAR_CURRICULUM_PROGRAMS, 'cf-programs')}

          ${renderTableCard('Departments', ['Department', 'Building', 'Programs'], [
            ['College of Computing', 'Tech Building', '<span class="cf-tag">BSIT</span>'],
            ['College of Education', 'Education Building', '<span class="cf-tag">BSED</span>'],
            ['College of Business', 'Admin Building', '<span class="cf-tag">BSBA</span>'],
            ['General Education', 'Education Building', '<span class="cf-tag">BSBA</span>'],
            ['Graduate School', 'Graduate Building', '<span class="cf-tag">BSBA</span>'],
          ], 'View All', ROUTES.REGISTRAR_CURRICULUM_DEPARTMENTS, 'cf-departments')}

          ${renderTableCard('Buildings', ['Building Name', 'Code', 'Departments'], [
            ['Technology Building', 'TECH', 'College of Computing'],
            ['Education Building', 'EDU', 'College of Education'],
            ['Administration Building', 'ADMIN', 'College of Business'],
            ['Library Building', 'LIB', 'General Education'],
            ['Graduate Building', 'GRAD', 'Graduate School'],
          ], 'View All', ROUTES.REGISTRAR_CURRICULUM_BUILDINGS, 'cf-buildings')}

          ${renderTableCard('Rooms', ['Room Name', 'Room No.', 'Building', 'Capacity'], [
            ['IT Laboratory 1', 'TECH 101', 'Technology Building', '40'],
            ['IT Laboratory 2', 'TECH 102', 'Technology Building', '40'],
            ['Lecture Room 1', 'EDU 201', 'Education Building', '60'],
            ['Lecture Room 2', 'EDU 202', 'Education Building', '60'],
            ['Conference Room', 'ADMIN 301', 'Administration Building', '30'],
          ], 'View All', ROUTES.REGISTRAR_CURRICULUM_ROOMS, 'cf-rooms')}

          ${renderTableCard('Sets', ['Set Code', 'Set Name', 'Program', 'Year Level', 'SY'], [
            ['BSIT-1A', 'BSIT 1st Year - A', 'BSIT', '1st Year', '2024-2025'],
            ['BSIT-1B', 'BSIT 1st Year - B', 'BSIT', '1st Year', '2024-2025'],
            ['BSED-2A', 'BSED 2nd Year - A', 'BSED', '2nd Year', '2024-2025'],
            ['BSBA-3A', 'BSBA 3rd Year - A', 'BSBA', '3rd Year', '2024-2025'],
            ['BSA-4A', 'BSA 4th Year - A', 'BSA', '4th Year', '2024-2025'],
          ], 'View All', ROUTES.REGISTRAR_CURRICULUM_SETS, 'cf-sets')}

          ${renderTableCard('Subjects', ['Subject Code', 'Descriptive Title', 'Program', 'Units'], [
            ['IT101', 'Introduction to Computing', 'BSIT', '3'],
            ['IT102', 'Programming 1 (C++)', 'BSIT', '3'],
            ['ED201', 'Principles of Teaching', 'BSED', '3'],
            ['BA301', 'Financial Management', 'BSBA', '3'],
            ['GE001', 'Purposive Communication', 'All', '3'],
          ], 'View All', ROUTES.REGISTRAR_CURRICULUM_SUBJECTS, 'cf-subjects')}
        </section>
      </section>
    `,
  )
}

function renderStatCard(icon: string, value: string, label: string, tone: string): string {
  return `
    <article class="cf-stat-card">
      <div class="cf-stat-main">
        <span class="cf-stat-icon ${tone}" aria-hidden="true"><i class="bi ${icon}"></i></span>
        <div class="cf-stat-copy">
          <strong>${value}</strong>
          <span>${label}</span>
        </div>
      </div>
    </article>
  `
}

function renderTableCard(
  title: string,
  headers: string[],
  rows: string[][],
  footerLink: string,
  footerHref: string,
  sectionId: string,
): string {
  return `
    <article class="cf-table-card" id="${sectionId}">
      <header class="cf-table-head">
        <h3>${title}</h3>
        <a href="${footerHref}" class="cf-card-link">${footerLink}</a>
      </header>
      <div class="cf-table-wrap">
        <div class="table-responsive">
        <table class="table table-striped table-hover cf-table">
          <thead>
            <tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((col) => `<td>${col}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        </div>
      </div>
    </article>
  `
}
