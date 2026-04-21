import { REGISTRAR_STAFF_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { ROUTES } from '../../../app/routes'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'

function floatingInput(id: string, label: string, type = 'text', placeholder = ''): string {
  return `
    <div class="form-floating">
      <input type="${type}" class="form-control form-control-sm" id="${id}" placeholder="${placeholder || label}" />
      <label for="${id}">${label}</label>
    </div>
  `
}

function floatingSelect(id: string, label: string, placeholder: string, options: string[]): string {
  return `
    <div class="form-floating">
      <select class="form-select form-select-sm" id="${id}">
        <option value="" selected disabled>${placeholder}</option>
        ${options.map((option) => `<option>${option}</option>`).join('')}
      </select>
      <label for="${id}">${label}</label>
    </div>
  `
}

function renderTimeSlot(slot: number): string {
  return `
    <div class="time-slot">
      <div class="time-slot-head">
        <h4>Time Slot ${slot}</h4>
        <button type="button" class="time-slot-remove btn btn-outline-danger btn-sm" data-remove-time-slot disabled>Remove</button>
      </div>
      <div class="admin-student-form-grid admin-student-form-grid-4">
        ${floatingSelect(`slot-day-${slot}`, 'Day', 'Select Day', [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ])}
        ${floatingInput(`slot-start-${slot}`, 'Start Time', 'time')}
        ${floatingInput(`slot-end-${slot}`, 'End Time', 'time')}
        ${floatingSelect(`slot-mode-${slot}`, 'Delivery Mode', 'Select Delivery Mode', [
          'Face-to-Face',
          'Online',
          'Hybrid',
        ])}
      </div>
    </div>
  `
}

export function renderregistrar_staff_schedule_create_page(): string {
  return renderPortalShell(
    REGISTRAR_STAFF_SHELL_CONFIG,
    'schedule',
    `
      <section class="registrar_staff-content class-scheduling-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Home', href: ROUTES.REGISTRAR_STAFF_DASHBOARD },
          { label: 'Schedule', href: ROUTES.REGISTRAR_STAFF_SCHEDULE },
          { label: 'Manage Schedule', href: ROUTES.REGISTRAR_STAFF_SCHEDULE_MANAGE },
          { label: 'Create Schedule', active: true },
        ])}
        <article class="admin-student-page-shell">
          <header class="admin-student-head">
            <h2>Create Schedule</h2>
            <p>Create and organize course schedules for the upcoming term.</p>
          </header>

          <form class="class-scheduling-form" action="#" method="post" novalidate>
            <section class="admin-student-section">
              <h3><span class="admin-student-section-title">Schedule Information</span></h3>
              <div class="admin-student-form-grid">
                ${floatingSelect('schedule-term', 'Academic Term', 'Select Academic Term', [
                  '1st Semester AY 2026-2027',
                  '2nd Semester AY 2026-2027',
                  'Summer AY 2026-2027',
                ])}
                ${floatingSelect('schedule-department', 'College Department', 'Select College Department', [
                  'College of Computer Studies',
                  'College of Business',
                  'College of Education',
                ])}
                ${floatingInput('schedule-subject-code', 'Subject Code', 'text', 'Subject Code')}
                ${floatingInput('schedule-descriptive-title', 'Descriptive Title', 'text', 'Descriptive Title')}
                ${floatingInput('schedule-section', 'Section', 'text', 'Section')}
                ${floatingInput('schedule-units', 'Units', 'number', 'Units')}
              </div>
            </section>

            <section class="admin-student-section">
              <h3><span class="admin-student-section-title">Faculty and Room Assignment</span></h3>
              <div class="admin-student-form-grid">
                ${floatingSelect('schedule-faculty', 'Assigned Faculty', 'Select Assigned Faculty', [
                  'Prof. Maria Dela Cruz',
                  'Prof. John Santos',
                  'Prof. Angela Reyes',
                ])}
                ${floatingSelect('schedule-building', 'Building', 'Select Building', ['Main Building', 'SHS Building'])}
                ${floatingSelect('schedule-room', 'Room', 'Select Room', ['Room 301', 'Room 305', 'Computer Lab 2'])}
              </div>
            </section>

            <section class="admin-student-section">
              <h3><span class="admin-student-section-title">Meeting Time</span></h3>
              <div class="class-scheduling-toolbar">
                <button type="button" class="btn btn-outline-primary btn-sm" data-add-time-slot>+ Add Another Time Slot</button>
              </div>
              <div data-time-slots>
                ${renderTimeSlot(1)}
              </div>
            </section>

            <section class="admin-student-section">
              <h3><span class="admin-student-section-title">Class Capacity and Notes</span></h3>
              <div class="admin-student-form-grid">
                ${floatingInput('schedule-capacity', 'Maximum Capacity', 'number', 'Maximum Capacity')}
                ${floatingInput('schedule-reserve-slots', 'Reserve Slots', 'number', 'Reserve Slots')}
                <div class="form-floating class-scheduling-notes">
                  <textarea class="form-control form-control-sm" id="schedule-notes" placeholder="Notes / Remarks"></textarea>
                  <label for="schedule-notes">Notes / Remarks</label>
                </div>
              </div>
            </section>

            <footer class="admin-student-form-footer">
              <a href="${ROUTES.REGISTRAR_STAFF_SCHEDULE_MANAGE}" class="btn btn-light btn-sm">Cancel</a>
              <button type="button" class="btn btn-primary btn-sm">Create Schedule</button>
            </footer>
          </form>
        </article>
      </section>
    `,
  )
}

export function setupclass_scheduling_form(root: HTMLElement): () => void {
  const addButton = root.querySelector<HTMLButtonElement>('[data-add-time-slot]')
  const slotContainer = root.querySelector<HTMLElement>('[data-time-slots]')

  if (!addButton || !slotContainer) {
    return () => {}
  }

  const normalizeSlotFields = (slot: HTMLElement, index: number): void => {
    const daySelect = slot.querySelectorAll<HTMLSelectElement>('select')[0]
    const startTime = slot.querySelectorAll<HTMLInputElement>('input[type="time"]')[0]
    const endTime = slot.querySelectorAll<HTMLInputElement>('input[type="time"]')[1]
    const modeSelect = slot.querySelectorAll<HTMLSelectElement>('select')[1]
    const labels = slot.querySelectorAll<HTMLLabelElement>('.form-floating > label')

    if (daySelect) daySelect.id = `slot-day-${index}`
    if (startTime) startTime.id = `slot-start-${index}`
    if (endTime) endTime.id = `slot-end-${index}`
    if (modeSelect) modeSelect.id = `slot-mode-${index}`

    if (labels[0] && daySelect) labels[0].setAttribute('for', daySelect.id)
    if (labels[1] && startTime) labels[1].setAttribute('for', startTime.id)
    if (labels[2] && endTime) labels[2].setAttribute('for', endTime.id)
    if (labels[3] && modeSelect) labels[3].setAttribute('for', modeSelect.id)
  }

  const renumberSlots = (): void => {
    const slots = Array.from(slotContainer.querySelectorAll<HTMLElement>('.time-slot'))
    const disableRemove = slots.length <= 1

    slots.forEach((slot, index) => {
      const heading = slot.querySelector<HTMLHeadingElement>('h4')
      const removeBtn = slot.querySelector<HTMLButtonElement>('[data-remove-time-slot]')
      normalizeSlotFields(slot, index + 1)
      if (heading) heading.textContent = `Time Slot ${index + 1}`
      if (removeBtn) removeBtn.disabled = disableRemove
    })
  }

  const onAddSlot = (): void => {
    const firstSlot = slotContainer.querySelector<HTMLElement>('.time-slot')
    if (!firstSlot) return

    const clonedSlot = firstSlot.cloneNode(true) as HTMLElement
    const daySelect = clonedSlot.querySelector<HTMLSelectElement>('select')
    const startTime = clonedSlot.querySelector<HTMLInputElement>('input[type="time"]')
    const endTime = clonedSlot.querySelectorAll<HTMLInputElement>('input[type="time"]')[1]
    const modeSelect = clonedSlot.querySelectorAll<HTMLSelectElement>('select')[1]

    if (daySelect) daySelect.selectedIndex = 0
    if (startTime) startTime.value = ''
    if (endTime) endTime.value = ''
    if (modeSelect) modeSelect.selectedIndex = 0

    slotContainer.appendChild(clonedSlot)
    renumberSlots()
  }

  const onSlotAction = (event: Event): void => {
    const target = event.target as HTMLElement | null
    if (!target) return

    const removeBtn = target.closest<HTMLButtonElement>('[data-remove-time-slot]')
    if (!removeBtn) return

    const slot = removeBtn.closest<HTMLElement>('.time-slot')
    if (!slot) return

    slot.remove()
    renumberSlots()
  }

  addButton.addEventListener('click', onAddSlot)
  slotContainer.addEventListener('click', onSlotAction)
  renumberSlots()

  return () => {
    addButton.removeEventListener('click', onAddSlot)
    slotContainer.removeEventListener('click', onSlotAction)
  }
}

