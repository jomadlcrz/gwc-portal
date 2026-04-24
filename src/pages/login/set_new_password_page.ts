// this is for non admin users who are required to change their password before accessing their account

import '../../styles/login.css'
const gwcLogo = '/images/gwc_logo.avif'
import { renderPortalHeader } from '../../components/layout/header'
import { renderPortalSiteFooter } from '../../components/layout/footer'

export function renderchange_password_page(): string {
  return `
    <main class="login-page">
      ${renderPortalHeader({
        logoSrc: gwcLogo,
        logoAlt: 'Golden West Colleges logo',
        portalTitle: 'ACCOUNT SECURITY',
      })}

      <section class="portal-body">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              <section class="login-card p-4 p-md-4">
                <h2 class="login-heading mb-2">Change Password</h2>
                <p class="login-subheading mb-4">You must change your password before accessing your account.</p>
                <form id="change-password-form">
                  <div class="form-floating mb-3">
                    <input
                      type="password"
                      class="form-control form-control-lg login-input password-input"
                      id="change-password-new"
                      placeholder="New password"
                      required
                    />
                    <label for="change-password-new">New password</label>
                  </div>
                  <div class="form-floating mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg login-input password-input"
                      id="change-password-confirm"
                      placeholder="Confirm new password"
                      required
                    />
                    <label for="change-password-confirm">Confirm new password</label>
                  </div>
                  <button type="submit" class="btn btn-lg w-100 login-submit-btn">Update Password</button>
                </form>
                <p id="change-password-message" class="mt-3 mb-0 small" aria-live="polite"></p>
              </section>
            </div>
          </div>
        </div>
      </section>

      ${renderPortalSiteFooter()}
    </main>
  `
}



