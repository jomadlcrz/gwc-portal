import { ROUTES } from '../../../app/routes'
import { ADMIN_SHELL_CONFIG, renderPortalShell, setupPortalShell } from '../../../components/layout/_layout'
import { renderAdminBreadcrumbNav } from '../../../components/ui/nav_breadcrumb'
import type { PostCategory } from '../../../data/posts'
import { createPost } from '../../../api/posts'

const CATEGORY_OPTIONS: PostCategory[] = ['ANNOUNCEMENT', 'GLOBAL', 'COMMUNITY', 'EVENTS']
const getTodayDateLabel = (): string =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

export function renderposts_create_page(): string {
  return renderPortalShell(
    ADMIN_SHELL_CONFIG,
    'posts',
    `
      <section class="admin-content">
        ${renderAdminBreadcrumbNav([
          { label: 'Posts', href: ROUTES.ADMINISTRATOR_POSTS },
          { label: 'Create Post', active: true },
        ])}

        <section class="admin-post-create-layout">
          <article class="admin-panel admin-posts-panel admin-post-create-main">
            <header class="admin-posts-panel-head">
              <h3>Create Post</h3>
            </header>
            <form id="admin-post-create-form" class="admin-post-form">
              <label>
                Title
                <input type="text" name="title" required maxlength="150" placeholder="Enter post title..." />
              </label>
              <label>
                Excerpt
                <textarea name="excerpt" rows="3" required placeholder="Write a short excerpt..."></textarea>
              </label>
              <label>
                Content
                <textarea name="content" rows="10" required placeholder="Write your content here..."></textarea>
              </label>
              <div class="admin-post-image-field">
                <p class="admin-post-image-label">Featured Image</p>
                <label class="admin-post-image-dropzone" for="admin-post-image-file">
                  <input id="admin-post-image-file" type="file" accept="image/*" />
                  <span class="admin-post-image-dropzone-icon" aria-hidden="true"><i class="bi bi-image"></i></span>
                  <span class="admin-post-image-dropzone-line">Drag &amp; drop an image here</span>
                  <span class="admin-post-image-dropzone-or">or</span>
                  <span class="admin-post-image-dropzone-btn">Choose image</span>
                  <span id="admin-post-image-name" class="admin-post-image-name">No image selected</span>
                </label>
                <input type="hidden" name="image" id="admin-post-image-data" />
              </div>
            </form>
          </article>

          <aside class="admin-post-create-side">
            <article class="admin-panel admin-posts-panel admin-post-publish-card">
              <header class="admin-posts-panel-head">
                <h3>Publish</h3>
              </header>
              <div class="admin-post-publish-actions">
                <button type="button" class="admin-post-btn admin-post-btn-muted">Save Draft</button>
                <button type="submit" form="admin-post-create-form" class="admin-post-btn admin-post-btn-primary">Publish</button>
              </div>
              <dl class="admin-post-meta-list">
                <div><dt>Status</dt><dd>Draft</dd></div>
                <div><dt>Visibility</dt><dd>Public</dd></div>
              </dl>
              <button type="button" id="admin-post-preview-btn" class="admin-post-preview-btn">
                <i class="bi bi-eye" aria-hidden="true"></i>
                <span>Preview Post</span>
              </button>
              <p id="admin-post-create-feedback" class="admin-post-feedback" aria-live="polite"></p>
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
                ${CATEGORY_OPTIONS.map(
                  (category, index) => `
                    <label>
                      <input type="checkbox" name="category-choice" value="${category}" ${index === 0 ? 'checked' : ''} />
                      <span>${category}</span>
                    </label>
                  `,
                ).join('')}
              </div>
              <input type="hidden" name="category" id="admin-post-category-value" value="${CATEGORY_OPTIONS[0]}" form="admin-post-create-form" />
            </article>

            <article class="admin-panel admin-posts-panel admin-post-side-card">
              <header class="admin-posts-panel-head">
                <h3>Tags</h3>
              </header>
              <div class="admin-post-tags-controls">
                <input type="text" id="admin-post-tags-input" placeholder="Add tag..." />
                <button type="button" id="admin-post-tags-add" class="admin-post-btn admin-post-btn-muted">Add</button>
              </div>
              <p class="admin-post-tags-hint">Separate tags with commas.</p>
              <div id="admin-post-tags-list" class="admin-post-tags-list"></div>
              <input type="hidden" id="admin-post-tags-value" name="tags" form="admin-post-create-form" />
            </article>
          </aside>
        </section>
      </section>
    `,
  )
}

