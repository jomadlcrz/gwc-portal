import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './styles/base.css'
import { AOS_OPTIONS, createAosRunner, syncAosAfterLoad } from './app/aos'
import { renderRoute } from './app/router'
const coverImageUrl = '/images/cover.avif'
const footerLogoUrl = '/images/gwc_logo_white.avif'
const headerLogoUrl = '/images/gwc_logo.avif'
const loaderGearImageUrl = '/images/gwc_logo_gear.avif'

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

const mountGlobalLoader = (): HTMLDivElement => {
  const existing = document.querySelector<HTMLDivElement>('#loading')
  if (existing) return existing

  const loader = document.createElement('div')
  loader.id = 'loading'
  loader.setAttribute('aria-label', 'Loading')
  loader.setAttribute('role', 'status')
  loader.innerHTML = `
    <img id="loading-animating-image" src="${loaderGearImageUrl}" alt="" aria-hidden="true" />
    <img id="loading-image" src="${headerLogoUrl}" alt="Golden West Colleges logo" />
  `
  document.body.append(loader)
  return loader
}

const hideGlobalLoader = (loader: HTMLDivElement): void => {
  loader.classList.add('is-hidden')
  window.setTimeout(() => {
    loader.remove()
  }, 260)
}

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

const globalLoader = mountGlobalLoader()
const runAos = createAosRunner(AOS, AOS_OPTIONS)

renderRoute(app, window.location.pathname)

const waitForWindowLoad = (): Promise<void> =>
  new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve()
      return
    }
    window.addEventListener('load', () => resolve(), { once: true })
  })

const waitForFontsReady = (): Promise<void> => {
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
  if (!fonts) return Promise.resolve()
  return fonts.ready.then(() => undefined, () => undefined)
}

const collectRouteImageSources = (): string[] => {
  const sources = new Set<string>()
  app.querySelectorAll<HTMLImageElement>('img[src]').forEach((image) => {
    const src = image.getAttribute('src')?.trim()
    if (!src) return
    sources.add(src)
  })
  return Array.from(sources)
}

const preloadTargets = Array.from(
  new Set([
    coverImageUrl,
    footerLogoUrl,
    headerLogoUrl,
    loaderGearImageUrl,
    ...collectRouteImageSources(),
  ]),
)

Promise.allSettled([waitForWindowLoad(), waitForFontsReady(), ...preloadTargets.map((src) => preloadImage(src, 5000))]).finally(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      syncAosAfterLoad(app, runAos)
      if (shouldDelayFirstPaint) {
        document.documentElement.classList.remove('route-reload-pending')
      }
      hideGlobalLoader(globalLoader)
    })
  })
})



