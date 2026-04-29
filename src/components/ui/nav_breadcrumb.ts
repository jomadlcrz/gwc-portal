type BreadcrumbItem = {
  label: string
  href?: string
  active?: boolean
}

export function renderBreadcrumbNav(items: BreadcrumbItem[]): string {
  // Only show breadcrumb if there are 2 or more items
  if (items.length < 2) {
    return ''
  }
  
  return `
    <nav class="breadcrumb-shell" aria-label="Breadcrumb">
      <ol class="breadcrumb section-breadcrumb mb-0">
        ${items
          .map((item) => {
            if (item.active || !item.href) {
              return `<li class="breadcrumb-item active" aria-current="page">${item.label}</li>`
            }
            return `<li class="breadcrumb-item"><a href="${item.href}">${item.label}</a></li>`
          })
          .join('')}
      </ol>
    </nav>
  `
}


