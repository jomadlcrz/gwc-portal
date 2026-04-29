import { ROUTES } from '../../../app/routes'
import { createTestimonial } from '../../../api/testimonials'
import { ADMIN_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'

const TESTIMONIAL_CATEGORIES = ['General', 'Parents', 'Students', 'Alumni', 'Teachers'] as const

export function rendertestimonials_create_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'testimonials',
    `
      <section class="admin-content">
        ${renderBreadcrumbNav([
          { label: 'Testimonials', href: ROUTES.ADMINISTRATOR_TESTIMONIALS },
          { label: 'Add New Testimonial', active: true },
        ])}

        <section class="admin-post-create-layout">
          <article class="admin-panel admin-posts-panel admin-post-create-main">
            <header class="admin-posts-panel-head">
              <h3>Add New Testimonial</h3>
            </header>
            <form id="admin-testimonial-form" class="admin-post-form">
              <label>
                Author Name
                <input type="text" name="name" required maxlength="100" placeholder="Enter author name" />
              </label>
              <label>
                Author Role / Position
                <input type="text" name="role" required maxlength="100" placeholder="E.g. Parent, Student, Teacher, Alumni" />
              </label>
              <div class="admin-post-image-field admin-testimonial-image-field">
                <p class="admin-post-image-label">Author Image</p>
                <label class="admin-post-image-dropzone" for="admin-testimonial-image-file">
                  <input id="admin-testimonial-image-file" type="file" accept="image/*" />
                  <span class="admin-post-image-dropzone-icon" aria-hidden="true"><i class="bi bi-image"></i></span>
                  <span class="admin-post-image-dropzone-line">Upload author photo</span>
                  <span class="admin-post-image-dropzone-or">or</span>
                  <span class="admin-post-image-dropzone-btn">Choose image</span>
                  <span id="admin-testimonial-image-name" class="admin-post-image-name">No image selected</span>
                </label>
                <input type="hidden" name="image" id="admin-testimonial-image-data" />
              </div>
              <label>
                Testimonial Content
                <textarea name="message" rows="10" required placeholder="Write testimonial content here..."></textarea>
              </label>
              <label>
                Link (Optional)
                <input type="url" name="link" placeholder="E.g. Link to video or profile" />
              </label>
            </form>
          </article>

          <aside class="admin-post-create-side">
            <article class="admin-panel admin-posts-panel admin-post-publish-card">
              <header class="admin-posts-panel-head">
                <h3>Publish</h3>
              </header>
              <div class="admin-post-publish-actions">
                <button type="button" class="admin-post-btn admin-post-btn-muted">Save Draft</button>
                <button type="submit" form="admin-testimonial-form" class="admin-post-btn admin-post-btn-primary">Publish</button>
              </div>
              <dl class="admin-post-meta-list">
                <div><dt>Status</dt><dd>Draft</dd></div>
                <div><dt>Visibility</dt><dd>Public</dd></div>
              </dl>
              <button type="button" id="admin-testimonial-preview-btn" class="admin-post-preview-btn">
                <i class="bi bi-eye" aria-hidden="true"></i>
                <span>Preview Testimonial</span>
              </button>
              <p id="admin-testimonial-feedback" class="admin-post-feedback" aria-live="polite"></p>
            </article>

            <article class="admin-panel admin-posts-panel admin-post-side-card">
              <header class="admin-posts-panel-head">
                <h3>Categories</h3>
              </header>
              <div class="admin-post-side-tabs">
                <button type="button" class="is-active">All Categories</button>
                <button type="button">Most Used</button>
              </div>
              <input type="text" class="admin-post-side-search" placeholder="Search categories..." />
              <div class="admin-post-category-list">
                ${TESTIMONIAL_CATEGORIES.map(
                  (category, index) => `
                    <label>
                      <input type="checkbox" name="testimonial-category-choice" value="${category}" ${index === 0 ? 'checked' : ''} />
                      <span>${category}</span>
                    </label>
                  `,
                ).join('')}
              </div>
              <input type="hidden" name="category" id="admin-testimonial-category-value" value="${TESTIMONIAL_CATEGORIES[0]}" form="admin-testimonial-form" />
            </article>

            <article class="admin-panel admin-posts-panel admin-post-side-card">
              <header class="admin-posts-panel-head">
                <h3>Featured</h3>
              </header>
              <label class="form-check form-switch admin-testimonial-featured-switch">
                <input class="form-check-input" type="checkbox" id="admin-testimonial-featured" />
                <span class="form-check-label">Mark this testimonial as featured</span>
              </label>
              <input type="hidden" name="featured" id="admin-testimonial-featured-value" value="false" form="admin-testimonial-form" />
            </article>
          </aside>
        </section>
      </section>
    `,
  )
}

