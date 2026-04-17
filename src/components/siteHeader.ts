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
}

type PortalHeaderOptions = {
  logoSrc: string
  logoAlt: string
  schoolName?: string
  portalTitle?: string
}

function renderHeaderAction(action: HeaderAction, baseClass: string): string {
  const className = `${baseClass}${action.className ? ` ${action.className}` : ''}`
  const attrs = action.attrs ? ` ${action.attrs}` : ''
  const aria = action.ariaLabel ? ` aria-label="${action.ariaLabel}"` : ''
  const content = `<span class="home-quick-icon" aria-hidden="true"><i data-lucide="${action.icon}"></i></span>${action.label ? `<span class="home-quick-label">${action.label}</span>` : ''}`

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
  return renderSiteHeader({
    brandHref: options.brandHref,
    headerClass: 'home-header',
    innerClass: 'home-header-inner',
    brandClass: 'home-brand text-decoration-none',
    logoSrc: options.logoSrc,
    logoAlt: options.logoAlt,
    logoClass: 'home-brand-logo',
    titleClass: 'home-brand-title',
    titleFullClass: 'home-brand-title-full',
    titleShortClass: 'home-brand-title-short',
    titleFull: 'GOLDEN WEST COLLEGES, INC.',
    titleShort: 'GWC',
    actionsNavClass: 'home-quick-menu',
    actionBaseClass: 'home-quick-item',
    actions: options.actions,
  })
}

export function renderPortalHeader(options: PortalHeaderOptions): string {
  const schoolName = options.schoolName ?? 'GOLDEN WEST COLLEGES, INC.'
  const portalTitle = options.portalTitle ?? 'STUDENT PORTAL'

  return `
    <header class="portal-header">
      <div class="portal-wave"></div>
      <div class="portal-header-inner">
        <img src="${options.logoSrc}" alt="${options.logoAlt}" class="portal-logo" />
        <h1 class="portal-school-name">${schoolName}</h1>
        <p class="portal-title">${portalTitle}</p>
      </div>
      <div class="portal-gold-line"></div>
    </header>
  `
}
