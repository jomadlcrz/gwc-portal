import {
  createIcons,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Settings,
  Menu,
  FileText,
  Building2,
  Users,
  Search,
} from 'lucide'
import gwcLogo from '../assets/gwc_logo\.avif'
import { ROUTES } from '../app/routes'
import { renderMainsite_header } from './site_header'
import type { HeaderAction } from './site_header'

export type AdminSection =
  | 'dashboard'
  | 'administrators'
  | 'faculty'
  | 'students'
  | 'enrollments'
  | 'departments'
  | 'reports'
  | 'settings'

type AdminMenuItem = {
  label: string
  icon: string
  href: string
  section: AdminSection
}

const menuItems: AdminMenuItem[] = [
  { label: 'Dashboard', icon: 'layout-dashboard', href: ROUTES.ADMINISTRATORS, section: 'dashboard' },
  {
    label: 'Administrators',
    icon: 'file-text',
    href: ROUTES.ADMINISTRATORS_DIRECTORY,
    section: 'administrators',
  },
  { label: 'Faculty', icon: 'graduation-cap', href: ROUTES.ADMINISTRATORS_FACULTY, section: 'faculty' },
  { label: 'Students', icon: 'users', href: ROUTES.ADMINISTRATORS_STUDENTS, section: 'students' },
  { label: 'Enrollments', icon: 'file-text', href: ROUTES.ADMINISTRATORS_ENROLLMENTS, section: 'enrollments' },
  { label: 'Departments', icon: 'building-2', href: ROUTES.ADMINISTRATORS_DEPARTMENTS, section: 'departments' },
  { label: 'Reports', icon: 'briefcase', href: ROUTES.ADMINISTRATORS_REPORTS, section: 'reports' },
  { label: 'Settings', icon: 'settings', href: ROUTES.ADMINISTRATORS_SETTINGS, section: 'settings' },
]

const adminHeaderActions: HeaderAction[] = [
  {
    type: 'button',
    icon: 'menu',
    label: 'MENU',
    className: 'admin-header-menu-toggle',
    attrs: 'data-admin-sidebar-open',
    ariaLabel: 'Open sidebar menu',
  },
]

function renderSidebar(section: AdminSection): string {
  return `
    <aside class="admin-sidebar" id="admin-sidebar" aria-label="Administrators menu">
      <div class="admin-sidebar-main">
        <div class="admin-sidebar-head">
          <p class="admin-eyebrow">Control Panel</p>
          <h1><a href="${ROUTES.HOME}" class="admin-header-link">Administrators</a></h1>
        </div>
        <nav class="admin-menu" aria-label="Sidebar navigation">
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
      <footer class="admin-sidebar-footer">
        <p>Logged in as:</p>
        <strong>ADMIN</strong>
      </footer>
    </aside>
  `
}

export function renderAdminActionsPopover(): string {
  return `
    <div class="admin-actions-popover">
      <button
        type="button"
        class="admin-actions-trigger"
        data-admin-actions-trigger
        aria-haspopup="menu"
        aria-expanded="false"
      >
        Actions
      </button>
      <div class="admin-actions-menu" data-admin-actions-menu role="menu" aria-label="Table row actions">
        <button type="button" role="menuitem">View</button>
        <button type="button" role="menuitem">Edit</button>
        <button type="button" role="menuitem">Deactivate</button>
        <button type="button" role="menuitem" class="is-danger">Delete</button>
      </div>
    </div>
  `
}

export function renderAdminShell(section: AdminSection, content: string): string {
  return `
    <main class="admin-page">
      ${renderMainsite_header({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        actions: adminHeaderActions,
        solid: true,
      })}

      <div class="admin-layout">
        ${renderSidebar(section)}
        ${content}
      </div>
      <button type="button" class="admin-sidebar-backdrop" aria-label="Close menu"></button>
    </main>
  `
}

export function setupAdminShell(root: HTMLElement): () => void {
  const toggle = root.querySelector<HTMLButtonElement>('[data-admin-sidebar-open]')
  const backdrop = root.querySelector<HTMLButtonElement>('.admin-sidebar-backdrop')
  const actionTriggers = root.querySelectorAll<HTMLButtonElement>('[data-admin-actions-trigger]')
  const actionMenus = root.querySelectorAll<HTMLElement>('[data-admin-actions-menu]')
  let bodyLocked = false

  createIcons({
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
  })

  const closeSidebar = (): void => {
    root.classList.remove('admin-sidebar-open')
    toggle?.setAttribute('aria-expanded', 'false')
    if (bodyLocked) {
      document.body.classList.remove('overlay-open')
      bodyLocked = false
    }
  }

  const openSidebar = (): void => {
    root.classList.add('admin-sidebar-open')
    toggle?.setAttribute('aria-expanded', 'true')
    if (window.innerWidth <= 991 && !bodyLocked) {
      document.body.classList.add('overlay-open')
      bodyLocked = true
    }
  }

  const onToggle = (): void => {
    if (root.classList.contains('admin-sidebar-open')) {
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
    if (event.key === 'Escape') {
      closeSidebar()
      closeAllActions()
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
