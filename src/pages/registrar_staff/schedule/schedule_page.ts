import { REGISTRAR_STAFF_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { ROUTES } from '../../../app/routes'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'

export function renderregistrar_staff_schedule_page(): string {
  return renderPortalShell(
    REGISTRAR_STAFF_SHELL_CONFIG,
    'schedule',
    `
      <section class="registrar_staff-content class-scheduling-content">
        ${renderBreadcrumbNav([
          { label: 'Home', href: ROUTES.REGISTRAR_STAFF_DASHBOARD },
          { label: 'Schedule', active: true },
        ])}
        <header class="registrar_staff-panel class-scheduling-header">
          <h3>Class Scheduling</h3>
          <p>Create and organize course schedules for the upcoming term.</p>
        </header>

        <form class="class-scheduling-form" action="#" method="post" novalidate>
          <section class="schedule-card">
            <h3>Schedule Information</h3>
            <div class="schedule-grid two-col">
              <label class="field">
                <span>Academic Term</span>
                <select>
                  <option>1st Semester AY 2026-2027</option>
                  <option>2nd Semester AY 2026-2027</option>
                  <option>Summer AY 2026-2027</option>
                </select>
              </label>
              <label class="field">
                <span>College Department</span>
                <select>
                  <option>College of Computer Studies</option>
                  <option>College of Business</option>
                  <option>College of Education</option>
                </select>
              </label>
              <label class="field">
                <span>Course Code</span>
                <input type="text" placeholder="e.g. CS 301" />
              </label>
              <label class="field">
                <span>Course Title</span>
                <input type="text" placeholder="e.g. Software Engineering" />
              </label>
              <label class="field">
                <span>Section</span>
                <input type="text" placeholder="e.g. BSCS-3A" />
              </label>
              <label class="field">
                <span>Units</span>
                <input type="number" min="1" max="6" placeholder="3" />
              </label>
            </div>
          </section>

          <section class="schedule-card">
            <h3>Faculty and Room Assignment</h3>
            <div class="schedule-grid two-col">
              <label class="field">
                <span>Assigned Faculty</span>
                <select>
                  <option>Prof. Maria Dela Cruz</option>
                  <option>Prof. John Santos</option>
                  <option>Prof. Angela Reyes</option>
                </select>
              </label>
              <label class="field">
                <span>Building</span>
                <select>
                  <option>Main Building</option>
                  <option>SHS Building</option>
                </select>
              </label>
              <label class="field">
                <span>Room</span>
                <select>
                  <option>Room 301</option>
                  <option>Room 305</option>
                  <option>Computer Lab 2</option>
                </select>
              </label>
            </div>
          </section>

          <section class="schedule-card">
            <div class="card-head">
              <h3>Meeting Time</h3>
              <button type="button" class="ghost-btn" data-add-time-slot>+ Add Another Time Slot</button>
            </div>

            <div data-time-slots>
              <div class="time-slot">
                <div class="time-slot-head">
                  <h4>Time Slot 1</h4>
                  <button type="button" class="time-slot-remove" data-remove-time-slot disabled>Remove</button>
                </div>
                <div class="schedule-grid four-col">
                  <label class="field">
                    <span>Day</span>
                    <select>
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                    </select>
                  </label>
                  <label class="field">
                    <span>Start Time</span>
                    <input type="time" value="07:30" />
                  </label>
                  <label class="field">
                    <span>End Time</span>
                    <input type="time" value="09:00" />
                  </label>
                  <label class="field">
                    <span>Delivery Mode</span>
                    <select>
                      <option>Face-to-Face</option>
                      <option>Online</option>
                      <option>Hybrid</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section class="schedule-card">
            <h3>Class Capacity and Notes</h3>
            <div class="schedule-grid two-col">
              <label class="field">
                <span>Maximum Capacity</span>
                <input type="number" min="1" placeholder="45" />
              </label>
              <label class="field">
                <span>Reserve Slots</span>
                <input type="number" min="0" placeholder="5" />
              </label>
              <label class="field full">
                <span>Notes / Remarks</span>
                <textarea rows="4" placeholder="Type special instructions, lab requirements, or scheduling notes."></textarea>
              </label>
            </div>
          </section>

          <aside class="schedule-summary">
            <h3>Schedule Summary</h3>
            <ul>
              <li><strong>Status:</strong> Draft</li>
              <li><strong>Conflict Check:</strong> Pending</li>
              <li><strong>Last Updated:</strong> April 21, 2026</li>
            </ul>
          </aside>

          <div class="schedule-actions">
            <button type="button" class="btn-secondary">Save as Draft</button>
            <button type="button" class="btn-warning">Check Conflict</button>
            <button type="button" class="btn-primary">Submit Schedule</button>
          </div>
        </form>
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

  const renumberSlots = (): void => {
    const slots = Array.from(slotContainer.querySelectorAll<HTMLElement>('.time-slot'))
    const disableRemove = slots.length <= 1

    slots.forEach((slot, index) => {
      const heading = slot.querySelector<HTMLHeadingElement>('h4')
      const removeBtn = slot.querySelector<HTMLButtonElement>('[data-remove-time-slot]')
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
