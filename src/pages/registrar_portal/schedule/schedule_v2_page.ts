import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import {
  SCHEDULE_DAY_ORDER,
  getScheduleDayLabel,
  listScheduleConflicts,
  listSchedulePlannerEntries,
  listScheduleRoomSummaries,
  listScheduleSubjectSummaries,
  toScheduleDisplayTime,
  type SchedulePlannerEntry,
  type ScheduleTimeRow,
} from '../../../data/schedule'

const ENTRIES = listSchedulePlannerEntries()
const PROGRAMS = Array.from(new Set(ENTRIES.map((entry) => entry.program))).sort()
const SUBJECTS = listScheduleSubjectSummaries()
const ROOMS = listScheduleRoomSummaries()
const CONFLICTS = listScheduleConflicts()
const FIRST_ENTRY = ENTRIES[0]
const SECTIONS_BY_PROGRAM = ENTRIES.reduce<Record<string, Set<string>>>((acc, entry) => {
  if (!acc[entry.program]) {
    acc[entry.program] = new Set<string>()
  }
  acc[entry.program].add(entry.section)
  return acc
}, {})

function toMinutes(value: string): number {
  const [hourText, minuteText = '0'] = value.split(':')
  return Number.parseInt(hourText, 10) * 60 + Number.parseInt(minuteText, 10)
}

function getDurationHours(startTime: string, endTime: string): string {
  const duration = (toMinutes(endTime) - toMinutes(startTime)) / 60
  return Number.isInteger(duration) ? `${duration} hrs` : `${duration.toFixed(1)} hrs`
}

function getBadgeClass(category: string): string {
  if (category === 'Major (with lab)') return 'text-bg-primary'
  if (category === 'GE') return 'text-bg-success'
  if (category === 'Minor') return 'text-bg-secondary'
  return 'text-bg-info'
}

function renderOptions(values: string[], fallback: string): string {
  const options = values.length ? values : [fallback]
  return options.map((value) => `<option>${value}</option>`).join('')
}

function renderUnselectedOptions(values: string[], placeholder: string): string {
  return [`<option value="" selected>${placeholder}</option>`, ...values.map((value) => `<option>${value}</option>`)].join('')
}

function renderSelectedOptions(values: string[], selectedValue: string, emptyLabel = 'No options available'): string {
  if (!values.length) {
    return `<option value="">${emptyLabel}</option>`
  }
  return values.map((value) => `<option${value === selectedValue ? ' selected' : ''}>${value}</option>`).join('')
}

function listSectionsForProgram(program: string): string[] {
  const sections = SECTIONS_BY_PROGRAM[program]
  if (!sections) return []
  return Array.from(sections).sort((a, b) => a.localeCompare(b))
}

function filterEntries(program: string, section: string): SchedulePlannerEntry[] {
  return ENTRIES.filter((entry) => entry.program === program && entry.section === section)
}

function getEmptyStateMessage(program: string, section: string): string {
  if (!program) return 'Select a program first to view schedules.'
  if (!section) return 'Select a section to view schedules.'
  return 'No schedule yet for this section. Try another section.'
}

function listTimeRowsForEntries(entries: SchedulePlannerEntry[]): ScheduleTimeRow[] {
  const rows = new Map<string, ScheduleTimeRow>()
  entries.forEach((entry) => {
    const key = `${entry.startTime}|${entry.endTime}`
    if (rows.has(key)) return
    rows.set(key, {
      startTime: entry.startTime,
      endTime: entry.endTime,
      startLabel: toScheduleDisplayTime(entry.startTime),
      endLabel: toScheduleDisplayTime(entry.endTime),
    })
  })
  return Array.from(rows.values()).sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime) || toMinutes(a.endTime) - toMinutes(b.endTime))
}

