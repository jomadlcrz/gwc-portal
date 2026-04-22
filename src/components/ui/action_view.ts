export type ActionViewField = {
  label: string
  value: string
  pillClass?: string
}

export type ActionViewSection = {
  title: string
  fields: ActionViewField[]
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function renderActionView(sections: ActionViewSection[]): string {
  return `
    <div class="action-view-wrap action-view-separated">
      ${sections
        .map(
          (section) => `
            <section class="action-view-section">
              <h3><span class="admin-section-title">${escapeHtml(section.title)}</span></h3>
              <div class="action-view-grid">
                ${section.fields
                  .map((field) => {
                    const valueHtml = field.pillClass
                      ? `<span class="admin-pill ${field.pillClass}">${escapeHtml(field.value)}</span>`
                      : `<strong>${escapeHtml(field.value)}</strong>`
                    return `<div class="action-view-item"><p>${escapeHtml(field.label)}</p>${valueHtml}</div>`
                  })
                  .join('')}
              </div>
            </section>
          `,
        )
        .join('')}
    </div>
  `
}

export function renderActionChanges(title: string, changes: string[]): string {
  return renderActionView([
    {
      title,
      fields: changes.map((change) => ({ label: 'Change', value: change })),
    },
  ])
}
