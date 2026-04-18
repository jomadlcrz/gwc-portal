import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/base.css'
import './styles/login.css'
import './styles/not-found.css'
import './styles/home.css'
import './styles/header.css'
import './styles/overlay.css'
import './styles/footer.css'
import './styles/announcements.css'
import './styles/search.css'
import { renderRoute } from './app/router'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App container not found')
}

renderRoute(app, window.location.pathname)
