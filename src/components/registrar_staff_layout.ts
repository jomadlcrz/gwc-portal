import {
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Menu,
  Settings,
  createIcons,
} from 'lucide'
import gwcLogo from '../assets/gwc_logo\.avif'
import { ROUTES } from '../app/routes'
import { renderMainsite_header } from './site_header'
import type { HeaderAction } from './site_header'

export type RegistrarStaffSection =
  | 'dashboard'
  | 'student_records'
  | 'enrollments'
  | 'requests'
  | 'schedule'
  | 'settings'

type RegistrarStaffMenuItem = {
  label: string
  icon: string
  href: string
  section: RegistrarStaffSection
}

const menuItems: RegistrarStaffMenuItem[] = [
  { label: 'Dashboard', icon: 'layout-dashboard', href: ROUTES.REGISTRAR_STAFF_DASHBOARD, section: 'dashboard' },
  {
    label: 'Student Records',
    icon: 'folder-open',
    href: ROUTES.REGISTRAR_STAFF_STUDENT_RECORDS,
    section: 'student_records',
  },
  { label: 'Enrollments', icon: 'file-text', href: ROUTES.REGISTRAR_STAFF_ENROLLMENTS, section: 'enrollments' },
  { label: 'Requests', icon: 'clipboard-list', href: ROUTES.REGISTRAR_STAFF_REQUESTS, section: 'requests' },
  { label: 'Schedule', icon: 'calendar-days', href: ROUTES.REGISTRAR_STAFF_SCHEDULE, section: 'schedule' },
  { label: 'Settings', icon: 'settings', href: ROUTES.REGISTRAR_STAFF_SETTINGS, section: 'settings' },
]

const registrarStaffHeaderActions: HeaderAction[] = [
  {
    type: 'button',
    icon: 'menu',
    label: 'MENU',
    className: 'registrar_staff-header-menu-toggle',
    attrs: 'data-registrar_staff-sidebar-open',
    ariaLabel: 'Open sidebar menu',
  },
]

const registrarStaffLabel = 'REGISTRAR STAFF'

function renderSidebar(section: RegistrarStaffSection): string {
  return `
    <aside class="registrar_staff-sidebar" aria-label="Registrar staff menu">
      <div class="registrar_staff-sidebar-main">
        <div class="registrar_staff-sidebar-head">
          <p class="registrar_staff-eyebrow">Office Portal</p>
          <h1><a href="${ROUTES.HOME}" class="registrar_staff-header-link">Registrar Staff</a></h1>
        </div>
        <nav class="registrar_staff-menu" aria-label="Registrar staff navigation">
          <ul>
            ${menuItems
              .map((item) => {
                const isActive = item.section === section
                return `
                  <li>
                    <a href="${item.href}" class="${isActive ? 'is-active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
                      <i data-lucide="${item.icon}" aria-hidden="true"></i>
                      <span>${item.label}</span>
                    </a>
                  </li>
                `
              })
              .join('')}
          </ul>
        </nav>
      </div>
      <footer class="registrar_staff-sidebar-footer">
        <p>Logged in as:</p>
        <strong>${registrarStaffLabel}</strong>
      </footer>
    </aside>
  `
}

export function renderregistrar_staff_shell(section: RegistrarStaffSection, content: string): string {
  return `
    <main class="registrar_staff-shell-page">
      ${renderMainsite_header({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        actions: registrarStaffHeaderActions,
        solid: true,
      })}
      <div class="registrar_staff-layout">
        ${renderSidebar(section)}
        ${content}
      </div>
      <button type="button" class="registrar_staff-sidebar-backdrop" aria-label="Close menu"></button>
    </main>
  `
}

export function setupregistrar_staff_shell(root: HTMLElement): () => void {
  const toggle = root.querySelector<HTMLButtonElement>('[data-registrar_staff-sidebar-open]')
  const backdrop = root.querySelector<HTMLButtonElement>('.registrar_staff-sidebar-backdrop')
  let bodyLocked = false

  createIcons({
    icons: {
      Menu,
      LayoutDashboard,
      FolderOpen,
      FileText,
      ClipboardList,
      CalendarDays,
      Settings,
    },
  })

  const closeSidebar = (): void => {
    root.classList.remove('registrar_staff-sidebar-open')
    toggle?.setAttribute('aria-expanded', 'false')
    if (bodyLocked) {
      document.body.classList.remove('overlay-open')
      bodyLocked = false
    }
  }

  const openSidebar = (): void => {
    root.classList.add('registrar_staff-sidebar-open')
    toggle?.setAttribute('aria-expanded', 'true')
    if (window.innerWidth <= 991 && !bodyLocked) {
      document.body.classList.add('overlay-open')
      bodyLocked = true
    }
  }

  const onToggle = (): void => {
    if (root.classList.contains('registrar_staff-sidebar-open')) {
      closeSidebar()
      return
    }
    openSidebar()
  }

  const onResize = (): void => {
    if (window.innerWidth >= 992) {
      closeSidebar()
    }
  }

  const onEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') closeSidebar()
  }

  toggle?.addEventListener('click', onToggle)
  backdrop?.addEventListener('click', closeSidebar)
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('keydown', onEscape)

  return () => {
    closeSidebar()
    toggle?.removeEventListener('click', onToggle)
    backdrop?.removeEventListener('click', closeSidebar)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('keydown', onEscape)
  }
}