function renderCell(entries: SchedulePlannerEntry[] = []): string {
  if (!entries.length) return '<div class="registrar-schedule-v2-cell registrar-schedule-v2-cell-empty"></div>'
  const tone = entries[0].tone
  return `
    <div class="registrar-schedule-v2-cell registrar-schedule-v2-cell-${tone}">
      ${entries
        .map(
          (entry) => `
            <strong>${entry.subject}</strong>
            <small>${entry.section} - ${entry.room}</small>
          `,
        )
        .join('')}
    </div>
  `
}

function renderEmptyStateCard(message: string, mode: 'grid' | 'list'): string {
  const modeClass = mode === 'grid' ? 'registrar-schedule-v2-empty-state-grid' : ''
  return `
    <article class="registrar-schedule-v2-card registrar-schedule-v2-empty-state ${modeClass}">
      <p class="mb-0">${message}</p>
    </article>
  `
}

function renderGrid(entries: SchedulePlannerEntry[], emptyMessage: string): string {
  const timeRows = listTimeRowsForEntries(entries)
  if (!timeRows.length) return renderEmptyStateCard(emptyMessage, 'grid')
  return timeRows
    .map(
      (timeRow) => `
        <div class="registrar-schedule-v2-time"><span>${timeRow.startLabel}</span><span>${timeRow.endLabel}</span></div>
        ${SCHEDULE_DAY_ORDER
          .map((day) =>
            renderCell(
              entries.filter(
                (entry) =>
                  entry.dayKey === day &&
                  entry.startTime === timeRow.startTime &&
                  entry.endTime === timeRow.endTime,
              ),
            ),
          )
          .join('')}
      `,
    )
    .join('')
}

function renderList(entries: SchedulePlannerEntry[], emptyMessage: string): string {
  if (!entries.length) return renderEmptyStateCard(emptyMessage, 'list')
  const grouped = entries.reduce<Record<string, SchedulePlannerEntry[]>>((acc, entry) => {
    if (!acc[entry.day]) acc[entry.day] = []
    acc[entry.day].push(entry)
    return acc
  }, {})

  return Object.entries(grouped)
    .map(
      ([day, dayEntries]) => `
        <section class="registrar-schedule-v2-list-day">
          <header>
            <h5>${day}</h5>
            <span>${dayEntries.length} classes</span>
          </header>
          <div class="registrar-schedule-v2-list-items">
            ${dayEntries
              .map(
                (entry) => `
                  <article class="registrar-schedule-v2-list-item registrar-schedule-v2-cell-${entry.tone}">
                    <div>
                      <strong>${entry.subject}</strong>
                      <small>${entry.meta}</small>
                      <span>${entry.program} - ${entry.section}</span>
                    </div>
                    <div>
                      <em>${entry.time}</em>
                      <span>${entry.instructor}</span>
                      <span>${entry.room}</span>
                    </div>
                  </article>
                `,
              )
              .join('')}
          </div>
        </section>
      `,
    )
    .join('')
}

function renderConflicts(): string {
  if (!CONFLICTS.length) {
    return '<div class="registrar-schedule-v2-conflict-row" role="row"><strong role="cell"><i class="bi bi-check-circle-fill"></i>No conflicts</strong><span role="cell">No overlapping instructor, room, or section blocks were detected.</span><span role="cell"></span></div>'
  }

  return CONFLICTS.map(
    (conflict) => `
      <div class="registrar-schedule-v2-conflict-row" role="row">
        <strong role="cell"><i class="bi ${conflict.icon}"></i>${conflict.type}</strong>
        <span role="cell">${conflict.detail}</span>
        <a href="#" role="cell">View Details</a>
      </div>
    `,
  ).join('')
}

