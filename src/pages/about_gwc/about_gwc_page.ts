import '../../styles/post.css'
const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
import { ROUTES } from '../../app/routes'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'
import { renderSectionSubHeaderGray } from '../../components/ui/section_sub_header'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderAboutGwcShell(title: string, eyebrow: string, bodyHtml: string): string {
  return `
    <main class="post-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        actions: buildMainHeaderActions(ROUTES.ANNOUNCEMENTS, { showAnnouncementsIcon: false }),
        solid: true,
      })}

      ${renderHomeOverlays({
        logoSrc: gwcLogoWhite,
        logoAlt: 'Golden West Colleges logo',
        shortBrand: 'GWC, INC.',
        searchAriaLabel: 'Search about GWC content',
      })}

      ${renderSectionSubHeaderGray({
        eyebrow,
        title,
      })}

      <section class="post-shell">
        <div class="post-container">
          ${bodyHtml}
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}

export function renderabout_gwc_history_page(): string {
  return renderAboutGwcShell(
    'GWC HISTORY',
    'About GWC',
    `
      <section class="post-body" aria-label="Golden West Colleges history">
        <p>Golden West Colleges, Inc. has grown through a steady focus on accessible learning, responsive student services, and community-centered education.</p>
        <p>The college story reflects the continued development of academic programs, campus support, and institutional partnerships that help students prepare for work, transfer, and long-term growth.</p>
        <p>As the institution expands, the emphasis remains on practical education, student success, and programs that respond to the changing needs of learners and their communities.</p>
      </section>
    `,
  )
}

export function renderabout_gwc_faqs_page(): string {
  const faqs = [
    {
      question: 'What is Golden West Colleges, Inc.?',
      answer:
        'Golden West Colleges, Inc. is an educational institution focused on student support, academic programs, and services that help learners succeed.',
    },
    {
      question: 'Where can I find announcements and updates?',
      answer:
        'Official updates are published in the announcements section and on the main site pages that highlight current news and activities.',
    },
    {
      question: 'How do I get started as a student?',
      answer:
        'Visit the student portal and follow the enrollment, authentication, and scheduling steps that apply to your program and academic level.',
    },
  ]

  return renderAboutGwcShell(
    'FAQs',
    'About GWC',
    `
      <section class="post-body" aria-label="Frequently asked questions">
        <dl>
          ${faqs
            .map(
              (item) => `
            <div style="margin-bottom: 1.25rem;">
              <dt style="font-weight: 700; color: var(--dark-blue); margin-bottom: 0.35rem;">${escapeHtml(item.question)}</dt>
              <dd style="margin: 0; color: var(--color-ink-900); line-height: 1.65; text-align: justify; text-justify: inter-word;">${escapeHtml(item.answer)}</dd>
            </div>
          `,
            )
            .join('')}
        </dl>
      </section>
    `,
  )
}
