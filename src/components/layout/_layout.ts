const gwcLogo = '/images/gwc_logo.avif'
import { ROUTES } from '../../app/routes'
import { setupSharedPopover } from '../ui/popover'
import { renderMainSiteHeader } from './header'
import type { HeaderAction } from './header'

export type AdminSection =
  | 'dashboard'
  | 'administrators'
  | 'registrar_staff'
  | 'faculty'
  | 'students'
  | 'posts'
  | 'departments'
  | 'reports'
  | 'settings'

export type RegistrarStaffSection =
  | 'dashboard'
  | 'student_records'
  | 'enrollments'
  | 'requests'
  | 'schedule'
  | 'settings'

export type FacultySection = 'dashboard' | 'classes' | 'gradebook' | 'settings'
export type StudentSection = 'dashboard' | 'subjects' | 'grades' | 'schedule' | 'settings'

type ShellMenuItem<TSection extends string> = {
  label: string
  icon: string
  href: string
  section: TSection
}

export type ShellConfig<TSection extends string> = {
  pageClass: string
  layoutClass: string
  sidebarClass: string
  sidebarId?: string
  sidebarAriaLabel: string
  sidebarMainClass: string
  sidebarHeadClass: string
  sidebarEyebrowClass: string
  sidebarEyebrow: string
  sidebarTitle: string
  sidebarTitleClass: string
  sidebarMenuClass: string
  sidebarMenuAriaLabel: string
  sidebarFooterClass: string
  sidebarFooterValue: string
  backdropClass: string
  sidebarOpenClass: string
  mobileBodyLockWidth: number
  menuToggleSelector: string
  menuToggleClassName: string
  menuToggleAriaLabel: string
  headerBrandHref: string
  headerLogoAlt: string
  menuItems: ShellMenuItem<TSection>[]
}

export const ADMIN_SHELL_CONFIG: ShellConfig<AdminSection> = {
  pageClass: 'admin-page',
  layoutClass: 'admin-layout',
  sidebarClass: 'admin-sidebar',
  sidebarId: 'admin-sidebar',
  sidebarAriaLabel: 'Administration menu',
  sidebarMainClass: 'admin-sidebar-main',
  sidebarHeadClass: 'admin-sidebar-head',
  sidebarEyebrowClass: 'admin-eyebrow',
  sidebarEyebrow: 'Control Panel',
  sidebarTitle: 'Administration',
  sidebarTitleClass: 'admin-header-link',
  sidebarMenuClass: 'admin-menu',
  sidebarMenuAriaLabel: 'Sidebar navigation',
  sidebarFooterClass: 'admin-sidebar-footer',
  sidebarFooterValue: 'ADMIN',
  backdropClass: 'admin-sidebar-backdrop',
  sidebarOpenClass: 'admin-sidebar-open',
  mobileBodyLockWidth: 991,
  menuToggleSelector: '[data-admin-sidebar-open]',
  menuToggleClassName: 'admin-header-menu-toggle',
  menuToggleAriaLabel: 'Open sidebar menu',
  headerBrandHref: ROUTES.HOME,
  headerLogoAlt: 'Golden West Colleges logo',
  menuItems: [
    { label: 'Dashboard', icon: 'bi-speedometer2', href: ROUTES.ADMINISTRATORS, section: 'dashboard' },
    {
      label: 'Administrators',
      icon: 'bi-file-earmark-text',
      href: ROUTES.ADMINISTRATORS_DIRECTORY,
      section: 'administrators',
    },
    {
      label: 'Registrar Staff',
      icon: 'bi-folder2-open',
      href: ROUTES.ADMINISTRATORS_REGISTRAR_STAFF,
      section: 'registrar_staff',
    },
    { label: 'Faculty', icon: 'bi-mortarboard', href: ROUTES.ADMINISTRATORS_FACULTY, section: 'faculty' },
    { label: 'Students', icon: 'bi-people', href: ROUTES.ADMINISTRATORS_STUDENTS, section: 'students' },
    { label: 'Posts', icon: 'bi-megaphone', href: ROUTES.ADMINISTRATORS_POSTS, section: 'posts' },
    { label: 'Departments', icon: 'bi-building', href: ROUTES.ADMINISTRATORS_DEPARTMENTS, section: 'departments' },
    { label: 'Reports', icon: 'bi-briefcase', href: ROUTES.ADMINISTRATORS_REPORTS, section: 'reports' },
    { label: 'Settings', icon: 'bi-gear', href: ROUTES.ADMINISTRATORS_SETTINGS, section: 'settings' },
  ],
}

