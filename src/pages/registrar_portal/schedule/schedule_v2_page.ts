import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const HOURS = [
  { start: '7:00 AM', end: '8:00 AM' },
  { start: '8:00 AM', end: '9:00 AM' },
  { start: '9:00 AM', end: '10:00 AM' },
  { start: '10:00 AM', end: '11:00 AM' },
  { start: '11:00 AM', end: '12:00 PM' },
  { start: '12:00 PM', end: '1:00 PM' },
  { start: '1:00 PM', end: '2:00 PM' },
  { start: '2:00 PM', end: '3:00 PM' },
  { start: '3:00 PM', end: '4:00 PM' },
  { start: '4:00 PM', end: '5:00 PM' },
] as const

function renderCell(label = '', meta = '', tone = 'neutral'): string {
  if (!label) return '<div class="registrar-schedule-v2-cell registrar-schedule-v2-cell-empty"></div>'
  return `
    <div class="registrar-schedule-v2-cell registrar-schedule-v2-cell-${tone}">
      <strong>${label}</strong>
      <small>${meta}</small>
    </div>
  `
}

export function renderregistrar_schedule_v2_page(): string {
  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'schedule_v2',
    `
      <section class="registrar-content">
        <article class="registrar-panel registrar-schedule-v2-panel">
          <header class="registrar-schedule-v2-head">
            <div>
              <h3>Schedule Builder</h3>
            </div>
            <div class="registrar-schedule-v2-head-actions">
              <button type="button" class="btn btn-sm btn-outline-secondary" data-schedule-v2-open-details><i class="bi bi-layout-sidebar-inset"></i> Details</button>
              <button type="button" class="btn btn-sm btn-primary"><i class="bi bi-stars"></i> Auto Generate</button>
              <button type="button" class="btn btn-sm btn-success"><i class="bi bi-plus-lg"></i> Add Schedule</button>
              <button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-exclamation-octagon"></i> Detect Conflicts</button>
            </div>
          </header>

          <section class="registrar-schedule-v2-toolbar">
            <label>
              <span>Program</span>
              <select class="form-select form-select-sm">
                <option>BS Information Technology</option>
                <option>BS Computer Science</option>
              </select>
            </label>
            <label>
              <span>Section</span>
              <select class="form-select form-select-sm">
                <option>2A</option>
                <option>2B</option>
              </select>
            </label>
            <div class="registrar-schedule-v2-view-switch" role="group" aria-label="View switch">
              <button type="button" class="is-active" data-schedule-v2-view="grid"><i class="bi bi-grid-3x3-gap"></i> Grid View</button>
              <button type="button" data-schedule-v2-view="list"><i class="bi bi-list-ul"></i> List View</button>
            </div>
          </section>

          <section class="registrar-schedule-v2-layout">
            <div class="registrar-schedule-v2-main">
              <div class="registrar-schedule-v2-grid-wrap">
                <div class="registrar-schedule-v2-grid-head">
                  <span>Time</span>
                  ${DAYS.map((day) => `<span>${day}</span>`).join('')}
                </div>
                <div class="registrar-schedule-v2-grid">
                  ${HOURS.map((hour, rowIndex) => `
                    <div class="registrar-schedule-v2-time"><span>${hour.start}</span><span>${hour.end}</span></div>
                    <div>${rowIndex === 0 ? renderCell('IT 204', 'Web Systems - Room 301', 'blue') : rowIndex === 3 ? renderCell('CS 201', 'Data Structures - Room 302', 'violet') : renderCell()}</div>
                    <div>${rowIndex === 0 ? renderCell('MATH 201', 'Discrete Math - Room 305', 'violet') : rowIndex === 5 ? renderCell('PE 2', 'Activity Center', 'yellow') : renderCell()}</div>
                    <div>${rowIndex === 0 ? renderCell('IT 204', 'Web Systems - Room 301', 'blue') : rowIndex === 6 ? renderCell('IT 205 LAB', 'Network Lab - Lab 1', 'teal') : renderCell()}</div>
                    <div>${rowIndex === 0 ? renderCell('MATH 201', 'Discrete Math - Room 305', 'violet') : rowIndex === 5 ? renderCell('PE 2', 'Activity Center', 'yellow') : renderCell()}</div>
                    <div>${rowIndex === 0 ? renderCell('IT 204', 'Web Systems - Room 301', 'blue') : rowIndex === 6 ? renderCell('IT 205 LAB', 'Network Lab - Lab 1', 'teal') : renderCell()}</div>
                    <div>${rowIndex === 1 ? renderCell('NSTP 2', 'CWTS 2 - Room 201', 'indigo') : renderCell()}</div>
                  `).join('')}
                </div>
              </div>

              <div class="registrar-schedule-v2-legend">
                <span><i class="registrar-schedule-v2-dot registrar-schedule-v2-dot-blue"></i>Major (with lab)</span>
                <span><i class="registrar-schedule-v2-dot registrar-schedule-v2-dot-violet"></i>Major</span>
                <span><i class="registrar-schedule-v2-dot registrar-schedule-v2-dot-yellow"></i>GE</span>
                <span><i class="registrar-schedule-v2-dot registrar-schedule-v2-dot-teal"></i>Laboratory</span>
              </div>

              <section class="registrar-schedule-v2-bottom">
                <article class="registrar-schedule-v2-card registrar-schedule-v2-conflicts">
                  <header class="registrar-schedule-v2-card-head">
                    <h5>Conflicts Detected</h5>
                    <span class="registrar-schedule-v2-card-badge">1</span>
                  </header>
                  <div class="registrar-schedule-v2-conflict-table" role="table" aria-label="Conflict list">
                    <div class="registrar-schedule-v2-conflict-row" role="row">
                      <strong role="cell"><i class="bi bi-exclamation-circle-fill"></i>Instructor Conflict</strong>
                      <span role="cell">Nirii Reow Mil Conflict re viersted on Sun 5:00 AM - 15:00 AM</span>
                      <a href="#" role="cell">View Details</a>
                    </div>
                    <div class="registrar-schedule-v2-conflict-row" role="row">
                      <strong role="cell"><i class="bi bi-x-circle-fill"></i>Room Conflict</strong>
                      <span role="cell">Room 201 Canused foomed on West 8:00 AM - 11:00 AM</span>
                      <a href="#" role="cell">View Details</a>
                    </div>
                    <div class="registrar-schedule-v2-conflict-row" role="row">
                      <strong role="cell"><i class="bi bi-exclamation-triangle-fill"></i>Daily Load Warning</strong>
                      <span role="cell">Narii Tlas Conf will wand the tlsss tast at 10 hrs on Monday</span>
                      <a href="#" role="cell">View Details</a>
                    </div>
                  </div>
                  <footer class="registrar-schedule-v2-card-foot"><a href="#">View all conflicts <i class="bi bi-chevron-down"></i></a></footer>
                </article>
                <article class="registrar-schedule-v2-card registrar-schedule-v2-hours">
                  <header class="registrar-schedule-v2-card-head">
                    <h5>Subject Hour Settings</h5>
                  </header>
                  <table class="registrar-schedule-v2-hours-table">
                    <thead>
                      <tr><th>Type</th><th>Max Week / Week</th><th>Max: Week / Week</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Ninor (Aith Labi)</td><td>4 hrs</td><td>8 hrs</td></tr>
                      <tr><td>Niger (Without Labi)</td><td>3 hrs</td><td>4 hrs</td></tr>
                      <tr><td>Minor</td><td>1 hrs</td><td>2 hrs</td></tr>
                    </tbody>
                  </table>
                  <footer class="registrar-schedule-v2-card-foot"><a href="#">Edit settings <i class="bi bi-chevron-down"></i></a></footer>
                </article>
              </section>
            </div>

            <aside class="registrar-schedule-v2-side">
              <section class="registrar-schedule-v2-side-card">
                <header class="registrar-schedule-v2-side-head">
                  <h5>Floating Subjects</h5>
                </header>
                <ul>
                  <li><span>IT 307 - Artificial Intelligence</span><em class="badge text-bg-primary">Major</em></li>
                  <li><span>GE 103 - Purposive Communication</span><em class="badge text-bg-success">Minor</em></li>
                  <li><span>IT ELEC 1 - Mobile Development</span><em class="badge text-bg-primary">Major</em></li>
                </ul>
                <footer><a class="registrar-schedule-v2-side-link" href="#">View all floating subjects <i class="bi bi-chevron-down"></i></a></footer>
              </section>
              <section class="registrar-schedule-v2-side-card">
                <header class="registrar-schedule-v2-side-head">
                  <h5>Available Rooms</h5>
                </header>
                <ul>
                  <li><span>Room 101</span><small>Capacity 45</small></li>
                  <li><span>Room 201</span><small>Capacity 40</small></li>
                  <li><span>Lab 2 (Network)</span><small>Capacity 30</small></li>
                </ul>
                <footer><a class="registrar-schedule-v2-side-link" href="#">View all rooms <i class="bi bi-chevron-down"></i></a></footer>
              </section>
              <section class="registrar-schedule-v2-side-card">
                <header class="registrar-schedule-v2-side-head">
                  <h5>Priority Settings</h5>
                </header>
                <ul>
                  <li><span>Major subjects</span><small>Min 15 hrs/week</small></li>
                  <li><span>Minor subjects</span><small>Max 8 hrs/week</small></li>
                </ul>
                <footer><a class="registrar-schedule-v2-side-link" href="#">Manage priorities <i class="bi bi-chevron-down"></i></a></footer>
              </section>
            </aside>
          </section>

          <div class="offcanvas-backdrop fade" data-schedule-v2-backdrop hidden></div>
          <aside
            class="offcanvas offcanvas-end registrar-schedule-v2-details-offcanvas"
            tabindex="-1"
            aria-labelledby="schedule-v2-details-label"
            data-schedule-v2-details
          >
            <div class="offcanvas-header">
              <h4 id="schedule-v2-details-label" class="offcanvas-title">Schedule Details</h4>
              <button type="button" class="btn-close" aria-label="Close" data-schedule-v2-close-details></button>
            </div>
            <div class="offcanvas-body">
              <div class="registrar-schedule-v2-tabs">
                <button type="button" class="is-active" data-schedule-v2-tab="add">Add Schedule</button>
                <button type="button" data-schedule-v2-tab="edit">Edit Selection</button>
              </div>
              <div class="registrar-schedule-v2-form">
                <div class="registrar-schedule-v2-two">
                  <label><span>Program</span><select class="form-select form-select-sm"><option>BS Information Technology</option></select></label>
                  <label><span>Section</span><select class="form-select form-select-sm"><option>2A</option></select></label>
                </div>
                <label><span>Subject</span><select class="form-select form-select-sm"><option>OS 001 - Operating Systems</option></select></label>

                <fieldset class="registrar-schedule-v2-inline-options">
                  <legend>Type</legend>
                  <label><input type="radio" name="sched-type" checked /> Major</label>
                  <label><input type="radio" name="sched-type" /> Minor</label>
                </fieldset>

                <fieldset class="registrar-schedule-v2-inline-options">
                  <legend>Unit</legend>
                  <label><input type="radio" name="sched-unit" checked /> With Lab</label>
                  <label><input type="radio" name="sched-unit" /> Without Lab</label>
                </fieldset>

                <fieldset class="registrar-schedule-v2-inline-options">
                  <legend>Mode</legend>
                  <label><input type="radio" name="sched-mode" checked /> Face-to-Core</label>
                  <label><input type="radio" name="sched-mode" /> Linior</label>
                  <label><input type="radio" name="sched-mode" /> Hybrid</label>
                </fieldset>

                <label><span>Instructor</span><select class="form-select form-select-sm"><option>Delf. Dela Cruz</option></select></label>
                <div class="registrar-schedule-v2-two">
                  <label><span>Room</span><select class="form-select form-select-sm"><option>Room 302</option></select></label>
                  <label><span>Day</span><select class="form-select form-select-sm"><option>Monday</option></select></label>
                </div>
                <div class="registrar-schedule-v2-two">
                  <label><span>Start</span><input class="form-control form-control-sm" value="2:00 PM" /></label>
                  <label><span>End</span><input class="form-control form-control-sm" value="5:00 PM" /></label>
                </div>
                <p class="registrar-schedule-v2-duration">Duration: <strong>5 hrs</strong></p>
                <div class="registrar-schedule-v2-form-actions">
                  <button type="button" class="btn btn-sm btn-light" data-schedule-v2-close-details>Cancel</button>
                  <button type="button" class="btn btn-sm btn-primary">Save Schedule</button>
                </div>
              </div>

              <div class="registrar-schedule-v2-load">
                <h5>Instructor Load</h5>
                <p><span>Dela. Daka Cruz</span><strong></strong></p>
                <p><span>Max Hours / Week</span><strong>30 hrs</strong></p>
                <p><span>Current Load</span><strong>24 hrs</strong></p>
                <div class="progress" role="progressbar" aria-label="Instructor load" aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-bar bg-success" style="width: 68%"></div>
                </div>
                <p><span>24 / 30 hrs (80%)</span><strong></strong></p>
                <div class="registrar-schedule-v2-daily-load">
                  <h6>Daily Load (Max 10 hrs/day)</h6>
                  <div class="registrar-schedule-v2-daily-grid">
                    <span><strong>MON</strong><em>0 / 10</em></span>
                    <span><strong>TUE</strong><em>3 / 10</em></span>
                    <span><strong>WED</strong><em>4 / 10</em></span>
                    <span><strong>THU</strong><em>4 / 10</em></span>
                    <span><strong>FRI</strong><em>4 / 10</em></span>
                    <span><strong>SAT</strong><em>0 / 10</em></span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </article>
      </section>
    `,
  )
}

