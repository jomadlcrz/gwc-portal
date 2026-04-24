import { ROUTES } from '../../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import { getPostPath, posts } from '../../../data/posts'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderPostsRows(): string {
  return posts
    .map(
      (post) => `
        <tr>
          <td>${escapeHtml(post.title)}</td>
          <td>${escapeHtml(post.category)}</td>
          <td>${escapeHtml(post.date)}</td>
          <td><a href="${getPostPath(post.slug)}" target="_blank" rel="noopener noreferrer">View</a></td>
        </tr>
      `,
    )
    .join('')
}

export function renderposts_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'posts',
    `
      <section class="admin-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Posts', active: true },
        ])}

        <article class="admin-panel admin-posts-panel">
          <header class="admin-posts-panel-head admin-posts-list-head">
            <div>
              <h3>All Posts</h3>
              <p>Manage and review all published posts.</p>
            </div>
            <a class="admin-posts-create-link" href="${ROUTES.ADMINISTRATORS_POSTS_CREATE}">Create Post</a>
          </header>
          <div class="admin-post-table-wrap">
            <table class="admin-post-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>${renderPostsRows()}</tbody>
            </table>
          </div>
        </article>
      </section>
    `,
  )
}
