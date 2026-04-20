const gwcLogo = '/images/gwc_logo.avif'
const gwcLogoWhite = '/images/gwc_logo_white.avif'
const coverImage = '/images/cover.avif'
import { ROUTES } from '../../app/routes'
import { getPostPath, getPostsByCategory, type PostItem } from '../../data/posts'
import { buildMainHeaderActions, renderMainSiteHeader } from '../../components/layout/header'
import { renderMainSiteFooter } from '../../components/layout/footer'
import { renderHomeOverlays } from '../../components/layout/overlay'

function getImage(post: PostItem | undefined, fallback: string): string {
  return post?.image ?? fallback
}

export function renderhome_page(): string {
  const globalPosts = getPostsByCategory('GLOBAL')
  const communityPosts = getPostsByCategory('COMMUNITY')
  const perspectivePosts = getPostsByCategory('PERSPECTIVE')
  const eventPosts = getPostsByCategory('EVENTS')

  const globalFeatured = globalPosts[0]
  const globalMore = globalPosts.slice(1, 3)
  const communityFeatured = communityPosts[0]
  const communityMore = communityPosts.slice(1, 3)
  const perspectiveFeatured = perspectivePosts[0] ?? globalPosts[0]
  const desktopEventSlides =
    eventPosts.length > 2
      ? Array.from({ length: eventPosts.length - 2 }, (_, index) => eventPosts.slice(index, index + 3))
      : [eventPosts]

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
          </div>
        </div>
      </section>

      <section id="global-arena" class="site-post-section site-post-section-light">
        <div class="post-container home-section-inner">
          <h2 class="site-post-section-title" data-aos="fade-up">GWC in the Global Arena</h2>
          <article class="site-story-layout" data-aos="fade-up" data-aos-delay="50">
            <div class="site-story-main" data-aos="fade-right" data-aos-delay="100">
              <article class="site-story-card">
                <img src="${getImage(globalFeatured, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80')}" alt="${globalFeatured?.title ?? 'Featured story'}" class="site-story-image" />
                <div class="site-story-body">
                  <h3>${globalFeatured?.title ?? 'No Featured Story Yet'}</h3>
                  <p>${globalFeatured?.excerpt ?? 'Check back soon for the latest updates from Golden West Colleges.'}</p>
                  ${
                    globalFeatured
                      ? `<a href="${getPostPath(globalFeatured.slug)}" class="site-story-link"><span>Read More</span><span class="site-story-link-icon" aria-hidden="true"><i data-lucide="arrow-right"></i></span></a>`
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
          <h2 class="site-post-section-title" data-aos="fade-up">GWC in the Community</h2>
          <article class="site-story-layout site-story-layout-left-rail" data-aos="fade-up" data-aos-delay="50">
            <aside class="site-story-side site-story-side-on-dark" data-aos="fade-right" data-aos-delay="100">
              <h4>More Stories:</h4>
              ${communityMore
                .map(
                  (post) => `
                <a href="${getPostPath(post.slug)}" class="site-mini-story">
                  <img src="${getImage(post, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=640&q=80')}" alt="${post.title}" />
                  <span>${post.title}</span>
                </a>
              `,
                )
                .join('')}
            </aside>
            <div class="site-story-main" data-aos="fade-left" data-aos-delay="150">
              <article class="site-story-card site-story-card-on-dark">
                <img src="${getImage(communityFeatured, 'https://picsum.photos/seed/gwc-community-extension/1200/720')}" alt="${communityFeatured?.title ?? 'Community story'}" class="site-story-image" />
                <div class="site-story-body">
                  <h3>${communityFeatured?.title ?? 'No Community Story Yet'}</h3>
                  <p>${communityFeatured?.excerpt ?? 'Community engagement stories will be posted here.'}</p>
                  ${
                    communityFeatured
                      ? `<a href="${getPostPath(communityFeatured.slug)}" class="site-story-link"><span>Read More</span><span class="site-story-link-icon" aria-hidden="true"><i data-lucide="arrow-right"></i></span></a>`
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
          <h2 class="site-post-section-title" data-aos="fade-up">Events</h2>
          <div id="eventsCarouselDesktop" class="carousel slide site-events-carousel d-none d-lg-block" data-bs-ride="carousel" data-aos="zoom-in-up" data-aos-delay="80">
            <div class="carousel-indicators">
              ${desktopEventSlides
                .map(
                  (_, index) => `
                <button type="button" data-bs-target="#eventsCarouselDesktop" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" ${index === 0 ? 'aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
              `,
                )
                .join('')}
            </div>
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
                          <img src="${getImage(post, 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1280&q=80')}" class="d-block w-100 site-event-image" alt="${post.title}" />
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
          </div>

          <div id="eventsCarousel" class="carousel slide site-events-carousel d-lg-none" data-bs-ride="carousel" data-aos="zoom-in-up" data-aos-delay="80">
            <div class="carousel-indicators">
              ${eventPosts
                .map(
                  (_, index) => `
                <button type="button" data-bs-target="#eventsCarousel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" ${index === 0 ? 'aria-current="true"' : ''} aria-label="Slide ${index + 1}"></button>
              `,
                )
                .join('')}
            </div>
            <div class="carousel-inner">
              ${eventPosts
                .map(
                  (post, index) => `
                <article class="carousel-item ${index === 0 ? 'active' : ''}">
                  <div class="site-event-card">
                    <a href="${getPostPath(post.slug)}" class="site-event-slide-link">
                      <img src="${getImage(post, 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1280&q=80')}" class="d-block w-100 site-event-image" alt="${post.title}" />
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
            <button class="carousel-control-prev" type="button" data-bs-target="#eventsCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#eventsCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      <section id="perspective" class="site-post-section site-post-section-primary">
        <div class="post-container home-section-inner">
          <h2 class="site-post-section-title" data-aos="fade-up">Perspectives + Opinions</h2>
          <article class="site-story-card site-story-card-dark" data-aos="fade-up" data-aos-delay="80">
            <img src="${getImage(perspectiveFeatured, 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80')}" alt="${perspectiveFeatured?.title ?? 'Perspective story'}" class="site-story-image" />
            <div class="site-story-body">
              <h3>${perspectiveFeatured?.title ?? 'No Perspective Story Yet'}</h3>
              <p>${perspectiveFeatured?.excerpt ?? 'Perspective and opinion updates will appear here.'}</p>
              ${
                perspectiveFeatured
                  ? `<a href="${getPostPath(perspectiveFeatured.slug)}" class="site-story-link site-story-link-dark"><span>Read More</span><span class="site-story-link-icon" aria-hidden="true"><i data-lucide="arrow-right"></i></span></a>`
                  : ''
              }
            </div>
          </article>
        </div>
      </section>

      <section id="careers" class="site-post-section site-post-section-light">
        <div class="post-container home-section-inner">
          <header class="site-careers-head" data-aos="fade-up">
            <h2 class="site-post-section-title">Be Part of Our Team</h2>
            <p class="site-careers-subtitle">Currently no vacant position available</p>
            <p class="site-careers-caption">Available Faculty Positions:</p>
          </header>
          <div class="site-job-list site-job-list-wide">
            <article class="site-job-item" data-aos="fade-up" data-aos-delay="60"><span class="site-job-count">2</span><strong>Instructor I</strong><span>SG 12 - ₱ 22,500.00</span></article>
            <article class="site-job-item" data-aos="fade-up" data-aos-delay="120"><span class="site-job-count">1</span><strong>Instructor II</strong><span>SG 13 - ₱ 24,800.00</span></article>
            <article class="site-job-item" data-aos="fade-up" data-aos-delay="180"><span class="site-job-count">1</span><strong>Instructor III</strong><span>SG 14 - ₱ 27,200.00</span></article>
          </div>
        </div>
      </section>

      ${renderMainSiteFooter()}
    </main>
  `
}








