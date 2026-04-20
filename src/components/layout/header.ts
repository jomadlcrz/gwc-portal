import { ROUTES } from '../../app/routes'

export type HeaderAction = {
  icon: string
  label?: string
  ariaLabel?: string
  className?: string
  attrs?: string
} & ({ type: 'link'; href: string } | { type: 'button' })

type SiteHeaderOptions = {
  brandHref: string
  headerClass: string
  innerClass?: string
  brandClass: string
  logoSrc: string
  logoAlt: string
  logoClass: string
  titleClass: string
  titleFullClass: string
  titleShortClass: string
  titleFull: string
  titleShort?: string
  actionsNavClass: string
  actionBaseClass: string
  actions: HeaderAction[]
}

type MainSiteHeaderOptions = {
  brandHref: string
  logoSrc: string
  logoAlt: string
  actions: HeaderAction[]
  solid?: boolean
}

type PortalHeaderOptions = {
  logoSrc: string
  logoAlt: string
  logoHref?: string
  schoolName?: string
  portalTitle?: string
}

function renderHeaderAction(action: HeaderAction, baseClass: string): string {
  const className = `${baseClass}${action.className ? ` ${action.className}` : ''}`
  const attrs = action.attrs ? ` ${action.attrs}` : ''
  const aria = action.ariaLabel ? ` aria-label="${action.ariaLabel}"` : ''
  const content = `<span class="site-quick-icon" aria-hidden="true"><i data-lucide="${action.icon}"></i></span>${action.label ? `<span class="site-quick-label">${action.label}</span>` : ''}`

  if (action.type === 'link') {
    return `<a href="${action.href}" class="${className}"${aria}${attrs}>${content}</a>`
  }

  return `<button type="button" class="${className}"${aria}${attrs}>${content}</button>`
}

export function renderSiteHeader(options: SiteHeaderOptions): string {
  const innerClass = options.innerClass ? ` class="${options.innerClass}"` : ''
  return `
    <header class="${options.headerClass}">
      <div${innerClass}>
        <a href="${options.brandHref}" class="${options.brandClass}">
          <img src="${options.logoSrc}" alt="${options.logoAlt}" class="${options.logoClass}" />
          <span class="${options.titleClass} ${options.titleFullClass}">${options.titleFull}</span>
          ${options.titleShort ? `<span class="${options.titleClass} ${options.titleShortClass}">${options.titleShort}</span>` : ''}
        </a>
        <nav class="${options.actionsNavClass}" aria-label="Quick links">
          ${options.actions.map((action) => renderHeaderAction(action, options.actionBaseClass)).join('')}
        </nav>
      </div>
    </header>
  `
}

export function renderMainSiteHeader(options: MainSiteHeaderOptions): string {
  const headerClass = options.solid ? 'site-header site-header-solid' : 'site-header'

  return renderSiteHeader({
    brandHref: options.brandHref,
    headerClass,
    innerClass: 'site-header-inner',
    brandClass: 'site-brand text-decoration-none',
    logoSrc: options.logoSrc,
    logoAlt: options.logoAlt,
    logoClass: 'site-brand-logo',
    titleClass: 'site-brand-title',
    titleFullClass: 'site-brand-title-full',
    titleShortClass: 'site-brand-title-short',
    titleFull: 'GOLDEN WEST COLLEGES, INC.',
    titleShort: 'GWC, INC.',
    actionsNavClass: 'site-quick-menu',
    actionBaseClass: 'site-quick-item',
    actions: options.actions,
  })
}

type MainHeaderActionsOptions = {
  showAnnouncementsIcon?: boolean
}

export function buildMainHeaderActions(
  announcementsHref: string,
  options: MainHeaderActionsOptions = {},
): HeaderAction[] {
  const actions: HeaderAction[] = []

  if (options.showAnnouncementsIcon ?? true) {
    actions.push({
      type: 'link',
      href: announcementsHref,
      icon: 'megaphone',
      ariaLabel: 'Announcement',
      className: 'site-quick-item-icon-only',
    })
  }

  actions.push(
    { type: 'button', icon: 'search', label: 'SEARCH', attrs: 'data-overlay-open="search"' },
    { type: 'button', icon: 'menu', label: 'MENU', attrs: 'data-overlay-open="menu"' },
  )

  return actions
}

export function renderPortalHeader(options: PortalHeaderOptions): string {
  const logoHref = options.logoHref ?? ROUTES.HOME
  const schoolName = options.schoolName ?? 'GOLDEN WEST COLLEGES, INC.'
  const portalTitle = options.portalTitle ?? 'STUDENT PORTAL'

  return `
    <header class="portal-header">
      <div class="portal-wave"></div>
      <div class="portal-header-inner">
        <a href="${logoHref}" aria-label="Go to home page">
          <img src="${options.logoSrc}" alt="${options.logoAlt}" class="portal-logo" />
        </a>
        <h1 class="portal-school-name">${schoolName}</h1>
        <p class="portal-title">${portalTitle}</p>
      </div>
      <div class="portal-gold-line"></div>
    </header>
  `
}