function renderHourSettings(): string {
  const groups = ENTRIES.reduce<Record<string, { units: number; subjects: Set<string>; blocks: number }>>((acc, entry) => {
    const key = `${entry.units}-unit subjects`
    if (!acc[key]) acc[key] = { units: entry.units, subjects: new Set<string>(), blocks: 0 }
    acc[key].subjects.add(entry.subject)
    acc[key].blocks += 1
    return acc
  }, {})

  return Object.entries(groups)
    .map(
      ([label, group]) => `
        <tr>
          <td>${label}</td>
          <td>${group.subjects.size} subjects</td>
          <td>${group.blocks} scheduled blocks</td>
        </tr>
      `,
    )
    .join('')
}

function renderInstructorLoad(): string {
  if (!FIRST_ENTRY) return ''
  const instructorEntries = ENTRIES.filter((entry) => entry.instructor === FIRST_ENTRY.instructor)
  const weeklyHours = instructorEntries.reduce((sum, entry) => sum + Number.parseFloat(getDurationHours(entry.startTime, entry.endTime)), 0)
  const loadPercent = Math.min(100, Math.round((weeklyHours / 30) * 100))

  return `
    <h5>Instructor Load</h5>
    <p><span>${FIRST_ENTRY.instructor}</span><strong></strong></p>
    <p><span>Max Hours / Week</span><strong>30 hrs</strong></p>
    <p><span>Current Load</span><strong>${weeklyHours} hrs</strong></p>
    <div class="progress" role="progressbar" aria-label="Instructor load" aria-valuenow="${loadPercent}" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-bar bg-success" style="width: ${loadPercent}%"></div>
    </div>
    <p><span>${weeklyHours} / 30 hrs (${loadPercent}%)</span><strong></strong></p>
    <div class="registrar-schedule-v2-daily-load">
      <h6>Daily Load (Max 10 hrs/day)</h6>
      <div class="registrar-schedule-v2-daily-grid">
        ${SCHEDULE_DAY_ORDER
          .map((day) => {
            const dailyHours = instructorEntries
              .filter((entry) => entry.dayKey === day)
              .reduce((sum, entry) => sum + Number.parseFloat(getDurationHours(entry.startTime, entry.endTime)), 0)
            return `<span><strong>${day}</strong><em>${dailyHours} / 10</em></span>`
          })
          .join('')}
      </div>
    </div>
  `
}

