import '../../styles/sub_header_section.css'

type SectionSubHeaderGrayOptions = {
  eyebrow: string
  title: string
  containerClass?: string
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function renderSectionSubHeaderGray(options: SectionSubHeaderGrayOptions): string {
  const containerClass = options.containerClass ?? 'post-container'

  return `
    <section class="section-sub-header-gray">
      <div class="${containerClass} section-sub-header-gray-inner">
        <p class="section-sub-header-gray-eyebrow">${escapeHtml(options.eyebrow)}</p>
        <h1 class="section-sub-header-gray-title">${escapeHtml(options.title)}</h1>
      </div>
    </section>
  `
}
