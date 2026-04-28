import '../../styles/dean.css'
import { DEAN_SHELL_CONFIG, setupPortalShell } from '../../components/layout/_layout'

export { renderdean_dashboard_page } from './dashboard/dashboard_page'
export { renderdean_schedule_page } from './schedule/schedule_page'

export function setupdean_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, DEAN_SHELL_CONFIG)
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

