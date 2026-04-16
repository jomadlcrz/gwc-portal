import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import { renderRoute } from './router'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App container not found')
}

renderRoute(app, window.location.pathname)
