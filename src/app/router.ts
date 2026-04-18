import { renderannouncements_page } from '../pages/announcements/announcements_page'
import {
  renderadministrators_dashboard_page,
  renderadministrators_directory_page,
  setupadministrators_page,
} from '../pages/administrators/administrators_page'
import { setupsite_interactions } from '../components/site_interactions'
import { renderhome_page } from '../pages/home/home_page'
import { renderlogin_page } from '../pages/login/login_page'
import { rendernot_found_page } from '../pages/not-found/not_found_page'
import { rendersearch_page } from '../pages/search/search_page'
import { ROUTES } from './routes'

let cleanupCurrentRoute: (() => void) | null = null

export function renderRoute(app: HTMLDivElement, pathname: string): void {
  cleanupCurrentRoute?.()
  cleanupCurrentRoute = null

  if (pathname === ROUTES.HOME) {
    document.title = 'Golden West Colleges, Inc.'
    app.innerHTML = renderhome_page()
    cleanupCurrentRoute = setupsite_interactions(app)
    return
  }

  if (pathname === ROUTES.LOGIN) {
    document.title = 'Student Portal Login | Golden West Colleges, Inc.'
    app.innerHTML = renderlogin_page()
    return
  }

  if (pathname === ROUTES.ANNOUNCEMENTS) {
    document.title = 'Announcements | Golden West Colleges, Inc.'
    app.innerHTML = renderannouncements_page()
    cleanupCurrentRoute = setupsite_interactions(app)
    return
  }

  if (pathname === ROUTES.SEARCH) {
    document.title = 'Search | Golden West Colleges, Inc.'
    app.innerHTML = rendersearch_page()
    cleanupCurrentRoute = setupsite_interactions(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS) {
    document.title = 'Dashboard | Golden West Colleges, Inc.'
    app.innerHTML = renderadministrators_dashboard_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  if (pathname === ROUTES.ADMINISTRATORS_DIRECTORY) {
    document.title = 'Administrators | Golden West Colleges, Inc.'
    app.innerHTML = renderadministrators_directory_page()
    cleanupCurrentRoute = setupadministrators_page(app)
    return
  }

  document.title = 'Page Not Found | Golden West Colleges, Inc.'
  app.innerHTML = rendernot_found_page()
}
