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
import gwcLogo from '../../assets/gwc_logo\.avif'
import { ROUTES } from '../../app/routes'
import { renderMainsite_header } from '../../components/site_header'
import type { HeaderAction } from '../../components/site_header'

type AdminView = 'dashboard' | 'administrators'

type AdminMenuItem = {
  label: string
  icon: string
  href: string
  activeWhen: AdminView[]
}

const menuItems: AdminMenuItem[] = [
  { label: 'Dashboard', icon: 'layout-dashboard', href: ROUTES.ADMINISTRATORS, activeWhen: ['dashboard'] },
  {
    label: 'Administrators',
    icon: 'file-text',
    href: ROUTES.ADMINISTRATORS_DIRECTORY,
    activeWhen: ['administrators'],
  },
  { label: 'Faculty', icon: 'graduation-cap', href: '#', activeWhen: [] },
  { label: 'Students', icon: 'users', href: '#', activeWhen: [] },
  { label: 'Enrollments', icon: 'file-text', href: '#', activeWhen: [] },
  { label: 'Departments', icon: 'building-2', href: '#', activeWhen: [] },
  { label: 'Reports', icon: 'briefcase', href: '#', activeWhen: [] },
  { label: 'Settings', icon: 'settings', href: '#', activeWhen: [] },
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

function renderActionsPopover(): string {
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
      <div class="admin-actions-menu" data-admin-actions-menu role="menu" aria-label="Administrator row actions">
        <button type="button" role="menuitem">View</button>
        <button type="button" role="menuitem">Edit</button>
        <button type="button" role="menuitem">Deactivate</button>
        <button type="button" role="menuitem" class="is-danger">Delete</button>
      </div>
    </div>
  `
}

function renderSidebar(view: AdminView): string {
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
                const isActive = item.activeWhen.includes(view)
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

function renderDashboardContent(): string {
  return `
    <section class="admin-content">
      <article class="admin-panel">
        <h3>Administration Dashboard</h3>
        <p>Use the sidebar to open management sections. This is the overview page for administrators.</p>
      </article>
    </section>
  `
}

function renderDirectoryContent(): string {
  return `
    <section class="admin-content">
      <article class="admin-directory-shell">
        <header class="admin-directory-head">
          <div>
            <h2>Administrators</h2>
            <p>View and manage school administrators</p>
          </div>
          <label class="admin-directory-search">
            <span class="admin-search-icon" aria-hidden="true"><i data-lucide="search"></i></span>
            <input type="search" placeholder="Search..." aria-label="Search administrators" />
          </label>
        </header>

        <section class="admin-stats-grid" aria-label="Administrator statistics">
          <article class="admin-stat-card">
            <p>Total Administrators</p>
            <strong>12</strong>
          </article>
          <article class="admin-stat-card">
            <p>Active Today</p>
            <strong>10</strong>
          </article>
          <article class="admin-stat-card">
            <p>Departments Managed</p>
            <strong>8</strong>
          </article>
          <article class="admin-stat-card">
            <p>Pending Requests</p>
            <strong class="is-danger">3</strong>
          </article>
        </section>

        <section class="admin-directory-card">
          <header class="admin-directory-card-head">
            <div>
              <h3>Administrator Directory</h3>
              <p>List of current administrators and offices</p>
            </div>
            <button type="button" class="admin-add-btn">+ Add Admin</button>
          </header>

          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Office</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Dr. Maria L. Santos</strong></td>
                  <td>College President</td>
                  <td>Administration Office</td>
                  <td>maria.santos@gwc.edu.ph</td>
                  <td><span class="admin-pill is-active">Active</span></td>
                  <td>${renderActionsPopover()}</td>
                </tr>
                <tr>
                  <td><strong>Prof. John R. Dela Cruz</strong></td>
                  <td>Vice President for Academic Affairs</td>
                  <td>Academic Office</td>
                  <td>john.delacruz@gwc.edu.ph</td>
                  <td><span class="admin-pill is-active">Active</span></td>
                  <td>${renderActionsPopover()}</td>
                </tr>
                <tr>
                  <td><strong>Ms. Angela P. Reyes</strong></td>
                  <td>Registrar</td>
                  <td>Registrar's Office</td>
                  <td>angela.reyes@gwc.edu.ph</td>
                  <td><span class="admin-pill is-active">Active</span></td>
                  <td>${renderActionsPopover()}</td>
                </tr>
                <tr>
                  <td><strong>Mr. Carlo M. Garcia</strong></td>
                  <td>Dean of Student Affairs</td>
                  <td>Student Affairs Office</td>
                  <td>carlo.garcia@gwc.edu.ph</td>
                  <td><span class="admin-pill is-warning">On Leave</span></td>
                  <td>${renderActionsPopover()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </section>
  `
}

function renderAdminPage(view: AdminView): string {
  const content = view === 'administrators' ? renderDirectoryContent() : renderDashboardContent()

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
        ${renderSidebar(view)}
        ${content}
      </div>
      <button type="button" class="admin-sidebar-backdrop" aria-label="Close menu"></button>
    </main>
  `
}

export function renderadministrators_dashboard_page(): string {
  return renderAdminPage('dashboard')
}

export function renderadministrators_directory_page(): string {
  return renderAdminPage('administrators')
}

export function setupadministrators_page(root: HTMLElement): () => void {
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
      if (menu.contains(target)) {
        clickedInside = true
      }
    })
    actionTriggers.forEach((trigger) => {
      if (trigger.contains(target)) {
        clickedInside = true
      }
    })

    if (!clickedInside) {
      closeAllActions()
    }
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