export function setuptestimonials_create_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, ADMIN_SHELL_CONFIG)
  const form = root.querySelector<HTMLFormElement>('#admin-testimonial-form')
  const feedback = root.querySelector<HTMLParagraphElement>('#admin-testimonial-feedback')
  const imageInput = root.querySelector<HTMLInputElement>('#admin-testimonial-image-file')
  const imageDataInput = root.querySelector<HTMLInputElement>('#admin-testimonial-image-data')
  const imageName = root.querySelector<HTMLElement>('#admin-testimonial-image-name')
  const imageDropzone = root.querySelector<HTMLElement>('.admin-post-image-dropzone')
  const previewButton = root.querySelector<HTMLButtonElement>('#admin-testimonial-preview-btn')
  const categoryChecks = Array.from(
    root.querySelectorAll<HTMLInputElement>('input[name="testimonial-category-choice"]'),
  )
  const categoryValue = root.querySelector<HTMLInputElement>('#admin-testimonial-category-value')
  const featuredToggle = root.querySelector<HTMLInputElement>('#admin-testimonial-featured')
  const featuredValue = root.querySelector<HTMLInputElement>('#admin-testimonial-featured-value')

  const applySelectedFile = (file: File): void => {
    if (!imageDataInput || !imageName) return
    if (!file.type.startsWith('image/')) {
      imageName.textContent = 'Invalid file type. Please choose an image.'
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      imageDataInput.value = typeof reader.result === 'string' ? reader.result : ''
      imageName.textContent = file.name
    }
    reader.onerror = () => {
      imageName.textContent = 'Failed to load image.'
      imageDataInput.value = ''
    }
    reader.readAsDataURL(file)
  }

  const onImageChange = (): void => {
    const file = imageInput?.files?.[0]
    if (!file) return
    applySelectedFile(file)
  }

  const onDragOver = (event: DragEvent): void => {
    event.preventDefault()
    imageDropzone?.classList.add('is-dragover')
  }

  const onDragLeave = (): void => {
    imageDropzone?.classList.remove('is-dragover')
  }

  const onDrop = (event: DragEvent): void => {
    event.preventDefault()
    imageDropzone?.classList.remove('is-dragover')
    const file = event.dataTransfer?.files?.[0]
    if (!file) return
    applySelectedFile(file)
  }

  const onCategoryChange = (event: Event): void => {
    const target = event.currentTarget as HTMLInputElement
    if (!target.checked) {
      target.checked = true
      return
    }

    categoryChecks.forEach((check) => {
      if (check !== target) check.checked = false
    })

    if (categoryValue) categoryValue.value = target.value
  }

  const onFeaturedChange = (): void => {
    if (!featuredValue || !featuredToggle) return
    featuredValue.value = String(Boolean(featuredToggle.checked))
  }

  const buildPreviewHtml = (payload: { name: string; role: string; message: string; image: string }): string => {
    const safe = (value: string): string =>
      value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')

    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Preview - ${safe(payload.name || 'Testimonial')}</title>
<style>body{font-family:Arial,sans-serif;background:#f4f7fb;margin:0;color:#1e293b}main{max-width:820px;margin:2rem auto;padding:1rem}article{background:#fff;border:1px solid #d9e2ef;border-radius:10px;padding:1rem}.person{display:flex;gap:.9rem;align-items:center}.avatar{width:72px;height:72px;border-radius:999px;object-fit:cover;border:1px solid #d9e2ef}h1{margin:0;font-size:1.2rem}p{line-height:1.65}.role{color:#64748b;margin:.2rem 0 0}</style>
</head><body><main><article><div class="person">${payload.image ? `<img class="avatar" src="${safe(payload.image)}" alt="${safe(payload.name)}"/>` : ''}<div><h1>${safe(payload.name || 'Anonymous')}</h1><p class="role">${safe(payload.role || 'Role')}</p></div></div><p>${safe(payload.message || '').replaceAll('\n', '<br/>')}</p></article></main></body></html>`
  }

  const onPreview = (): void => {
    if (!form) return
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      role: String(formData.get('role') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
      image: String(formData.get('image') ?? '').trim(),
      category: String(formData.get('category') ?? '').trim(),
      featured: String(formData.get('featured') ?? 'false') === 'true',
    }

    const win = window.open('', '_blank', 'noopener,noreferrer')
    if (!win) return
    win.document.open()
    win.document.write(buildPreviewHtml(payload))
    win.document.close()
  }

  const onSubmit = (event: SubmitEvent): void => {
    event.preventDefault()
    if (!form || !feedback) return

    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      role: String(formData.get('role') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
      image: String(formData.get('image') ?? '').trim(),
    }

    if (!payload.name || !payload.role || !payload.message || !payload.image) {
      feedback.textContent = 'Please fill in all required fields.'
      feedback.classList.add('is-error')
      return
    }

    createTestimonial(payload)
    feedback.innerHTML = `Testimonial published. <a href="${ROUTES.ADMINISTRATOR_TESTIMONIALS}">Back to Testimonials</a>`
    feedback.classList.remove('is-error')
    form.reset()
    if (imageDataInput) imageDataInput.value = ''
    if (imageName) imageName.textContent = 'No image selected'
  }

  imageInput?.addEventListener('change', onImageChange)
  imageDropzone?.addEventListener('dragover', onDragOver)
  imageDropzone?.addEventListener('dragleave', onDragLeave)
  imageDropzone?.addEventListener('drop', onDrop)
  categoryChecks.forEach((check) => check.addEventListener('change', onCategoryChange))
  featuredToggle?.addEventListener('change', onFeaturedChange)
  previewButton?.addEventListener('click', onPreview)
  form?.addEventListener('submit', onSubmit)

  return () => {
    cleanupShell()
    imageInput?.removeEventListener('change', onImageChange)
    imageDropzone?.removeEventListener('dragover', onDragOver)
    imageDropzone?.removeEventListener('dragleave', onDragLeave)
    imageDropzone?.removeEventListener('drop', onDrop)
    categoryChecks.forEach((check) => check.removeEventListener('change', onCategoryChange))
    featuredToggle?.removeEventListener('change', onFeaturedChange)
    previewButton?.removeEventListener('click', onPreview)
    form?.removeEventListener('submit', onSubmit)
  }
}

