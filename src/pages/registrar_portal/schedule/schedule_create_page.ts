import { registrar_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { ROUTES } from '../../../app/routes'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { schedulingService } from '../../../features/scheduling/service'
import type { ScheduleItem } from '../../../features/scheduling/types'
import { DEFAULT_DEPARTMENT_CODE, DEPARTMENT_SELECT_OPTIONS } from '../../../data/departments'

function floatingInputWithFeedback(
  id: string,
  label: string,
  type = 'text',
  placeholder = '',
  feedback = '',
  extraAttributes = '',
): string {
  return `
    <div class="form-floating">
      <input type="${type}" class="form-control form-control-sm" id="${id}" placeholder="${placeholder || label}" ${extraAttributes} />
      <label for="${id}">${label}</label>
      ${feedback ? `<div class="invalid-feedback">${feedback}</div>` : ''}
    </div>
  `
}

function floatingSelect(
  id: string,
  label: string,
  placeholder: string,
  options: Array<string | { value: string; label: string }>,
  feedback = '',
  extraAttributes = '',
): string {
  return `
    <div class="form-floating">
      <select class="form-select form-select-sm" id="${id}" ${extraAttributes}>
        <option value="" selected disabled>${placeholder}</option>
        ${options
          .map((option) =>
            typeof option === 'string' ? `<option value="${option}">${option}</option>` : `<option value="${option.value}">${option.label}</option>`,
          )
          .join('')}
      </select>
      <label for="${id}">${label}</label>
      ${feedback ? `<div class="invalid-feedback">${feedback}</div>` : ''}
    </div>
  `
}

function deriveUnits(subjectCode: string, title: string): string {
  const normalized = `${subjectCode} ${title}`.toLowerCase().trim()
  if (!normalized) return ''

  if (normalized.includes('laboratory') || normalized.includes('lab')) {
    return '1'
  }

  if (normalized.includes('practicum') || normalized.includes('internship')) {
    return '2'
  }

  return '3'
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
        ], '', 'required')}
        ${floatingInputWithFeedback(`slot-start-${slot}`, 'Start Time', 'time', 'Start Time', 'Please choose a start time.', 'required min="07:00" max="18:00"')}
        ${floatingInputWithFeedback(`slot-end-${slot}`, 'End Time', 'time', 'End Time', 'Please choose an end time.', 'required min="07:00" max="18:00"')}
        ${floatingSelect(`slot-mode-${slot}`, 'Delivery Mode', 'Select Delivery Mode', [
          'Face-to-Face',
          'Online',
          'Hybrid',
        ], 'Please choose a delivery mode.', 'required')}
      </div>
    </div>
  `
}

export function renderregistrar_schedule_create_page(): string {
  return renderPortalShell(
    registrar_SHELL_CONFIG,
    'schedule',
    `
      <section class="registrar-content class-scheduling-content">
        ${renderBreadcrumbNav([
          { label: 'Schedule', href: ROUTES.REGISTRAR_SCHEDULE },
          { label: 'Manage Schedule', href: ROUTES.REGISTRAR_SCHEDULE_MANAGE },
          { label: 'Create Schedule', active: true },
        ])}
        <article class="admin-student-page-shell">
          <header class="admin-student-head">
            <h2>Create Schedule</h2>
            <p>Create schedule batches, run conflict checks, then send only conflicted schedules to admin for approval.</p>
          </header>

          <form class="class-scheduling-form" action="#" method="post" novalidate data-schedule-create-form>
            <section class="admin-student-section">
              <h3><span class="admin-student-section-title">Schedule Information</span></h3>
              <div class="admin-student-form-grid">
                ${floatingSelect('schedule-term', 'Academic Term', 'Select Academic Term', [
                  '1st Semester AY 2026-2027',
                  '2nd Semester AY 2026-2027',
                  'Summer AY 2026-2027',
                ], 'Please select an academic term.', 'required')}
                ${floatingSelect('schedule-department', 'College Department', 'Select College Department', [
                  ...DEPARTMENT_SELECT_OPTIONS,
                ], 'Please select a college department.', 'required')}
                ${floatingInputWithFeedback('schedule-section', 'Section', 'text', 'Section', 'Please enter a section.', 'required')}
                ${floatingInputWithFeedback(
                  'schedule-descriptive-title',
                  'Descriptive Title',
                  'text',
                  'Descriptive Title',
                  'Please enter a descriptive title.',
                  'required',
                )}
                ${floatingInputWithFeedback(
                  'schedule-subject-code',
                  'Subject Code',
                  'text',
                  'Subject Code',
                  'Please enter a subject code.',
                  'required',
                )}
                ${floatingInputWithFeedback('schedule-units', 'Units', 'number', 'Units', '', 'readonly aria-readonly="true" tabindex="-1"')}
              </div>
            </section>

            <section class="admin-student-section">
              <h3><span class="admin-student-section-title">Faculty and Room Assignment</span></h3>
              <div class="admin-student-form-grid">
                ${floatingSelect('schedule-faculty', 'Assigned Faculty', 'Select Assigned Faculty', [
                  'Prof. Maria Dela Cruz',
                  'Prof. John Santos',
                  'Prof. Angela Reyes',
                ], 'Please select an assigned faculty member.', 'required')}
                ${floatingSelect('schedule-building', 'Building', 'Select Building', ['Main Building', 'SHS Building'], 'Please select a building.', 'required')}
                ${floatingSelect('schedule-room', 'Room', 'Select Room', ['Room 204', 'Room 301', 'Room 305', 'Computer Lab 2'], 'Please select a room.', 'required')}
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
              <h3><span class="admin-student-section-title">Notes</span></h3>
              <div class="admin-student-form-grid">
                <div class="form-floating class-scheduling-notes">
                  <textarea class="form-control form-control-sm" id="schedule-notes" placeholder="Notes / Remarks"></textarea>
                  <label for="schedule-notes">Notes / Remarks for Admin</label>
                </div>
              </div>
            </section>

            <footer class="admin-student-form-footer">
              <a href="${ROUTES.REGISTRAR_SCHEDULE_MANAGE}" class="btn btn-light btn-sm">Cancel</a>
              <button type="button" class="btn btn-primary btn-sm" data-create-schedule>Create + Submit</button>
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
  const createButton = root.querySelector<HTMLButtonElement>('[data-create-schedule]')
  const form = root.querySelector<HTMLFormElement>('[data-schedule-create-form]')
  const subjectCodeInput = root.querySelector<HTMLInputElement>('#schedule-subject-code')
  const titleInput = root.querySelector<HTMLInputElement>('#schedule-descriptive-title')
  const unitsInput = root.querySelector<HTMLInputElement>('#schedule-units')

  if (!addButton || !slotContainer || !createButton || !form || !subjectCodeInput || !titleInput || !unitsInput) {
    return () => {}
  }

  const updateUnits = (): void => {
    unitsInput.value = deriveUnits(subjectCodeInput.value, titleInput.value)
  }

  const validateForm = (): boolean => {
    form.classList.add('was-validated')
    return form.checkValidity()
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

  const getValue = (selector: string): string =>
    root.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selector)?.value.trim() ?? ''

  const collectItems = (): ScheduleItem[] => {
    const slotNodes = Array.from(slotContainer.querySelectorAll<HTMLElement>('.time-slot'))
    const subjectCode = getValue('#schedule-subject-code')
    const descriptiveTitle = getValue('#schedule-descriptive-title')
    const section = getValue('#schedule-section')
    const faculty = getValue('#schedule-faculty')
    const department = getValue('#schedule-department')
    const room = getValue('#schedule-room')
    const capacity = 40

    return slotNodes.map((slot, index) => {
      const selects = slot.querySelectorAll<HTMLSelectElement>('select')
      const times = slot.querySelectorAll<HTMLInputElement>('input[type="time"]')
      return {
        id: `manual-${Date.now()}-${index}`,
        subjectCode,
        descriptiveTitle,
        section,
        faculty,
        department,
        room,
        day: selects[0]?.value ?? 'Monday',
        startTime: times[0]?.value ?? '07:00',
        endTime: times[1]?.value ?? '18:00',
        deliveryMode: (selects[1]?.value as ScheduleItem['deliveryMode']) || 'Face-to-Face',
        capacity,
      }
    })
  }

  const onCreateSubmit = (): void => {
    if (!validateForm()) {
      return
    }

    const items = collectItems()
    const schedule = schedulingService.createSchedule(
      {
        term: getValue('#schedule-term') || '1st Semester AY 2026-2027',
        department: getValue('#schedule-department') || DEFAULT_DEPARTMENT_CODE,
        registrarNotes: getValue('#schedule-notes'),
        items,
      },
      'registrar-1',
    )
    const conflicts = schedulingService.listConflicts(schedule.id)
    if (conflicts.length) {
      schedulingService.submitForApproval(schedule.id, 'registrar-1', getValue('#schedule-notes') || 'Submitted from create form')
    }
  }

  const onFieldInput = (): void => {
    updateUnits()
    form.classList.remove('was-validated')
  }

  addButton.addEventListener('click', onAddSlot)
  slotContainer.addEventListener('click', onSlotAction)
  createButton.addEventListener('click', onCreateSubmit)
  subjectCodeInput.addEventListener('input', onFieldInput)
  titleInput.addEventListener('input', onFieldInput)
  renumberSlots()
  unitsInput.value = ''

  return () => {
    addButton.removeEventListener('click', onAddSlot)
    slotContainer.removeEventListener('click', onSlotAction)
    createButton.removeEventListener('click', onCreateSubmit)
    subjectCodeInput.removeEventListener('input', onFieldInput)
    titleInput.removeEventListener('input', onFieldInput)
  }
}



