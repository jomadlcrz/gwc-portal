type SectionTitleOptions = {
  headingTag?: 'h2' | 'h3' | 'h4'
  titleClass?: string
}

type SubheadingOptions = {
  headingTag?: 'h3' | 'h4' | 'h5'
  className?: string
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function renderAdminSectionTitle(title: string, options: SectionTitleOptions = {}): string {
  const headingTag = options.headingTag ?? 'h3'
  const titleClass = options.titleClass ?? 'admin-section-title'
  return `<${headingTag}><span class="${titleClass}">${escapeHtml(title)}</span></${headingTag}>`
}

export function renderAdminSubheading(title: string, options: SubheadingOptions = {}): string {
  const headingTag = options.headingTag ?? 'h4'
  const className = options.className ?? 'admin-section-subheading'
  return `<${headingTag} class="${className}">${escapeHtml(title)}</${headingTag}>`
}
