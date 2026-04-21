export type Testimonial = {
  id: string
  name: string
  role: string
  message: string
  image: string
  category?: string
  featured?: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Thompson',
    role: 'Proud Parent',
    message:
      'Golden West Colleges has been an amazing experience for our children. The teachers are dedicated, the academics are excellent, and the sense of community is truly strong.',
    image: 'https://picsum.photos/id/64/800/800.jpg',
  },
  {
    id: '2',
    name: 'Mark Reynolds',
    role: 'Alumni Parent',
    message:
      'From orientation to graduation milestones, the support system has been consistent and responsive. Our family feels that students are seen, guided, and challenged in the best way.',
    image: 'https://picsum.photos/id/65/800/800.jpg',
  },
  {
    id: '3',
    name: 'Lia Garcia',
    role: 'Community Partner',
    message:
      'Working with GWC has been a collaborative and meaningful experience. Their student and faculty engagement in community initiatives is practical, respectful, and sustained.',
    image: 'https://picsum.photos/id/177/800/800.jpg',
  },
]


