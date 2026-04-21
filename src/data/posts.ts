export type PostCategory = 'ANNOUNCEMENT' | 'GLOBAL' | 'COMMUNITY' | 'EVENTS'

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
    slug: 'foundation-day-celebration-2026',
    title: 'Foundation Day Celebration 2026',
    date: 'May 10, 2026',
    category: 'EVENTS',
    excerpt:
      'A campus-wide celebration featuring student performances, recognition ceremonies, and community activities honoring the college foundation milestone.',
    content:
      'Golden West Colleges marks Foundation Day with academic showcases, student organization presentations, and commemorative events for the campus community.',
    image: 'https://picsum.photos/seed/gwc-event-foundation-day/1280/720',
  },
  {
    slug: 'alumni-homecoming-2026',
    title: 'Alumni Homecoming 2026',
    date: 'June 7, 2026',
    category: 'EVENTS',
    excerpt:
      'Alumni return to campus for networking sessions, mentoring circles, and program reunions that reconnect graduates with students and faculty.',
    content:
      'The homecoming program includes department meetups, career talks, and alumni recognition to strengthen cross-batch ties and institutional engagement.',
    image: 'https://picsum.photos/seed/gwc-event-alumni-homecoming/1280/720',
  },
  {
    slug: 'research-and-innovation-forum-2026',
    title: 'Research and Innovation Forum 2026',
    date: 'June 21, 2026',
    category: 'EVENTS',
    excerpt:
      'Faculty and student researchers present practical innovations and studies focused on community needs, applied learning, and future-ready solutions.',
    content:
      'The forum highlights interdisciplinary outputs, prototype demonstrations, and academic discussions that support research culture across programs.',
    image: 'https://picsum.photos/seed/gwc-event-research-forum/1280/720',
  },
  {
    slug: 'student-leadership-summit-2026',
    title: 'Student Leadership Summit 2026',
    date: 'July 12, 2026',
    category: 'EVENTS',
    excerpt:
      'Student leaders from different programs gather for workshops, planning sessions, and collaborative activities focused on campus leadership development.',
    content:
      'The summit features leadership talks, peer learning circles, and action planning for student-led projects to be implemented during the academic year.',
    image: 'https://picsum.photos/seed/gwc-event-leadership-summit/1280/720',
  },
  {
    slug: 'college-intramurals-opening-2026',
    title: 'College Intramurals Opening 2026',
    date: 'August 3, 2026',
    category: 'EVENTS',
    excerpt:
      'The intramurals opening brings together students, faculty, and staff for sportsmanship, team-building, and healthy campus competition.',
    content:
      'Opening day includes team parades, oath-taking, and kickoff matches across multiple sports disciplines and student divisions.',
    image: 'https://picsum.photos/seed/gwc-event-intramurals/1280/720',
  },
  {
    slug: 'freshmen-orientation-week-2026',
    title: 'Freshmen Orientation Week 2026',
    date: 'August 18, 2026',
    category: 'EVENTS',
    excerpt:
      'Incoming students are introduced to academic policies, student services, campus facilities, and essential support offices through orientation activities.',
    content:
      'Orientation week includes department briefings, campus tours, and student organization showcases to help freshmen transition smoothly.',
    image: 'https://picsum.photos/seed/gwc-event-orientation-week/1280/720',
  },
  {
    slug: 'career-fair-and-industry-talks-2026',
    title: 'Career Fair and Industry Talks 2026',
    date: 'September 9, 2026',
    category: 'EVENTS',
    excerpt:
      'Students connect with partner companies through career booths, recruitment consultations, and expert talks on workplace readiness.',
    content:
      'The event hosts hiring partners, alumni speakers, and career advisers to guide students in internship and employment planning.',
    image: 'https://picsum.photos/seed/gwc-event-career-fair/1280/720',
  },
  {
    slug: 'delegates-join-international-academic-exchange-program',
    title: 'Delegates Join International Academic Exchange Program',
    date: 'April 5, 2026',
    category: 'GLOBAL',
    excerpt:
      'GWC strengthens global engagement by hosting exchange dialogues, collaborative research sessions, and cross-cultural academic planning with partner institutions. Through these exchanges, participants build shared academic goals, align research priorities, and establish practical pathways for faculty mobility, student immersion, and future joint program development that can be sustained across multiple terms.',
    content:
      'Golden West Colleges continues expanding international partnerships through faculty and student exchange activities. The program includes research discussions, cultural immersion, and joint planning for future academic collaborations.',
    image: 'https://picsum.photos/id/180/1200/720.jpg',
  },
  {
    slug: 'stem-fair-2026',
    title: 'STEM Fair 2026',
    date: 'May 12, 2026',
    category: 'GLOBAL',
    excerpt:
      'Students showcased innovative projects in robotics, coding, and applied science, highlighting practical solutions designed for real classroom and community challenges. Demonstrations emphasized creativity, technical execution, and measurable impact, while judges and guests noted how student-led prototypes addressed local needs, improved usability, and reflected strong interdisciplinary collaboration.',
    content:
      'The annual STEM Fair featured project exhibits, live demos, and judging sessions from invited academic and industry representatives. Participants presented practical solutions focused on local and regional challenges.',
    image: 'https://picsum.photos/seed/gwc-campus-event/1200/720',
  },
  {
    slug: 'research-colloquium',
    title: 'Research Colloquium',
    date: 'June 1, 2026',
    category: 'GLOBAL',
    excerpt:
      'Faculty and students presented current studies and emerging academic work, opening interdisciplinary discussions on methods, findings, and future publication goals. The colloquium created space for peer feedback, mentoring conversations, and cross-department collaboration, helping participants refine their studies, strengthen methodology decisions, and prepare outputs for conference and journal submission.',
    content:
      'The colloquium gathered departments to discuss current research directions, methodology standards, and publication targets. Sessions also covered mentorship opportunities for student researchers.',
    image: 'https://picsum.photos/id/96/1200/720.jpg',
  },
  {
    slug: 'youth-extension-program-reaches-local-barangays',
    title: 'Youth Extension Program Reaches Local Barangays',
    date: 'May 20, 2026',
    category: 'COMMUNITY',
    excerpt:
      'Student volunteers and faculty facilitators continue outreach and mentoring activities across partner barangays, with a stronger focus on youth participation and continuity. Organizers reported improved attendance and engagement as follow-up sessions became more structured, community-driven, and responsive to local priorities identified by youth leaders and barangay partners.',
    content:
      'The extension program supports barangay youth through literacy sessions, mentoring, and community-led activities. Organizers noted improved participation from partner communities this term.',
    image: 'https://picsum.photos/seed/gwc-community-extension/1200/720',
  },
  {
    slug: 'reading-outreach',
    title: 'Reading Outreach',
    date: 'May 8, 2026',
    category: 'COMMUNITY',
    excerpt:
      'Reading activities focused on foundational comprehension and confidence-building through guided sessions, interactive storytelling, and learner support checkpoints. The program reinforces consistent literacy habits through repeat practice, close facilitation, and parent-community coordination, allowing learners to improve pace, understanding, and confidence in both oral and silent reading tasks.',
    content:
      'The outreach team coordinated with local schools to run guided reading sessions and provide supplementary learning materials. Follow-up sessions are scheduled in the coming months.',
    image: 'https://picsum.photos/id/24/1200/720.jpg',
  },
  {
    slug: 'campus-volunteers',
    title: 'Campus Volunteers',
    date: 'May 28, 2026',
    category: 'COMMUNITY',
    excerpt:
      'Student organizations expanded community support through weekend volunteer drives, combining service-learning efforts with coordinated faculty and local partner involvement. Activities included resource distribution, basic assistance programs, and on-site engagement aligned with civic responsibility goals, while also giving student leaders practical experience in planning, communication, and sustained volunteer coordination.',
    content:
      'Volunteer groups organized service activities and resource support drives with faculty advisers. The initiative is part of GWC’s community engagement and service-learning effort.',
    image: 'https://picsum.photos/id/344/1200/720.jpg',
  },
  {
    slug: 'enrollment-advisory-for-new-students',
    title: 'Enrollment Advisory for New Students',
    date: 'August 14, 2026',
    category: 'ANNOUNCEMENT',
    excerpt:
      'Please prepare your original credentials and complete online pre-registration before visiting campus to avoid delays during document verification and enrollment processing. Students are encouraged to review all requirements in advance, confirm document completeness, and follow assigned enrollment windows so transactions can be processed faster with fewer repeat visits.',
    content:
      'Incoming students are advised to complete online pre-registration and secure original credential documents before proceeding to campus enrollment windows. Support desks remain available for walk-in assistance.',
    image: 'https://picsum.photos/id/1048/900/500',
  },
  {
    slug: 'scholarship-screening-schedule',
    title: 'Scholarship Screening Schedule',
    date: 'August 10, 2026',
    category: 'ANNOUNCEMENT',
    excerpt:
      'Qualified applicants may proceed to the Guidance Office for screening and interview confirmation based on the released schedule and required supporting documents. Applicants should verify assigned time slots, complete all required forms, and submit accurate records before arrival to ensure smooth evaluation, proper interview sequencing, and timely release of screening outcomes.',
    content:
      'The Guidance Office released screening blocks for scholarship applicants. Students should verify schedule assignments and submit required forms before interview day.',
    image: 'https://picsum.photos/id/180/900/500',
  },
  {
    slug: 'faculty-consultation-week',
    title: 'Faculty Consultation Week',
    date: 'August 5, 2026',
    category: 'ANNOUNCEMENT',
    excerpt:
      'Departments are opening consultation sessions to guide students on subject loads, curriculum pathways, and enrollment decisions aligned with academic standing. Advisers will also address prerequisite concerns, sequencing options, and recommendations for balanced term planning so students can avoid scheduling conflicts and stay aligned with graduation targets.',
    content:
      'Consultation week offers one-on-one and group sessions for enrollment planning, curriculum alignment, and academic standing concerns. Students are encouraged to book appointments early.',
    image: 'https://picsum.photos/id/20/900/500',
  },
  {
    slug: 'student-handbook-2026-edition',
    title: 'Student Handbook 2026 Edition',
    date: 'July 30, 2026',
    category: 'ANNOUNCEMENT',
    excerpt:
      'PDF reference for policies, grading system, and student conduct guidelines, including updated procedures for academic services and student support access. Students are advised to review the handbook thoroughly to understand institutional expectations, service workflows, and policy updates that may affect enrollment, evaluation, and campus conduct compliance.',
    content:
      'The latest student handbook compiles academic policies, grading rules, student services information, and conduct standards. The digital file is available through the registrar and student portals.',
  },
  {
    slug: 'admission-requirements-checklist',
    title: 'Admission Requirements Checklist',
    date: 'July 28, 2026',
    category: 'ANNOUNCEMENT',
    excerpt:
      'Downloadable checklist for freshmen, transferees, and returning students to help ensure complete document submission and smoother admissions processing. The checklist includes category-specific requirements, submission reminders, and verification steps to minimize repeat visits, reduce missing paperwork, and improve processing turnaround at admissions counters.',
    content:
      'Applicants can use the checklist to prepare all required documents before submission. This file includes separate guidance for freshmen, transferees, and returning learners.',
  },
  {
    slug: 'board-resolution-no-12-series-of-2026',
    title: 'Board Resolution No. 12, Series of 2026',
    date: 'July 15, 2026',
    category: 'ANNOUNCEMENT',
    excerpt:
      'Policy update on tuition structure and installment payment schedule, including revised implementation guidance for the upcoming academic year. The notice outlines key timelines, payment terms, and compliance reminders relevant to students and guardians, helping families prepare early and align financial planning with official institutional schedules.',
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
  return posts.filter((post) => post.category === 'ANNOUNCEMENT')
}

const POST_CATEGORY_TO_SLUG: Record<PostCategory, string> = {
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  GLOBAL: 'GLOBAL',
  COMMUNITY: 'COMMUNITY',
  EVENTS: 'EVENTS',
}

const POST_SLUG_TO_CATEGORY: Record<string, PostCategory> = {
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  GLOBAL: 'GLOBAL',
  COMMUNITY: 'COMMUNITY',
  EVENTS: 'EVENTS',
}

export function getPostCategorySlug(category: PostCategory): string {
  return POST_CATEGORY_TO_SLUG[category]
}

export function getPostCategoryFromSlug(categorySlug: string): PostCategory | null {
  const normalized = decodeURIComponent(categorySlug).trim().toUpperCase()
  return POST_SLUG_TO_CATEGORY[normalized] ?? null
}

export function getPostsByCategory(category: PostCategory): PostItem[] {
  return posts.filter((post) => post.category === category)
}

export function getCategoryLabel(category: PostCategory): string {
  if (category === 'ANNOUNCEMENT') return 'Announcement'
  if (category === 'GLOBAL') return 'Global'
  if (category === 'COMMUNITY') return 'Community'
  return 'Events'
}




