import { renderLoginPage } from './pages/loginPage'
import { renderNotFoundPage } from './pages/notFoundPage'

export function renderRoute(app: HTMLDivElement, pathname: string): void {
  if (pathname === '/student-portal/login') {
    app.innerHTML = renderLoginPage()
    return
  }

  app.innerHTML = renderNotFoundPage()
}