export const REGISTRAR_STAFF_SHELL_CONFIG: ShellConfig<RegistrarStaffSection> = {
  pageClass: 'registrar_staff-shell-page',
  layoutClass: 'registrar_staff-layout',
  sidebarClass: 'registrar_staff-sidebar',
  sidebarAriaLabel: 'Registrar staff menu',
  sidebarMainClass: 'registrar_staff-sidebar-main',
  sidebarHeadClass: 'registrar_staff-sidebar-head',
  sidebarEyebrowClass: 'registrar_staff-eyebrow',
  sidebarEyebrow: 'Office Portal',
  sidebarTitle: 'Registrar Staff',
  sidebarTitleClass: 'registrar_staff-header-link',
  sidebarMenuClass: 'registrar_staff-menu',
  sidebarMenuAriaLabel: 'Registrar staff navigation',
  sidebarFooterClass: 'registrar_staff-sidebar-footer',
  sidebarFooterValue: 'REGISTRAR STAFF',
  backdropClass: 'registrar_staff-sidebar-backdrop',
  sidebarOpenClass: 'registrar_staff-sidebar-open',
  mobileBodyLockWidth: 991,
  menuToggleSelector: '[data-registrar_staff-sidebar-open]',
  menuToggleClassName: 'registrar_staff-header-menu-toggle',
  menuToggleAriaLabel: 'Open sidebar menu',
  headerBrandHref: ROUTES.HOME,
  headerLogoAlt: 'Golden West Colleges logo',
  menuItems: [
    { label: 'Dashboard', icon: 'bi-speedometer2', href: ROUTES.REGISTRAR_STAFF_DASHBOARD, section: 'dashboard' },
    {
      label: 'Student Records',
      icon: 'bi-folder2-open',
      href: ROUTES.REGISTRAR_STAFF_STUDENT_RECORDS,
      section: 'student_records',
    },
    { label: 'Enrollments', icon: 'bi-file-earmark-text', href: ROUTES.REGISTRAR_STAFF_ENROLLMENTS, section: 'enrollments' },
    { label: 'Requests', icon: 'bi-clipboard-check', href: ROUTES.REGISTRAR_STAFF_REQUESTS, section: 'requests' },
    { label: 'Schedule', icon: 'bi-calendar3', href: ROUTES.REGISTRAR_STAFF_SCHEDULE, section: 'schedule' },
    { label: 'Settings', icon: 'bi-gear', href: ROUTES.REGISTRAR_STAFF_SETTINGS, section: 'settings' },
  ],
}

export const FACULTY_SHELL_CONFIG: ShellConfig<FacultySection> = {
  pageClass: 'faculty-shell-page',
  layoutClass: 'faculty-layout',
  sidebarClass: 'faculty-sidebar',
  sidebarAriaLabel: 'Faculty menu',
  sidebarMainClass: 'faculty-sidebar-main',
  sidebarHeadClass: 'faculty-sidebar-head',
  sidebarEyebrowClass: 'faculty-eyebrow',
  sidebarEyebrow: 'Instructor Portal',
  sidebarTitle: 'Faculty',
  sidebarTitleClass: 'faculty-header-link',
  sidebarMenuClass: 'faculty-menu',
  sidebarMenuAriaLabel: 'Faculty navigation',
  sidebarFooterClass: 'faculty-sidebar-footer',
  sidebarFooterValue: 'FACULTY',
  backdropClass: 'faculty-sidebar-backdrop',
  sidebarOpenClass: 'faculty-sidebar-open',
  mobileBodyLockWidth: 991,
  menuToggleSelector: '[data-faculty-sidebar-open]',
  menuToggleClassName: 'faculty-header-menu-toggle',
  menuToggleAriaLabel: 'Open sidebar menu',
  headerBrandHref: ROUTES.HOME,
  headerLogoAlt: 'Golden West Colleges logo',
  menuItems: [
    { label: 'Dashboard', icon: 'bi-speedometer2', href: ROUTES.FACULTY_DASHBOARD, section: 'dashboard' },
    { label: 'Classes', icon: 'bi-calendar3', href: ROUTES.FACULTY_CLASSES, section: 'classes' },
    { label: 'Gradebook', icon: 'bi-file-earmark-text', href: ROUTES.FACULTY_GRADEBOOK, section: 'gradebook' },
    { label: 'Settings', icon: 'bi-gear', href: ROUTES.FACULTY_SETTINGS, section: 'settings' },
  ],
}

