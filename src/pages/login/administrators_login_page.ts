import gwcLogo from '../../assets/gwc_logo_laurel\.avif'
import { renderPortalHeader } from '../../components/site_header'
import { renderPortalsite_footer } from '../../components/site_footer'

export function renderadministrators_login_page(): string {
  return `
    <main class="login-page admin-login-page">
      ${renderPortalHeader({
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        portalTitle: 'ADMINISTRATOR PORTAL',
      })}

      <section class="portal-body">
        <div class="container">
          <div class="row justify-content-center justify-content-lg-end">
            <div class="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
              <section class="login-card p-4 p-md-4">
                  <h2 class="login-heading mb-2">Administrator Login</h2>
                  <p class="login-subheading mb-4">Sign in with your administrator account</p>
                  <form>
                    <div class="form-floating mb-3">
                      <input type="email" class="form-control form-control-lg login-input" id="admin-email" placeholder="Email address" required />
                      <label for="admin-email">Email address</label>
                    </div>
                    <div class="form-floating mb-4">
                      <input type="password" class="form-control form-control-lg login-input password-input" id="admin-password" placeholder="Password" required />
                      <label for="admin-password">Password</label>
                    </div>
                    <button type="submit" class="btn btn-lg w-100 login-submit-btn">Log in</button>
                  </form>
              </section>
            </div>
          </div>
        </div>
      </section>

      ${renderPortalsite_footer()}
    </main>
  `
}
