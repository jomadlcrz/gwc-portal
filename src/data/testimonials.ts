export type Testimonial = {
  id: string
  name: string
  role: string
  message: string
  image: string
  rating?: number
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Thompson',
    role: 'Proud Parent',
    message:
      'Golden West Colleges has been an amazing experience for our children. The teachers are dedicated, the academics are excellent, and the sense of community is truly strong.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    rating: 5,
  },
  {
    id: '2',
    name: 'Mark Reynolds',
    role: 'Alumni Parent',
    message:
      'From orientation to graduation milestones, the support system has been consistent and responsive. Our family feels that students are seen, guided, and challenged in the best way.',
    image: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=800&q=80',
    rating: 5,
  },
  {
    id: '3',
    name: 'Lia Garcia',
    role: 'Community Partner',
    message:
      'Working with GWC has been a collaborative and meaningful experience. Their student and faculty engagement in community initiatives is practical, respectful, and sustained.',
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=800&q=80',
    rating: 5,
  },
]