export function setupposts_create_page(root: HTMLElement): () => void {
  const cleanupShell = setupPortalShell(root, ADMIN_SHELL_CONFIG)
  const form = root.querySelector<HTMLFormElement>('#admin-post-create-form')
  const feedback = root.querySelector<HTMLParagraphElement>('#admin-post-create-feedback')
  const imageInput = root.querySelector<HTMLInputElement>('#admin-post-image-file')
  const imageDataInput = root.querySelector<HTMLInputElement>('#admin-post-image-data')
  const imageName = root.querySelector<HTMLElement>('#admin-post-image-name')
  const imageDropzone = root.querySelector<HTMLElement>('.admin-post-image-dropzone')
  const categoryChecks = Array.from(root.querySelectorAll<HTMLInputElement>('input[name="category-choice"]'))
  const categoryValue = root.querySelector<HTMLInputElement>('#admin-post-category-value')
  const tagsInput = root.querySelector<HTMLInputElement>('#admin-post-tags-input')
  const tagsAdd = root.querySelector<HTMLButtonElement>('#admin-post-tags-add')
  const tagsList = root.querySelector<HTMLElement>('#admin-post-tags-list')
  const tagsValue = root.querySelector<HTMLInputElement>('#admin-post-tags-value')
  const previewButton = root.querySelector<HTMLButtonElement>('#admin-post-preview-btn')
  const tags = new Set<string>()

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

  const renderTags = (): void => {
    if (!tagsList || !tagsValue) return
    const items = Array.from(tags)
    tagsValue.value = items.join(',')
    tagsList.innerHTML = items
      .map(
        (tag) => `
          <button type="button" class="admin-post-tag-chip" data-tag="${tag}">
            <span>${tag}</span>
            <i class="bi bi-x" aria-hidden="true"></i>
          </button>
        `,
      )
      .join('')
  }

  const addTagsFromInput = (): void => {
    const raw = tagsInput?.value.trim()
    if (!raw) return
    raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => tags.add(item))
    if (tagsInput) tagsInput.value = ''
    renderTags()
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

  const onTagAddClick = (): void => {
    addTagsFromInput()
  }

  const onTagInputKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    addTagsFromInput()
  }

  const onTagRemoveClick = (event: Event): void => {
    const target = event.target as HTMLElement
    const chip = target.closest<HTMLElement>('[data-tag]')
    if (!chip) return
    const tag = chip.dataset.tag
    if (!tag) return
    tags.delete(tag)
    renderTags()
  }

  const buildPreviewHtml = (payload: {
    title: string
    date: string
    category: string
    excerpt: string
    content: string
    image: string
    tags?: string
  }): string => {
    const safe = (value: string): string =>
      value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')

    const tagsMarkup = payload.tags
      ? payload.tags
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => `<span>${safe(item)}</span>`)
          .join('')
      : ''

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Preview - ${safe(payload.title || 'Untitled Post')}</title>
  <style>
    body{font-family:Arial,sans-serif;background:#f4f7fb;color:#1e293b;margin:0}
    main{max-width:860px;margin:2rem auto;padding:1rem}
    article{background:#fff;border:1px solid #d9e2ef;border-radius:10px;padding:1.1rem}
    h1{margin:0 0 .5rem;font-size:2rem;color:#102338}
    .meta{display:flex;gap:.7rem;flex-wrap:wrap;color:#64748b;font-size:.9rem;margin-bottom:.9rem}
    .thumb{width:100%;max-height:440px;object-fit:cover;border-radius:8px;border:1px solid #d9e2ef;background:#eef3fb}
    p{line-height:1.65}
    .excerpt{font-size:1.05rem;color:#334155}
    .tags{display:flex;gap:.45rem;flex-wrap:wrap;margin-top:.85rem}
    .tags span{border:1px solid #cfd8e6;background:#f8fafc;border-radius:999px;padding:.2rem .6rem;font-size:.78rem}
  </style>
</head>
<body>
  <main>
    <article>
      <h1>${safe(payload.title || 'Untitled Post')}</h1>
      <div class="meta">
        <span>${safe(payload.date || 'No date')}</span>
        <span>${safe(payload.category || 'No category')}</span>
      </div>
      ${payload.image ? `<img class="thumb" src="${safe(payload.image)}" alt="${safe(payload.title || 'Preview image')}" />` : ''}
      <p class="excerpt">${safe(payload.excerpt || '')}</p>
      <p>${safe(payload.content || '').replaceAll('\n', '<br/>')}</p>
      ${tagsMarkup ? `<div class="tags">${tagsMarkup}</div>` : ''}
    </article>
  </main>
</body>
</html>`
  }

  const onPreview = (): void => {
    if (!form) return
    const formData = new FormData(form)
    const payload = {
      title: String(formData.get('title') ?? '').trim(),
      date: getTodayDateLabel(),
      category: String(formData.get('category') ?? '').trim(),
      excerpt: String(formData.get('excerpt') ?? '').trim(),
      content: String(formData.get('content') ?? '').trim(),
      image: String(formData.get('image') ?? '').trim(),
      tags: String(formData.get('tags') ?? '').trim(),
    }

    const win = window.open('', '_blank', 'noopener,noreferrer')
    if (!win) return
    win.document.open()
    win.document.write(buildPreviewHtml(payload))
    win.document.close()
  }

  const onSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault()
    if (!form || !feedback) return

    const formData = new FormData(form)
    const payload = {
      title: String(formData.get('title') ?? '').trim(),
      date: getTodayDateLabel(),
      category: String(formData.get('category') ?? '').trim(),
      excerpt: String(formData.get('excerpt') ?? '').trim(),
      content: String(formData.get('content') ?? '').trim(),
      image: String(formData.get('image') ?? '').trim(),
      tags: String(formData.get('tags') ?? '').trim(),
    }

    feedback.textContent = 'Publishing...'
    feedback.classList.remove('is-error')

    try {
      await createPost(payload)

      feedback.innerHTML = `Post created. <a href="${ROUTES.ADMINISTRATOR_POSTS}">Back to Posts</a>`
      form.reset()
      if (imageDataInput) imageDataInput.value = ''
      if (imageName) imageName.textContent = 'No image selected'
      tags.clear()
      renderTags()
    } catch (error) {
      feedback.textContent = error instanceof Error ? error.message : 'Failed to create post.'
      feedback.classList.add('is-error')
    }
  }

  imageInput?.addEventListener('change', onImageChange)
  imageDropzone?.addEventListener('dragover', onDragOver)
  imageDropzone?.addEventListener('dragleave', onDragLeave)
  imageDropzone?.addEventListener('drop', onDrop)
  categoryChecks.forEach((check) => check.addEventListener('change', onCategoryChange))
  tagsAdd?.addEventListener('click', onTagAddClick)
  tagsInput?.addEventListener('keydown', onTagInputKeydown)
  tagsList?.addEventListener('click', onTagRemoveClick)
  previewButton?.addEventListener('click', onPreview)
  form?.addEventListener('submit', onSubmit)

  return () => {
    cleanupShell()
    imageInput?.removeEventListener('change', onImageChange)
    imageDropzone?.removeEventListener('dragover', onDragOver)
    imageDropzone?.removeEventListener('dragleave', onDragLeave)
    imageDropzone?.removeEventListener('drop', onDrop)
    categoryChecks.forEach((check) => check.removeEventListener('change', onCategoryChange))
    tagsAdd?.removeEventListener('click', onTagAddClick)
    tagsInput?.removeEventListener('keydown', onTagInputKeydown)
    tagsList?.removeEventListener('click', onTagRemoveClick)
    previewButton?.removeEventListener('click', onPreview)
    form?.removeEventListener('submit', onSubmit)
  }
}

