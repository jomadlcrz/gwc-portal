import gwcLogo from '../../assets/gwc_logo\.avif'
import gwcLogoWhite from '../../assets/gwc_logo_white\.avif'
import { ROUTES } from '../../app/routes'
import { buildMainHeaderActions, renderMainsite_header } from '../../components/site_header'
import { renderMainsite_footer } from '../../components/site_footer'
import { renderHomeOverlays } from '../../components/site_overlay'

const cards = [
  {
    image: 'https://picsum.photos/id/1048/900/500',
    title: 'Enrollment Advisory for New Students',
    date: 'August 14, 2026',
    text: 'Please prepare your original credentials and complete online pre-registration before visiting campus.',
  },
  {
    image: 'https://picsum.photos/id/180/900/500',
    title: 'Scholarship Screening Schedule',
    date: 'August 10, 2026',
    text: 'Qualified applicants may proceed to the Guidance Office for screening and interview schedule confirmation.',
  },
  {
    image: 'https://picsum.photos/id/20/900/500',
    title: 'Faculty Consultation Week',
    date: 'August 05, 2026',
    text: 'Departments are opening consultation sessions to guide students on subject loads and academic pathways.',
  },
]

export function renderannouncements_page(): string {
  return `
    <main class="ann-page">
      ${renderMainsite_header({
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
        searchAriaLabel: 'Search announcements',
      })}

      <section class="ann-title-block">
        <h1>ANNOUNCEMENTS <i class="ann-megaphone-icon" data-lucide="megaphone"></i></h1>
      </section>

      <section class="ann-highlight">
        <p>No Recent Announcement Found</p>
      </section>

      <section class="ann-list-wrap">
        <h2>Other Announcements:</h2>
        <div class="ann-grid">
          ${cards
            .map(
              (card) => `
            <article class="ann-card">
              <img class="ann-card-img-top" src="${card.image}" alt="${card.title}" loading="lazy" />
              <div class="ann-card-body">
                <p class="ann-card-date">${card.date}</p>
                <h3>${card.title}</h3>
                <p>${card.text}</p>
              </div>
              <div class="ann-card-footer">
                <a href="${ROUTES.ANNOUNCEMENTS}" class="ann-card-footer-link">
                  <span>Read More</span>
                  <i data-lucide="arrow-right" aria-hidden="true"></i>
                </a>
              </div>
            </article>
          `,
            )
            .join('')}
        </div>
      </section>

      ${renderMainsite_footer()}
    </main>
  `
}


