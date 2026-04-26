import '../../styles/administrators/layout.css'
import '../../styles/administrators/shared_admin.css'
import '../../styles/administrators/students.css'
import '../../styles/administrators/posts.css'
import '../../styles/administrators/testimonials.css'
import { ADMIN_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'
import { setupSharedModal } from '../../components/ui/modal'
import { schedulingService } from '../../features/scheduling/service'

export { renderadministrators_dashboard_page } from './dashboard/dashboard_page'
export { renderregistrar_admin_page } from './registrar/registrar_page'
export { renderfaculty_page } from './faculty/faculty_page'
export { renderstudents_page } from './students/students_page'
export { renderstudents_manage_page, setupstudents_manage_page } from './students/students_manage_page'
export { renderposts_page } from './posts/posts_page'
export { renderposts_create_page, setupposts_create_page } from './posts/posts_create_page'
export { rendertestimonials_page } from './testimonials/testimonials_page'
export { rendertestimonials_create_page, setuptestimonials_create_page } from './testimonials/testimonials_create_page'
export { renderdepartments_page } from './departments/departments_page'
export { renderreports_page } from './reports/reports_page'
export { rendersettings_page } from './settings/settings_page'

export function setupadministrators_page(root: HTMLElement): () => void {
  return setupPortalShell(root, ADMIN_SHELL_CONFIG)
}

export function setupadministrators_dashboard_page(root: HTMLElement): () => void {
  return setupPortalShell(root, ADMIN_SHELL_CONFIG)
}

export function setupdepartments_page(root: HTMLElement): () => void {
  const cleanup = setupPortalShell(root, ADMIN_SHELL_CONFIG)
  const modal = setupSharedModal(root, { modalSelector: '#department-request-modal' })
  let selectedScheduleId: string | null = null

  const onClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLButtonElement>('[data-dept-action="request"]')
    if (!button) return

    const row = button.closest<HTMLElement>('[data-schedule-id]')
    const scheduleId = row?.getAttribute('data-schedule-id')
    if (!scheduleId) return

    selectedScheduleId = scheduleId
    modal.setMode('form')
    modal.setOnConfirm(() => {
      if (!selectedScheduleId) return

      const proposedChangeInput = root.querySelector<HTMLInputElement>('#dept-proposed-change-modal')
      const reasonInput = root.querySelector<HTMLTextAreaElement>('#dept-change-reason-modal')

      const proposedChange = proposedChangeInput?.value.trim() || 'Adjust time and room allocation.'
      const reason = reasonInput?.value.trim() || 'Department requested schedule refinement.'

      schedulingService.createModificationRequest({
        scheduleId: selectedScheduleId,
        requesterRole: 'DEPARTMENT',
        requesterId: 'dept-ccs',
        reason,
        proposedChange,
      })
      modal.close()
      window.location.reload()
    })

    modal.open({
      title: `Request Change: ${scheduleId}`,
      confirmLabel: 'Submit Request',
      bodyHtml: `
        <div class="shared-modal-grid shared-modal-grid-1">
          <div class="form-floating">
            <input id="dept-proposed-change-modal" class="form-control" placeholder="Proposed Change" />
            <label for="dept-proposed-change-modal">Proposed Change</label>
          </div>
          <div class="form-floating">
            <textarea id="dept-change-reason-modal" class="form-control" placeholder="Reason" style="min-height: 110px;"></textarea>
            <label for="dept-change-reason-modal">Reason</label>
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

