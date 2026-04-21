const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? ''

export type CreatePostPayload = {
  title: string
  date: string
  category: string
  excerpt: string
  content: string
  image: string
  tags?: string
}

type CreatePostResponse = {
  message?: string
  slug?: string
}

export async function createPost(payload: CreatePostPayload): Promise<CreatePostResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const responseBody = (await response.json()) as CreatePostResponse
  if (!response.ok) {
    throw new Error(responseBody.message ?? 'Failed to create post.')
  }

  return responseBody
}