export const STUDENT_SHELL_CONFIG: ShellConfig<StudentSection> = {
  pageClass: 'student-shell-page',
  layoutClass: 'student-layout',
  sidebarClass: 'student-sidebar',
  sidebarAriaLabel: 'Student menu',
  sidebarMainClass: 'student-sidebar-main',
  sidebarHeadClass: 'student-sidebar-head',
  sidebarEyebrowClass: 'student-eyebrow',
  sidebarEyebrow: 'Student Portal',
  sidebarTitle: 'Student',
  sidebarTitleClass: 'student-header-link',
  sidebarMenuClass: 'student-menu',
  sidebarMenuAriaLabel: 'Student navigation',
  sidebarFooterClass: 'student-sidebar-footer',
  sidebarFooterValue: 'STUDENT',
  backdropClass: 'student-sidebar-backdrop',
  sidebarOpenClass: 'student-sidebar-open',
  mobileBodyLockWidth: 991,
  menuToggleSelector: '[data-student-sidebar-open]',
  menuToggleClassName: 'student-header-menu-toggle',
  menuToggleAriaLabel: 'Open sidebar menu',
  headerBrandHref: ROUTES.HOME,
  headerLogoAlt: 'Golden West Colleges logo',
  menuItems: [
    { label: 'Dashboard', icon: 'bi-speedometer2', href: ROUTES.STUDENT_DASHBOARD, section: 'dashboard' },
    { label: 'Subjects', icon: 'bi-folder2-open', href: ROUTES.STUDENT_SUBJECTS, section: 'subjects' },
    { label: 'Grades', icon: 'bi-file-earmark-text', href: ROUTES.STUDENT_GRADES, section: 'grades' },
    { label: 'Schedule', icon: 'bi-calendar3', href: ROUTES.STUDENT_SCHEDULE, section: 'schedule' },
    { label: 'Settings', icon: 'bi-gear', href: ROUTES.STUDENT_SETTINGS, section: 'settings' },
  ],
}

function renderSidebar<TSection extends string>(config: ShellConfig<TSection>, section: TSection): string {
  const idAttr = config.sidebarId ? `id="${config.sidebarId}"` : ''

  return `
    <aside class="${config.sidebarClass}" ${idAttr} aria-label="${config.sidebarAriaLabel}">
      <div class="${config.sidebarMainClass}">
        <div class="${config.sidebarHeadClass}">
          <p class="${config.sidebarEyebrowClass}">${config.sidebarEyebrow}</p>
          <h1><a href="${ROUTES.HOME}" class="${config.sidebarTitleClass}">${config.sidebarTitle}</a></h1>
        </div>
        <nav class="${config.sidebarMenuClass}" aria-label="${config.sidebarMenuAriaLabel}">
          <ul>
            ${config.menuItems
              .map((item) => {
                const isActive = item.section === section
                return `
                  <li>
                    <a href="${item.href}" class="${isActive ? 'is-active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
                      <i class="bi ${item.icon}" aria-hidden="true"></i>
                      <span>${item.label}</span>
                    </a>
                  </li>
                `
              })
              .join('')}
          </ul>
        </nav>
      </div>
      <footer class="${config.sidebarFooterClass}">
        <p>Logged in as:</p>
        <strong>${config.sidebarFooterValue}</strong>
      </footer>
    </aside>
  `
}

export function renderPortalShell<TSection extends string>(
  config: ShellConfig<TSection>,
  section: TSection,
  content: string,
): string {
  const headerActions: HeaderAction[] = [
    {
      type: 'button',
      icon: 'bi-list',
      label: 'MENU',
      className: config.menuToggleClassName,
      attrs: config.menuToggleSelector.slice(1, -1),
      ariaLabel: config.menuToggleAriaLabel,
    },
  ]

  return `
    <main class="${config.pageClass}">
      ${renderMainSiteHeader({
        brandHref: config.headerBrandHref,
        logoSrc: gwcLogo,
        logoAlt: config.headerLogoAlt,
        actions: headerActions,
        solid: true,
      })}

      <div class="${config.layoutClass}">
        ${renderSidebar(config, section)}
        ${content}
      </div>
      <button type="button" class="${config.backdropClass}" aria-label="Close menu"></button>
    </main>
  `
}

export function setupPortalShell<TSection extends string>(root: HTMLElement, config: ShellConfig<TSection>): () => void {
  const toggle = root.querySelector<HTMLButtonElement>(config.menuToggleSelector)
  const backdrop = root.querySelector<HTMLButtonElement>(`.${config.backdropClass}`)
  const cleanupPopover = setupSharedPopover(root)
  let bodyLocked = false

  const closeSidebar = (): void => {
    root.classList.remove(config.sidebarOpenClass)
    toggle?.setAttribute('aria-expanded', 'false')
    if (bodyLocked) {
      document.body.classList.remove('overlay-open')
      bodyLocked = false
    }
  }

  const openSidebar = (): void => {
    root.classList.add(config.sidebarOpenClass)
    toggle?.setAttribute('aria-expanded', 'true')
    if (window.innerWidth <= config.mobileBodyLockWidth && !bodyLocked) {
      document.body.classList.add('overlay-open')
      bodyLocked = true
    }
  }

  const onToggle = (): void => {
    if (root.classList.contains(config.sidebarOpenClass)) {
      closeSidebar()
      return
    }
    openSidebar()
  }

  const onResize = (): void => {
    if (window.innerWidth > config.mobileBodyLockWidth) {
      closeSidebar()
    }
  }

  const onEscape = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return
    closeSidebar()
  }

  toggle?.addEventListener('click', onToggle)
  backdrop?.addEventListener('click', closeSidebar)
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('keydown', onEscape)

  return () => {
    closeSidebar()
    cleanupPopover()
    toggle?.removeEventListener('click', onToggle)
    backdrop?.removeEventListener('click', closeSidebar)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('keydown', onEscape)
  }
}


