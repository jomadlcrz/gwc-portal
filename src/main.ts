import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/base.css'
import './styles/login.css'
import './styles/not_found.css'
import './styles/home.css'
import './styles/header.css'
import './styles/overlay.css'
import './styles/footer.css'
import './styles/announcements.css'
import './styles/registrar_staff.css'
import './styles/search.css'
import './styles/post.css'
import './styles/administrators/layout.css'
import './styles/administrators/directory.css'
import './styles/administrators/students.css'
import { renderRoute } from './app/router'
import coverImageUrl from './assets/cover\.avif'
import footerLogoUrl from './assets/gwc_logo_white\.avif'
import headerLogoUrl from './assets/gwc_logo\.avif'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App container not found')
}

const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
const isReload = navigationEntry?.type === 'reload'
const isHomePath = window.location.pathname === '/'
const shouldDelayFirstPaint = isReload && isHomePath

if (shouldDelayFirstPaint) {
  document.documentElement.classList.add('route-reload-pending')
}

const addImagePreloadHint = (src: string, fetchPriority: 'high' | 'low' | 'auto' = 'high'): void => {
  const existing = document.head.querySelector<HTMLLinkElement>(`link[rel="preload"][as="image"][href="${src}"]`)
  if (existing) return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  link.fetchPriority = fetchPriority
  document.head.append(link)
}

addImagePreloadHint(headerLogoUrl)
addImagePreloadHint(footerLogoUrl)
addImagePreloadHint(coverImageUrl)

const preloadImage = (src: string, timeoutMs = 1400): Promise<void> =>
  new Promise((resolve) => {
    let done = false
    const finish = (): void => {
      if (done) return
      done = true
      resolve()
    }

    const image = new Image()
    const timeoutId = window.setTimeout(finish, timeoutMs)

    image.onload = () => {
      window.clearTimeout(timeoutId)
      finish()
    }
    image.onerror = () => {
      window.clearTimeout(timeoutId)
      finish()
    }

    image.src = src

    if (typeof image.decode === 'function') {
      void image.decode().then(
        () => {
          window.clearTimeout(timeoutId)
          finish()
        },
        () => {
          window.clearTimeout(timeoutId)
          finish()
        },
      )
    }
  })

renderRoute(app, window.location.pathname)

if (shouldDelayFirstPaint) {
  Promise.allSettled([
    preloadImage(coverImageUrl),
    preloadImage(footerLogoUrl),
    preloadImage(headerLogoUrl),
  ]).finally(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('route-reload-pending')
      })
    })
  })
}

