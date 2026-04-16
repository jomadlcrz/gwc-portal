import { renderHomePage } from '../pages/home/homePage'
import { setupHomeInteractions } from '../pages/home/homeInteractions'
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
    cleanupCurrentRoute = setupHomeInteractions(app)
    return
  }

  if (pathname === ROUTES.LOGIN) {
    document.title = 'Student Portal Login | Golden West Colleges'
    app.innerHTML = renderLoginPage()
    return
  }

  document.title = 'Page Not Found | Golden West Colleges'
  app.innerHTML = renderNotFoundPage()
}
