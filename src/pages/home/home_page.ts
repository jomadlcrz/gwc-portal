import '../../styles/home.css'
import '../../styles/post.css'
const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
const coverImage = '/images/cover.avif'
import { ROUTES } from '../../app/routes'
import { getPostPath, getPostsByCategory, type PostItem } from '../../data/posts'
import { testimonials } from '../../data/testimonials'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

function getImage(post: PostItem | undefined, fallback: string): string {
  return post?.image ?? fallback
}

export function renderhome_page(): string {
  const globalPosts = getPostsByCategory('GLOBAL')
  const communityPosts = getPostsByCategory('COMMUNITY')
  const eventPosts = getPostsByCategory('EVENTS')

  const globalFeatured = globalPosts[0]
  const globalMore = globalPosts.slice(1, 3)
  const communityFeatured = communityPosts[0]
  const communityMore = communityPosts.slice(1, 3)
  const testimonialSlides = testimonials.slice(0, 3)
  const desktopEventSlides =
    eventPosts.length > 2
      ? Array.from({ length: eventPosts.length - 2 }, (_, index) => eventPosts.slice(index, index + 3))
      : [eventPosts]
  const mobileEventSlides = eventPosts.slice(0, 5)

  return `
    <main id="main" class="site-page site-post-page">
      ${renderMainSiteHeader({
        brandHref: ROUTES.HOME,
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        actions: buildMainHeaderActions(ROUTES.ANNOUNCEMENTS),
      })}

      ${renderHomeOverlays({
        logoSrc: gwcLogoWhite,
        logoAlt: 'Golden West Colleges logo',
        shortBrand: 'GWC, INC.',
        searchAriaLabel: 'Search site',
      })}

      <section class="site-cover site-post-cover" style="--site-cover-image: url('${coverImage}');" aria-label="Campus cover image">
        <div class="site-cover-overlay" data-aos="fade-up" data-aos-duration="700">
          <div class="post-container">
            <p class="site-post-eyebrow">Official GWC Updates</p>
            <h1 class="site-post-title">Golden West Colleges, Inc. in Action</h1>
            <a href="${ROUTES.ADMISSION}" class="site-hero-enroll-link">Enroll Now</a>
          </div>
        </div>
      </section>

      <section id="global-arena" class="site-post-section site-post-section-light">
        <div class="post-container home-section-inner">
          <h1 class="site-post-section-title" data-aos="fade-up">GWC in the Global Arena</h1>
          <article class="site-story-layout" data-aos="fade-up" data-aos-delay="50">
            <div class="site-story-main">
              <article class="site-story-card" data-aos="fade-up" data-aos-delay="100">
                <img src="${getImage(globalFeatured, 'https://picsum.photos/id/180/1200/720.jpg')}" alt="${globalFeatured?.title ?? 'Featured story'}" class="site-story-image" />
                <div class="site-story-body">
                  <h2>${globalFeatured?.title ?? 'No Featured Story Yet'}</h2>
                  <p>${globalFeatured?.excerpt ?? 'Check back soon for the latest updates from Golden West Colleges.'}</p>
                  ${
                    globalFeatured
                      ? `<a href="${getPostPath(globalFeatured.slug)}" class="site-story-link"><span>Read More</span><span class="site-story-link-icon" aria-hidden="true"><i class="bi bi-arrow-right"></i></span></a>`
                      : ''
                  }
                </div>
              </article>
            </div>
            <aside class="site-story-side" data-aos="fade-left" data-aos-delay="150">
              <h4>More Stories:</h4>
              ${globalMore
                .map(
                  (post) => `
                <a href="${getPostPath(post.slug)}" class="site-mini-story">
                  <img src="${getImage(post, 'https://picsum.photos/seed/gwc-campus-event/320/320')}" alt="${post.title}" />
                  <span>${post.title}</span>
                </a>
              `,
                )
                .join('')}
            </aside>
          </article>
        </div>
      </section>

      <section id="community" class="site-post-section site-post-section-dark">
        <div class="post-container home-section-inner">
          <h1 class="site-post-section-title" data-aos="fade-up">GWC in the Community</h1>
          <article class="site-story-layout site-story-layout-left-rail" data-aos="fade-up" data-aos-delay="50">
            <aside class="site-story-side site-story-side-on-dark" data-aos="fade-right" data-aos-delay="100">
              <h4>More Stories:</h4>
              ${communityMore
                .map(
                  (post) => `
                <a href="${getPostPath(post.slug)}" class="site-mini-story">
                  <img src="${getImage(post, 'https://picsum.photos/id/24/640/640.jpg')}" alt="${post.title}" />
                  <span>${post.title}</span>
                </a>
              `,
                )
                .join('')}
            </aside>
            <div class="site-story-main">
              <article class="site-story-card site-story-card-on-dark" data-aos="fade-up" data-aos-delay="150">
                <img src="${getImage(communityFeatured, 'https://picsum.photos/seed/gwc-community-extension/1200/720')}" alt="${communityFeatured?.title ?? 'Community story'}" class="site-story-image" />
                <div class="site-story-body">
                  <h2>${communityFeatured?.title ?? 'No Community Story Yet'}</h2>
                  <p>${communityFeatured?.excerpt ?? 'Community engagement stories will be posted here.'}</p>
                  ${
                    communityFeatured
                      ? `<a href="${getPostPath(communityFeatured.slug)}" class="site-story-link"><span>Read More</span><span class="site-story-link-icon" aria-hidden="true"><i class="bi bi-arrow-right"></i></span></a>`
                      : ''
                  }
                </div>
              </article>
            </div>
          </article>
        </div>
      </section>

      <section id="events" class="site-post-section site-post-section-light">
        <div class="post-container home-section-inner">
          <h1 class="site-post-section-title" data-aos="fade-up">Events</h1>
          <div id="eventsCarouselDesktop" class="carousel slide site-events-carousel d-none d-lg-block" data-bs-ride="carousel" data-aos="zoom-in-up" data-aos-delay="80">
            <div class="carousel-inner">
              ${desktopEventSlides
                .map(
                  (slidePosts, index) => `
                <article class="carousel-item ${index === 0 ? 'active' : ''}">
                  <div class="site-events-grid">
                    ${slidePosts
                      .map(
                        (post) => `
                      <article class="site-event-card">
                        <a href="${getPostPath(post.slug)}" class="site-event-slide-link">
                          <img src="${getImage(post, 'https://picsum.photos/id/6/1280/720.jpg')}" class="d-block w-100 site-event-image" alt="${post.title}" />
                        </a>
                        <div class="site-event-content">
                          <p class="site-event-date">${post.date}</p>
                          <h3><a href="${getPostPath(post.slug)}">${post.title}</a></h3>
                        </div>
                      </article>
                    `,
                      )
                      .join('')}
                  </div>
                </article>
              `,
                )
                .join('')}
            </div>
            <div class="site-events-controls">
              <div class="carousel-indicators site-events-indicators">
                ${desktopEventSlides
                  .map(
                    (_, index) => `
                  <button type="button" data-bs-target="#eventsCarouselDesktop" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" ${index === 0 ? 'aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
                `,
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <div id="eventsCarousel" class="carousel slide site-events-carousel d-lg-none" data-bs-ride="carousel" data-aos="zoom-in-up" data-aos-delay="80">
            <div class="carousel-inner">
              ${mobileEventSlides
                .map(
                  (post, index) => `
                <article class="carousel-item ${index === 0 ? 'active' : ''}">
                  <div class="site-event-card">
                    <a href="${getPostPath(post.slug)}" class="site-event-slide-link">
                      <img src="${getImage(post, 'https://picsum.photos/id/6/1280/720.jpg')}" class="d-block w-100 site-event-image" alt="${post.title}" />
                    </a>
                    <div class="site-event-content">
                      <p class="site-event-date">${post.date}</p>
                      <h3><a href="${getPostPath(post.slug)}">${post.title}</a></h3>
                    </div>
                  </div>
                </article>
              `,
                )
                .join('')}
            </div>
            <div class="site-events-controls">
              <div class="carousel-indicators site-events-indicators">
                ${mobileEventSlides
                  .map(
                    (_, index) => `
                  <button type="button" data-bs-target="#eventsCarousel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" ${index === 0 ? 'aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
                `,
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" class="site-post-section site-post-section-primary">
        <div class="post-container home-section-inner">
          <h1 class="site-post-section-title" data-aos="fade-up">Testimonials and Success Stories</h1>
          <div class="site-testimonial-shell" data-aos="fade-up" data-aos-delay="80">
            <div id="testimonialCarousel" class="carousel slide site-testimonial-carousel" data-bs-ride="carousel">
              <div class="carousel-inner">
                ${testimonialSlides
                  .map(
                    (item, index) => `
                  <article class="carousel-item ${index === 0 ? 'active' : ''}">
                    <section class="site-testimonial-panel">
                      <aside class="site-testimonial-person">
                        <img src="${item.image}" alt="${item.name}" class="site-testimonial-avatar" />
                        <p class="site-testimonial-name">${item.name}</p>
                        <p class="site-testimonial-role">${item.role}</p>
                      </aside>
                      <div class="site-testimonial-quote">
                        <p class="site-testimonial-quote-mark" aria-hidden="true">&ldquo;</p>
                        <p>${item.message}</p>
                        <p class="site-testimonial-quote-mark site-testimonial-quote-mark-end" aria-hidden="true">&rdquo;</p>
                      </div>
                    </section>
                  </article>
                `,
                  )
                  .join('')}
              </div>
              <div class="site-testimonial-controls">
              </div>
            </div>
          </div>
        </div>
      </section>
      ${renderMainSiteFooter()}
    </main>
  `
}


