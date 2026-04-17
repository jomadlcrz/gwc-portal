import { renderAnnouncementsPage } from '../pages/announcements/announcementsPage'
import { setupSiteInteractions } from '../components/siteInteractions'
import { renderHomePage } from '../pages/home/homePage'
import { renderLoginPage } from '../pages/login/loginPage'
import { renderNotFoundPage } from '../pages/not-found/notFoundPage'
import { ROUTES } from './routes'

let cleanupCurrentRoute: (() => void) | null = null

export function renderRoute(app: HTMLDivElement, pathname: string): void {
  cleanupCurrentRoute?.()
  cleanupCurrentRoute = null

  if (pathname === ROUTES.HOME) {
    document.title = 'Golden West Colleges, Inc.'
    app.innerHTML = renderHomePage()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  if (pathname === ROUTES.LOGIN) {
    document.title = 'Student Portal Login | Golden West Colleges, Inc.'
    app.innerHTML = renderLoginPage()
    return
  }

  if (pathname === ROUTES.ANNOUNCEMENTS) {
    document.title = 'Announcements | Golden West Colleges, Inc.'
    app.innerHTML = renderAnnouncementsPage()
    cleanupCurrentRoute = setupSiteInteractions(app)
    return
  }

  document.title = 'Page Not Found | Golden West Colleges, Inc.'
  app.innerHTML = renderNotFoundPage()
}
