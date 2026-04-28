import '../../styles/faculty.css'
import { FACULTY_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'
import { setupSharedModal } from '../../components/ui/modal'
import { schedulingService } from '../../features/scheduling/service'

export { renderfaculty_dashboard_page } from './dashboard/dashboard_page'
export { renderfaculty_schedule_page } from './schedule/schedule_page'
export { renderfaculty_classes_page } from './classes/classes_page'
export { renderfaculty_gradebook_page } from './gradebook/gradebook_page'
export { renderfaculty_settings_page } from './settings/settings_page'

export function setupfaculty_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, FACULTY_SHELL_CONFIG)
  const onMobileDayClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLButtonElement>('[data-mobile-day-tab]')
    if (!button) return
    const shell = button.closest<HTMLElement>('[data-mobile-schedule]')
    if (!shell) return
    const selectedDay = button.dataset.mobileDayTab
    if (!selectedDay) return
    const tabs = Array.from(shell.querySelectorAll<HTMLButtonElement>('[data-mobile-day-tab]'))
    const panels = Array.from(shell.querySelectorAll<HTMLElement>('[data-mobile-day-panel]'))
    tabs.forEach((tab) => {
      const isActive = tab.dataset.mobileDayTab === selectedDay
      tab.classList.toggle('is-active', isActive)
      tab.setAttribute('aria-pressed', String(isActive))
    })
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.mobileDayPanel !== selectedDay
    })
  }
  root.addEventListener('click', onMobileDayClick)
  return () => {
    root.removeEventListener('click', onMobileDayClick)
    cleanupShell()
  }
}

export function setupfaculty_classes_page(root: HTMLElement): () => void {
  const cleanup = setupPortalShell(root, FACULTY_SHELL_CONFIG)
  const modal = setupSharedModal(root, { modalSelector: '#faculty-request-modal' })
  let selectedScheduleId: string | null = null

  const onClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLButtonElement>('[data-faculty-request]')
    if (!button) return

    const scheduleId = button.dataset.scheduleId
    if (!scheduleId) return

    selectedScheduleId = scheduleId
    modal.setMode('form')
    modal.setOnConfirm(() => {
      if (!selectedScheduleId) return

      const reason =
        root.querySelector<HTMLTextAreaElement>('#faculty-feedback-modal')?.value.trim() || 'Faculty conflict feedback.'
      const proposedChange =
        root.querySelector<HTMLInputElement>('#faculty-proposed-change-modal')?.value.trim() ||
        'Adjust assigned block to avoid overlap.'

      schedulingService.createModificationRequest({
        scheduleId: selectedScheduleId,
        requesterRole: 'FACULTY',
        requesterId: 'faculty-1',
        reason,
        proposedChange,
      })
      modal.close()
      window.location.reload()
    })

    modal.open({
      title: `Adjustment Request: ${scheduleId}`,
      confirmLabel: 'Submit Request',
      bodyHtml: `
        <div class="shared-modal-grid shared-modal-grid-1">
          <div class="form-floating">
            <textarea id="faculty-feedback-modal" class="form-control" placeholder="Conflict feedback" style="min-height: 110px;"></textarea>
            <label for="faculty-feedback-modal">Conflict Feedback</label>
          </div>
          <div class="form-floating">
            <input id="faculty-proposed-change-modal" class="form-control" placeholder="Proposed adjustment" />
            <label for="faculty-proposed-change-modal">Proposed Adjustment</label>
          </div>
        </div>
      `,
    })
  }

  root.addEventListener('click', onClick)
  return () => {
    root.removeEventListener('click', onClick)
    modal.destroy()
    cleanup()
  }
}
