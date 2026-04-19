import { renderPortalShell } from './_layout'
import type { ShellConfig } from './_layout'

type PlaceholderShellConfig = {
  contentClass: string
  panelClass: string
}

type SectionPlaceholderOptions = {
  breadcrumbHtml?: string
}

export function renderSectionPlaceholderPage<TSection extends string>(
  shellConfig: ShellConfig<TSection>,
  placeholderConfig: PlaceholderShellConfig,
  section: TSection,
  title: string,
  description: string,
  options?: SectionPlaceholderOptions,
): string {
  return renderPortalShell(
    shellConfig,
    section,
    `
      <section class="${placeholderConfig.contentClass}">
        ${options?.breadcrumbHtml ?? ''}
        <article class="${placeholderConfig.panelClass}">
          <h3>${title}</h3>
          <p>${description}</p>
        </article>
      </section>
    `,
  )
}