export function setupregistrar_schedule_v2_page(root: HTMLElement): () => void {
  const detailsOffcanvas = root.querySelector<HTMLElement>('[data-schedule-v2-details]')
  const backdrop = root.querySelector<HTMLElement>('[data-schedule-v2-backdrop]')

  const closeDetails = (): void => {
    if (!detailsOffcanvas || !backdrop) return
    detailsOffcanvas.classList.remove('show')
    backdrop.classList.remove('show')
    backdrop.setAttribute('hidden', '')
    document.body.classList.remove('registrar-schedule-v2-offcanvas-open')
  }

  const openDetails = (): void => {
    if (!detailsOffcanvas || !backdrop) return
    detailsOffcanvas.classList.add('show')
    backdrop.removeAttribute('hidden')
    window.requestAnimationFrame(() => {
      backdrop.classList.add('show')
    })
    document.body.classList.add('registrar-schedule-v2-offcanvas-open')
  }

  const onViewClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLButtonElement>('[data-schedule-v2-view]')
    if (!button) return
    const group = button.parentElement
    if (!group) return
    Array.from(group.querySelectorAll('button')).forEach((item) => item.classList.remove('is-active'))
    button.classList.add('is-active')
  }

  const onTabClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLButtonElement>('[data-schedule-v2-tab]')
    if (!button) return
    const group = button.parentElement
    if (!group) return
    Array.from(group.querySelectorAll('button')).forEach((item) => item.classList.remove('is-active'))
    button.classList.add('is-active')
  }

  const onDetailsClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    if (target?.closest('[data-schedule-v2-open-details]')) {
      openDetails()
      return
    }
    if (target?.closest('[data-schedule-v2-close-details]')) {
      closeDetails()
    }
  }

  const onEsc = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      closeDetails()
    }
  }

  root.addEventListener('click', onViewClick)
  root.addEventListener('click', onTabClick)
  root.addEventListener('click', onDetailsClick)
  document.addEventListener('keydown', onEsc)
  return () => {
    closeDetails()
    root.removeEventListener('click', onViewClick)
    root.removeEventListener('click', onTabClick)
    root.removeEventListener('click', onDetailsClick)
    document.removeEventListener('keydown', onEsc)
  }
}
