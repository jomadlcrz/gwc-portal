export type PostCategory = 'Articles' | 'Files' | 'Board Resolutions'

export type PostItem = {
  slug: string
  title: string
  date: string
  category: PostCategory
  excerpt: string
  content: string
  image?: string
}

export const posts: PostItem[] = [
  {
    slug: 'delegates-join-international-academic-exchange-program',
    title: 'Delegates Join International Academic Exchange Program',
    date: 'April 5, 2026',
    category: 'Articles',
    excerpt: 'GWC strengthens global engagement through exchange dialogues and collaborative research sessions.',
    content:
      'Golden West Colleges continues expanding international partnerships through faculty and student exchange activities. The program includes research discussions, cultural immersion, and joint planning for future academic collaborations.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'stem-fair-2026',
    title: 'STEM Fair 2026',
    date: 'May 12, 2026',
    category: 'Articles',
    excerpt: 'Students showcased innovative projects in robotics, coding, and applied science.',
    content:
      'The annual STEM Fair featured project exhibits, live demos, and judging sessions from invited academic and industry representatives. Participants presented practical solutions focused on local and regional challenges.',
    image: 'https://picsum.photos/seed/gwc-campus-event/1200/720',
  },
  {
    slug: 'research-colloquium',
    title: 'Research Colloquium',
    date: 'June 1, 2026',
    category: 'Articles',
    excerpt: 'Faculty and students presented current studies and emerging academic work.',
    content:
      'The colloquium gathered departments to discuss current research directions, methodology standards, and publication targets. Sessions also covered mentorship opportunities for student researchers.',
    image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'youth-extension-program-reaches-local-barangays',
    title: 'Youth Extension Program Reaches Local Barangays',
    date: 'May 20, 2026',
    category: 'Articles',
    excerpt: 'Student volunteers and faculty facilitators continue outreach and mentoring activities.',
    content:
      'The extension program supports barangay youth through literacy sessions, mentoring, and community-led activities. Organizers noted improved participation from partner communities this term.',
    image: 'https://picsum.photos/seed/gwc-community-extension/1200/720',
  },
  {
    slug: 'reading-outreach',
    title: 'Reading Outreach',
    date: 'May 8, 2026',
    category: 'Articles',
    excerpt: 'Reading activities focused on foundational comprehension and confidence-building.',
    content:
      'The outreach team coordinated with local schools to run guided reading sessions and provide supplementary learning materials. Follow-up sessions are scheduled in the coming months.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'campus-volunteers',
    title: 'Campus Volunteers',
    date: 'May 28, 2026',
    category: 'Articles',
    excerpt: 'Student organizations expanded community support through weekend volunteer drives.',
    content:
      'Volunteer groups organized service activities and resource support drives with faculty advisers. The initiative is part of GWC’s community engagement and service-learning effort.',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'campus-sustainability-and-student-leadership',
    title: 'Campus Sustainability and Student Leadership',
    date: 'June 10, 2026',
    category: 'Articles',
    excerpt: 'A reflection on student-led initiatives driving practical environmental action.',
    content:
      'Student leaders and campus offices launched projects focused on waste reduction, responsible energy use, and awareness campaigns. The work aligns with long-term sustainability targets for the campus community.',
    image: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'enrollment-advisory-for-new-students',
    title: 'Enrollment Advisory for New Students',
    date: 'August 14, 2026',
    category: 'Articles',
    excerpt: 'Please prepare your original credentials and complete online pre-registration before visiting campus.',
    content:
      'Incoming students are advised to complete online pre-registration and secure original credential documents before proceeding to campus enrollment windows. Support desks remain available for walk-in assistance.',
    image: 'https://picsum.photos/id/1048/900/500',
  },
  {
    slug: 'scholarship-screening-schedule',
    title: 'Scholarship Screening Schedule',
    date: 'August 10, 2026',
    category: 'Articles',
    excerpt: 'Qualified applicants may proceed to the Guidance Office for screening and interview confirmation.',
    content:
      'The Guidance Office released screening blocks for scholarship applicants. Students should verify schedule assignments and submit required forms before interview day.',
    image: 'https://picsum.photos/id/180/900/500',
  },
  {
    slug: 'faculty-consultation-week',
    title: 'Faculty Consultation Week',
    date: 'August 5, 2026',
    category: 'Articles',
    excerpt: 'Departments are opening consultation sessions to guide students on subject loads and pathways.',
    content:
      'Consultation week offers one-on-one and group sessions for enrollment planning, curriculum alignment, and academic standing concerns. Students are encouraged to book appointments early.',
    image: 'https://picsum.photos/id/20/900/500',
  },
  {
    slug: 'student-handbook-2026-edition',
    title: 'Student Handbook 2026 Edition',
    date: 'July 30, 2026',
    category: 'Files',
    excerpt: 'PDF reference for policies, grading system, and student conduct guidelines.',
    content:
      'The latest student handbook compiles academic policies, grading rules, student services information, and conduct standards. The digital file is available through the registrar and student portals.',
  },
  {
    slug: 'admission-requirements-checklist',
    title: 'Admission Requirements Checklist',
    date: 'July 28, 2026',
    category: 'Files',
    excerpt: 'Downloadable checklist for freshmen, transferees, and returning students.',
    content:
      'Applicants can use the checklist to prepare all required documents before submission. This file includes separate guidance for freshmen, transferees, and returning learners.',
  },
  {
    slug: 'board-resolution-no-12-series-of-2026',
    title: 'Board Resolution No. 12, Series of 2026',
    date: 'July 15, 2026',
    category: 'Board Resolutions',
    excerpt: 'Policy update on tuition structure and installment payment schedule.',
    content:
      'The board resolution details approved tuition updates, payment terms, and implementation timelines for Academic Year 2026-2027. Relevant offices have posted compliance advisories.',
  },
]

export function getPostBySlug(slug: string): PostItem | undefined {
  return posts.find((post) => post.slug === slug)
}

export function getPostPath(slug: string): string {
  return `/post/${encodeURIComponent(slug)}`
}

export function getArticlePosts(): PostItem[] {
  return posts.filter((post) => post.category === 'Articles')
}