export function renderregistrar_schedule_v2_page(): string {
  const defaultSubject = FIRST_ENTRY ? `${FIRST_ENTRY.subject} - ${FIRST_ENTRY.meta}` : 'PT102 - Platform-based Development'
  const defaultInstructor = FIRST_ENTRY?.instructor ?? 'Faculty'
  const defaultRoom = FIRST_ENTRY?.room ?? 'Room 304'
  const defaultDay = FIRST_ENTRY ? getScheduleDayLabel(FIRST_ENTRY.dayKey) : 'Monday'
  const defaultStart = FIRST_ENTRY ? toScheduleDisplayTime(FIRST_ENTRY.startTime) : '9:00 AM'
  const defaultEnd = FIRST_ENTRY ? toScheduleDisplayTime(FIRST_ENTRY.endTime) : '10:00 AM'
  const defaultDuration = FIRST_ENTRY ? getDurationHours(FIRST_ENTRY.startTime, FIRST_ENTRY.endTime) : '1 hr'
  const filteredEntries: SchedulePlannerEntry[] = []
  const initialEmptyMessage = getEmptyStateMessage('', '')

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
              <button type="button" class="btn btn-sm btn-primary"><i class="bi bi-stars"></i> Auto Generate</button>
              <button type="button" class="btn btn-sm btn-success" data-schedule-v2-open-add><i class="bi bi-plus-lg"></i> Add Schedule</button>
              <button type="button" class="btn btn-sm btn-outline-secondary" data-schedule-v2-open-edit><i class="bi bi-pencil-square"></i> Edit Schedule</button>
              <button type="button" class="btn btn-sm btn-outline-danger"><i class="bi bi-exclamation-octagon"></i> Detect Conflicts</button>
            </div>
          </header>

          <section class="registrar-schedule-v2-toolbar">
            <label>
              <span>Program</span>
              <select class="form-select form-select-sm" data-schedule-v2-toolbar-program>
                ${renderUnselectedOptions(PROGRAMS, 'Select Program')}
              </select>
            </label>
            <label>
              <span>Section</span>
              <select class="form-select form-select-sm" data-schedule-v2-toolbar-section>
                ${renderUnselectedOptions([], 'Select Program First')}
              </select>
            </label>
            <div class="registrar-schedule-v2-view-switch" role="group" aria-label="View switch">
              <button type="button" class="is-active" data-schedule-v2-view="grid" aria-pressed="true"><i class="bi bi-grid-3x3-gap"></i> Grid View</button>
              <button type="button" data-schedule-v2-view="list" aria-pressed="false"><i class="bi bi-list-ul"></i> List View</button>
            </div>
          </section>

          <section class="registrar-schedule-v2-layout">
            <div class="registrar-schedule-v2-main">
              <div class="registrar-schedule-v2-view-panel" data-schedule-v2-view-panel="grid">
                <div class="registrar-schedule-v2-grid-wrap" data-schedule-v2-grid-wrap${filteredEntries.length ? '' : ' hidden'}>
                  <div class="registrar-schedule-v2-grid-head">
                    <span>Time</span>
                    ${SCHEDULE_DAY_ORDER.map((day) => `<span>${day}</span>`).join('')}
                  </div>
                  <div class="registrar-schedule-v2-grid" data-schedule-v2-grid>
                    ${renderGrid(filteredEntries, initialEmptyMessage)}
                  </div>
                </div>
                <div data-schedule-v2-grid-empty${filteredEntries.length ? ' hidden' : ''}>
                  ${renderEmptyStateCard(initialEmptyMessage, 'list')}
                </div>
              </div>

              <div class="registrar-schedule-v2-view-panel" data-schedule-v2-view-panel="list" hidden>
                <div class="registrar-schedule-v2-list" data-schedule-v2-list>
                  ${renderList(filteredEntries, initialEmptyMessage)}
                </div>
              </div>

              <div class="registrar-schedule-v2-legend">
                <span><i class="registrar-schedule-v2-dot registrar-schedule-v2-dot-blue"></i>Major (with lab)</span>
                <span><i class="registrar-schedule-v2-dot registrar-schedule-v2-dot-violet"></i>Major</span>
                <span><i class="registrar-schedule-v2-dot registrar-schedule-v2-dot-yellow"></i>GE</span>
                <span><i class="registrar-schedule-v2-dot registrar-schedule-v2-dot-teal"></i>Research</span>
                <span><i class="registrar-schedule-v2-dot registrar-schedule-v2-dot-indigo"></i>Minor</span>
              </div>

              <section class="registrar-schedule-v2-bottom">
                <article class="registrar-schedule-v2-card registrar-schedule-v2-conflicts">
                  <header class="registrar-schedule-v2-card-head">
                    <h5>Conflicts Detected</h5>
                    <span class="registrar-schedule-v2-card-badge">${CONFLICTS.length}</span>
                  </header>
                  <div class="registrar-schedule-v2-conflict-table" role="table" aria-label="Conflict list">
                    ${renderConflicts()}
                  </div>
                  <footer class="registrar-schedule-v2-card-foot"><a href="#">View all conflicts <i class="bi bi-chevron-down"></i></a></footer>
                </article>
                <article class="registrar-schedule-v2-card registrar-schedule-v2-hours">
                  <header class="registrar-schedule-v2-card-head">
                    <h5>Subject Hour Settings</h5>
                  </header>
                  <table class="registrar-schedule-v2-hours-table">
                    <thead>
                      <tr><th>Type</th><th>Subjects</th><th>Scheduled Blocks</th></tr>
                    </thead>
                    <tbody>
                      ${renderHourSettings()}
                    </tbody>
                  </table>
                  <footer class="registrar-schedule-v2-card-foot"><a href="#">Edit settings <i class="bi bi-chevron-down"></i></a></footer>
                </article>
              </section>
            </div>

            <aside class="registrar-schedule-v2-side">
              <section class="registrar-schedule-v2-side-card">
                <header class="registrar-schedule-v2-side-head">
                  <h5>Subjects</h5>
                </header>
                <ul>
                  ${SUBJECTS.map((subject) => `<li><span>${subject.code} - ${subject.title}</span><em class="badge ${getBadgeClass(subject.category)}">${subject.category}</em></li>`).join('')}
                </ul>
                <footer><a class="registrar-schedule-v2-side-link" href="#">View all subjects <i class="bi bi-chevron-down"></i></a></footer>
              </section>
              <section class="registrar-schedule-v2-side-card">
                <header class="registrar-schedule-v2-side-head">
                  <h5>Available Rooms</h5>
                </header>
                <ul>
                  ${ROOMS.map((room) => `<li><span>${room.room}</span><small>Capacity ${room.capacity}</small></li>`).join('')}
                </ul>
                <footer><a class="registrar-schedule-v2-side-link" href="#">View all rooms <i class="bi bi-chevron-down"></i></a></footer>
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
              <h4 id="schedule-v2-details-label" class="offcanvas-title" data-schedule-v2-details-title>Add Schedule</h4>
              <button type="button" class="btn-close" aria-label="Close" data-schedule-v2-close-details></button>
            </div>
            <div class="offcanvas-body">
              <div class="registrar-schedule-v2-form">
                <p class="registrar-schedule-v2-duration" data-schedule-v2-form-hint>Set up a new schedule slot.</p>
                <div class="registrar-schedule-v2-two">
                  <label><span>Program</span><select class="form-select form-select-sm" data-schedule-v2-form-program>${renderUnselectedOptions(PROGRAMS, 'Select Program')}</select></label>
                  <label><span>Section</span><select class="form-select form-select-sm" data-schedule-v2-form-section>${renderUnselectedOptions([], 'Select Program First')}</select></label>
                </div>
                <label><span>Subject</span><select class="form-select form-select-sm">${SUBJECTS.map((subject) => `<option>${subject.code} - ${subject.title}</option>`).join('') || `<option>${defaultSubject}</option>`}</select></label>

                <fieldset class="registrar-schedule-v2-inline-options">
                  <legend>Type</legend>
                  <label><input type="radio" name="sched-type" checked /> Major</label>
                  <label><input type="radio" name="sched-type" /> GE</label>
                  <label><input type="radio" name="sched-type" /> Minor</label>
                </fieldset>

                <fieldset class="registrar-schedule-v2-inline-options">
                  <legend>Unit</legend>
                  <label><input type="radio" name="sched-unit" checked /> 3 Units</label>
                  <label><input type="radio" name="sched-unit" /> 2 Units</label>
                </fieldset>

                <fieldset class="registrar-schedule-v2-inline-options">
                  <legend>Mode</legend>
                  <label><input type="radio" name="sched-mode" checked /> Face-to-Face</label>
                  <label><input type="radio" name="sched-mode" /> Online</label>
                  <label><input type="radio" name="sched-mode" /> Hybrid</label>
                </fieldset>

                <label><span>Instructor</span><select class="form-select form-select-sm">${renderOptions(Array.from(new Set(ENTRIES.map((entry) => entry.instructor))).sort(), defaultInstructor)}</select></label>
                <div class="registrar-schedule-v2-two">
                  <label><span>Room</span><select class="form-select form-select-sm">${renderOptions(ROOMS.map((room) => room.room), defaultRoom)}</select></label>
                  <label><span>Day</span><select class="form-select form-select-sm">${SCHEDULE_DAY_ORDER.map((day) => `<option>${getScheduleDayLabel(day)}</option>`).join('') || `<option>${defaultDay}</option>`}</select></label>
                </div>
                <div class="registrar-schedule-v2-two">
                  <label><span>Start</span><input class="form-control form-control-sm" value="${defaultStart}" /></label>
                  <label><span>End</span><input class="form-control form-control-sm" value="${defaultEnd}" /></label>
                </div>
                <p class="registrar-schedule-v2-duration">Duration: <strong>${defaultDuration}</strong></p>
                <div class="registrar-schedule-v2-form-actions">
                  <button type="button" class="btn btn-sm btn-light" data-schedule-v2-close-details>Cancel</button>
                  <button type="button" class="btn btn-sm btn-primary" data-schedule-v2-submit-btn>Save Schedule</button>
                </div>
              </div>

              <div class="registrar-schedule-v2-load" data-schedule-v2-load-panel hidden>
                ${renderInstructorLoad()}
              </div>
            </div>
          </aside>
        </article>
      </section>
    `,
  )
}

export function setupregistrar_schedule_v2_page(root: HTMLElement): () => void {
  type SchedulePanelMode = 'add' | 'edit'

  const detailsOffcanvas = root.querySelector<HTMLElement>('[data-schedule-v2-details]')
  const backdrop = root.querySelector<HTMLElement>('[data-schedule-v2-backdrop]')
  const detailsTitle = root.querySelector<HTMLElement>('[data-schedule-v2-details-title]')
  const formHint = root.querySelector<HTMLElement>('[data-schedule-v2-form-hint]')
  const submitButton = root.querySelector<HTMLButtonElement>('[data-schedule-v2-submit-btn]')
  const loadPanel = root.querySelector<HTMLElement>('[data-schedule-v2-load-panel]')
  const toolbarProgramSelect = root.querySelector<HTMLSelectElement>('[data-schedule-v2-toolbar-program]')
  const toolbarSectionSelect = root.querySelector<HTMLSelectElement>('[data-schedule-v2-toolbar-section]')
  const gridWrap = root.querySelector<HTMLElement>('[data-schedule-v2-grid-wrap]')
  const gridPanel = root.querySelector<HTMLElement>('[data-schedule-v2-grid]')
  const gridEmpty = root.querySelector<HTMLElement>('[data-schedule-v2-grid-empty]')
  const listPanel = root.querySelector<HTMLElement>('[data-schedule-v2-list]')
  const formProgramSelect = root.querySelector<HTMLSelectElement>('[data-schedule-v2-form-program]')
  const formSectionSelect = root.querySelector<HTMLSelectElement>('[data-schedule-v2-form-section]')
  let mode: SchedulePanelMode = 'add'

  const syncSectionOptions = (
    programSelect: HTMLSelectElement | null,
    sectionSelect: HTMLSelectElement | null,
    preferredSection?: string,
  ): void => {
    if (!programSelect || !sectionSelect) return
    if (!programSelect.value) {
      sectionSelect.innerHTML = renderUnselectedOptions([], 'Select Program First')
      sectionSelect.value = ''
      return
    }
    const sections = listSectionsForProgram(programSelect.value)
    if (!sections.length) {
      sectionSelect.innerHTML = '<option value="">No sections available</option>'
      sectionSelect.value = ''
      return
    }
    const currentSection = preferredSection ?? sectionSelect.value
    const nextSection = sections.includes(currentSection) ? currentSection : sections[0]
    sectionSelect.innerHTML = renderSelectedOptions(sections, nextSection)
    sectionSelect.value = nextSection
  }

  const renderSchedulesForSelection = (): void => {
    if (!toolbarProgramSelect || !toolbarSectionSelect || !gridPanel || !listPanel) return
    const emptyMessage = getEmptyStateMessage(toolbarProgramSelect.value, toolbarSectionSelect.value)
    const nextEntries = filterEntries(toolbarProgramSelect.value, toolbarSectionSelect.value)
    const hasEntries = nextEntries.length > 0
    if (gridWrap) {
      gridWrap.hidden = !hasEntries
    }
    if (gridEmpty) {
      gridEmpty.hidden = hasEntries
      if (!hasEntries) {
        gridEmpty.innerHTML = renderEmptyStateCard(emptyMessage, 'list')
      }
    }
    gridPanel.innerHTML = hasEntries ? renderGrid(nextEntries, emptyMessage) : ''
    listPanel.innerHTML = renderList(nextEntries, emptyMessage)
  }

  const onToolbarProgramChange = (): void => {
    syncSectionOptions(toolbarProgramSelect, toolbarSectionSelect)
    renderSchedulesForSelection()
  }

  const onToolbarSectionChange = (): void => {
    renderSchedulesForSelection()
  }

  const onFormProgramChange = (): void => {
    syncSectionOptions(formProgramSelect, formSectionSelect)
  }

  const applyMode = (nextMode: SchedulePanelMode): void => {
    mode = nextMode
    if (detailsTitle) {
      detailsTitle.textContent = mode === 'add' ? 'Add Schedule' : 'Edit Schedule'
    }
    if (formHint) {
      formHint.innerHTML =
        mode === 'add'
          ? 'Set up a new schedule slot.'
          : 'Update an existing schedule slot. <strong>Instructor Load</strong> is shown for conflict checks.'
    }
    if (submitButton) {
      submitButton.textContent = mode === 'add' ? 'Save Schedule' : 'Update Schedule'
    }
    if (loadPanel) {
      loadPanel.hidden = mode !== 'edit'
    }
  }

  const closeDetails = (): void => {
    if (!detailsOffcanvas || !backdrop) return
    detailsOffcanvas.classList.remove('show')
    backdrop.classList.remove('show')
    backdrop.setAttribute('hidden', '')
    document.body.classList.remove('registrar-schedule-v2-offcanvas-open')
  }

  const openDetails = (nextMode: SchedulePanelMode): void => {
    if (!detailsOffcanvas || !backdrop) return
    applyMode(nextMode)
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
    const nextView = button.dataset.scheduleV2View
    if (!nextView) return
    Array.from(group.querySelectorAll('button')).forEach((item) => {
      item.classList.remove('is-active')
      item.setAttribute('aria-pressed', 'false')
    })
    button.classList.add('is-active')
    button.setAttribute('aria-pressed', 'true')
    root.querySelectorAll<HTMLElement>('[data-schedule-v2-view-panel]')
      .forEach((panel) => {
        panel.hidden = panel.dataset.scheduleV2ViewPanel !== nextView
      })
  }

  const onDetailsClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    if (target?.closest('[data-schedule-v2-open-add]')) {
      openDetails('add')
      return
    }
    if (target?.closest('[data-schedule-v2-open-edit]')) {
      openDetails('edit')
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
  root.addEventListener('click', onDetailsClick)
  document.addEventListener('keydown', onEsc)
  toolbarProgramSelect?.addEventListener('change', onToolbarProgramChange)
  toolbarSectionSelect?.addEventListener('change', onToolbarSectionChange)
  formProgramSelect?.addEventListener('change', onFormProgramChange)
  applyMode('add')
  syncSectionOptions(toolbarProgramSelect, toolbarSectionSelect)
  syncSectionOptions(formProgramSelect, formSectionSelect)
  renderSchedulesForSelection()
  return () => {
    closeDetails()
    root.removeEventListener('click', onViewClick)
    root.removeEventListener('click', onDetailsClick)
    document.removeEventListener('keydown', onEsc)
    toolbarProgramSelect?.removeEventListener('change', onToolbarProgramChange)
    toolbarSectionSelect?.removeEventListener('change', onToolbarSectionChange)
    formProgramSelect?.removeEventListener('change', onFormProgramChange)
  }
}
