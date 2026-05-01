import '../../styles/registrar.css'
import { registrar_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'
import { setupclass_scheduling_form } from './schedule/schedule_create_page'
import { setupschedule_manage_page } from './schedule/schedule_manage_page'

export { renderregistrar_dashboard_page } from './dashboard/dashboard_page'
export { renderregistrar_student_records_page } from './student_records/student_records_page'
export { renderregistrar_enrollments_page, setupRegistrarEnrollmentsPage } from './enrollments/enrollments_page'
export {
  renderregistrar_admission_page,
  renderregistrar_admission_review_page,
  renderregistrar_admission_details_page,
  setupregistrar_admission_page,
  setupregistrar_admission_review_page,
  setupregistrar_admission_details_page,
} from './admission/admission_page'
export { renderregistrar_requests_page } from './requests/requests_page'
export { renderregistrar_curriculum_facilities_page } from './curriculum_facilities/curriculum_facilities_page'
export { renderregistrar_schedule_page } from './schedule/schedule_page'
export { renderregistrar_schedule_manage_page } from './schedule/schedule_manage_page'
export { renderregistrar_schedule_create_page } from './schedule/schedule_create_page'
export { renderregistrar_settings_page } from './settings/settings_page'

export function setupregistrar_page(root: HTMLElement): () => void {
  return setupPortalShell(root, registrar_SHELL_CONFIG)
}

export function setupregistrar_schedule_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, registrar_SHELL_CONFIG)
  const departmentSelect = root.querySelector<HTMLSelectElement>('[data-registrar-department-select]')
  const departmentBoards = Array.from(root.querySelectorAll<HTMLElement>('[data-registrar-department-board]'))
  const emptyState = root.querySelector<HTMLElement>('[data-registrar-empty-state]')
  const searchInput = root.querySelector<HTMLInputElement>('[data-registrar-schedule-search]')

  const updateDepartmentView = (): void => {
    const selectedDepartment = departmentSelect?.value || ''
    const hasSelection = selectedDepartment.length > 0

    departmentBoards.forEach((board) => {
      board.hidden = board.dataset.registrarDepartmentBoard !== selectedDepartment
    })

    if (emptyState) {
      emptyState.hidden = hasSelection
    }

    updateSearchView()
  }

  const updateSearchView = (): void => {
    const query = (searchInput?.value || '').trim().toLowerCase()
    const visibleBoard = departmentBoards.find((board) => !board.hidden)
    if (!visibleBoard) return

    const items = Array.from(visibleBoard.querySelectorAll<HTMLElement>('[data-registrar-schedule-item]'))
    const noResults = visibleBoard.querySelector<HTMLElement>('[data-registrar-schedule-no-results]')
    let visibleCount = 0

    items.forEach((item) => {
      const matches = !query || (item.dataset.searchValue || '').includes(query)
      item.hidden = !matches
      if (matches) visibleCount += 1
    })

    if (noResults) {
      noResults.hidden = visibleCount > 0
    }
  }

  const onMobileDayClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLButtonElement>('[data-mobile-day-tab]')
    if (!button) return

    const scheduleShell = button.closest<HTMLElement>('[data-mobile-schedule]')
    if (!scheduleShell) return

    const selectedDay = button.dataset.mobileDayTab
    if (!selectedDay) return

    const tabs = Array.from(scheduleShell.querySelectorAll<HTMLButtonElement>('[data-mobile-day-tab]'))
    const panels = Array.from(scheduleShell.querySelectorAll<HTMLElement>('[data-mobile-day-panel]'))

    tabs.forEach((tab) => {
      const isActive = tab.dataset.mobileDayTab === selectedDay
      tab.classList.toggle('is-active', isActive)
      tab.setAttribute('aria-pressed', String(isActive))
    })

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.mobileDayPanel !== selectedDay
    })
  }

  const onInstructorJumpClick = (event: Event): void => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLButtonElement>('[data-registrar-schedule-jump]')
    const targetId = button?.dataset.registrarScheduleJump
    if (!targetId) return

    const tableSection = root.querySelector<HTMLElement>(`#${CSS.escape(targetId)}`)
    if (!tableSection || tableSection.hidden) return

    tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    tableSection.focus({ preventScroll: true })
    tableSection.classList.remove('is-highlighted')
    window.requestAnimationFrame(() => {
      tableSection.classList.add('is-highlighted')
    })
    window.setTimeout(() => {
      tableSection.classList.remove('is-highlighted')
    }, 2200)
  }

  departmentSelect?.addEventListener('change', updateDepartmentView)
  searchInput?.addEventListener('input', updateSearchView)
  root.addEventListener('click', onMobileDayClick)
  root.addEventListener('click', onInstructorJumpClick)
  updateDepartmentView()

  return () => {
    departmentSelect?.removeEventListener('change', updateDepartmentView)
    searchInput?.removeEventListener('input', updateSearchView)
    root.removeEventListener('click', onMobileDayClick)
    root.removeEventListener('click', onInstructorJumpClick)
    cleanupShell()
  }
}

export function setupregistrar_schedule_manage_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, registrar_SHELL_CONFIG)
  const cleanupManage = setupschedule_manage_page(root)

  return () => {
    cleanupManage()
    cleanupShell()
  }
}

export function setupregistrar_schedule_create_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, registrar_SHELL_CONFIG)
  const cleanupSchedule = setupclass_scheduling_form(root)

  return () => {
    cleanupSchedule()
    cleanupShell()
  }
}




