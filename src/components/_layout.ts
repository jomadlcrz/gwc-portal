import {
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Users,
  createIcons,
} from 'lucide'
import gwcLogo from '../assets/gwc_logo.avif'
import { ROUTES } from '../app/routes'
import { renderMainsite_header } from './site_header'
import type { HeaderAction } from './site_header'

export type AdminSection =
  | 'dashboard'
  | 'administrators'
  | 'faculty'
  | 'students'
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

type ShellMenuItem<TSection extends string> = {
  label: string
  icon: string
  href: string
  section: TSection
}

type IconSet = Exclude<Parameters<typeof createIcons>[0], undefined>['icons']

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
  icons: IconSet
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
    { label: 'Dashboard', icon: 'layout-dashboard', href: ROUTES.ADMINISTRATORS, section: 'dashboard' },
    {
      label: 'Administrators',
      icon: 'file-text',
      href: ROUTES.ADMINISTRATORS_DIRECTORY,
      section: 'administrators',
    },
    { label: 'Faculty', icon: 'graduation-cap', href: ROUTES.ADMINISTRATORS_FACULTY, section: 'faculty' },
    { label: 'Students', icon: 'users', href: ROUTES.ADMINISTRATORS_STUDENTS, section: 'students' },
    { label: 'Departments', icon: 'building-2', href: ROUTES.ADMINISTRATORS_DEPARTMENTS, section: 'departments' },
    { label: 'Reports', icon: 'briefcase', href: ROUTES.ADMINISTRATORS_REPORTS, section: 'reports' },
    { label: 'Settings', icon: 'settings', href: ROUTES.ADMINISTRATORS_SETTINGS, section: 'settings' },
  ],
  icons: {
    Menu,
    Search,
    LayoutDashboard,
    FileText,
    GraduationCap,
    Users,
    Building2,
    Briefcase,
    Settings,
  },
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
  ],
  icons: {
    Menu,
    LayoutDashboard,
    FolderOpen,
    FileText,
    ClipboardList,
    CalendarDays,
    Settings,
  },
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
      icon: 'menu',
      label: 'MENU',
      className: config.menuToggleClassName,
      attrs: config.menuToggleSelector.slice(1, -1),
      ariaLabel: config.menuToggleAriaLabel,
    },
  ]

  return `
    <main class="${config.pageClass}">
      ${renderMainsite_header({
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
  const actionTriggers = root.querySelectorAll<HTMLButtonElement>('[data-admin-actions-trigger]')
  const actionMenus = root.querySelectorAll<HTMLElement>('[data-admin-actions-menu]')
  let bodyLocked = false

  createIcons({ icons: config.icons })

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

  const closeAllActions = (): void => {
    actionTriggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false')
      const wrapper = trigger.closest<HTMLElement>('.admin-actions-popover')
      wrapper?.classList.remove('is-open')
      const menu = wrapper?.querySelector<HTMLElement>('[data-admin-actions-menu]')
      menu?.style.removeProperty('--menu-left')
      menu?.style.removeProperty('--menu-top')
      menu?.classList.remove('is-dropup')
    })
  }

  const onEscape = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return
    closeSidebar()
    closeAllActions()
  }

  const placeActionsMenu = (wrapper: HTMLElement, trigger: HTMLButtonElement): void => {
    const menu = wrapper.querySelector<HTMLElement>('[data-admin-actions-menu]')
    if (!menu) return

    const gap = 6
    const viewportPadding = 8
    const triggerRect = trigger.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()

    let left = triggerRect.right - menuRect.width
    left = Math.max(viewportPadding, Math.min(left, window.innerWidth - menuRect.width - viewportPadding))

    const spaceBelow = window.innerHeight - triggerRect.bottom - viewportPadding
    const shouldDropUp = spaceBelow < menuRect.height + gap
    const top = shouldDropUp ? triggerRect.top - menuRect.height - gap : triggerRect.bottom + gap

    menu.style.setProperty('--menu-left', `${Math.max(viewportPadding, left)}px`)
    menu.style.setProperty('--menu-top', `${Math.max(viewportPadding, top)}px`)
    menu.classList.toggle('is-dropup', shouldDropUp)
  }

  const onActionTriggerClick = (event: Event): void => {
    const trigger = event.currentTarget as HTMLButtonElement
    const wrapper = trigger.closest<HTMLElement>('.admin-actions-popover')
    if (!wrapper) return

    const isOpen = wrapper.classList.contains('is-open')
    closeAllActions()
    if (!isOpen) {
      wrapper.classList.add('is-open')
      trigger.setAttribute('aria-expanded', 'true')
      placeActionsMenu(wrapper, trigger)
    }
  }

  const onDocumentClick = (event: MouseEvent): void => {
    const target = event.target as Node | null
    if (!target) return

    let clickedInside = false
    actionMenus.forEach((menu) => {
      if (menu.contains(target)) clickedInside = true
    })
    actionTriggers.forEach((trigger) => {
      if (trigger.contains(target)) clickedInside = true
    })

    if (!clickedInside) closeAllActions()
  }

  const onViewportChange = (): void => {
    actionTriggers.forEach((trigger) => {
      const wrapper = trigger.closest<HTMLElement>('.admin-actions-popover')
      if (!wrapper?.classList.contains('is-open')) return
      placeActionsMenu(wrapper, trigger)
    })
  }

  toggle?.addEventListener('click', onToggle)
  backdrop?.addEventListener('click', closeSidebar)
  actionTriggers.forEach((trigger) => trigger.addEventListener('click', onActionTriggerClick))
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('resize', onViewportChange, { passive: true })
  root.addEventListener('scroll', onViewportChange, { passive: true, capture: true })
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onEscape)

  return () => {
    closeSidebar()
    closeAllActions()
    toggle?.removeEventListener('click', onToggle)
    backdrop?.removeEventListener('click', closeSidebar)
    actionTriggers.forEach((trigger) => trigger.removeEventListener('click', onActionTriggerClick))
    window.removeEventListener('resize', onResize)
    window.removeEventListener('resize', onViewportChange)
    root.removeEventListener('scroll', onViewportChange, true)
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('keydown', onEscape)
  }
}
