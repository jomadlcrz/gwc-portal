type AdminBreadcrumbItem = {
  label: string
  href?: string
  active?: boolean
}

export function renderAdminBreadcrumbNav(items: AdminBreadcrumbItem[]): string {
  return `
    <nav class="admin-breadcrumb-shell" aria-label="Breadcrumb">
      <ol class="breadcrumb admin-breadcrumb mb-0">
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
