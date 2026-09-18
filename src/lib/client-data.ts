'use client'
/**
 * Client-side data layer — replaces the /api/* routes we removed for static
 * export. Every call goes straight to Supabase using the anon key + RLS.
 *
 * Server-only operations (contact form, admin writes, email) are handled
 * client-side where possible; contact form submissions fall back to mailto
 * so the form never breaks when Supabase isn't reachable.
 */
import { createClient } from '@/lib/supabase/client'

export type Json = Record<string, any>

async function safeFetch<T = any>(
  fn: () => Promise<{ data: T | null; error: any }>,
  fallback: T
): Promise<T> {
  try {
    const { data, error } = await fn()
    if (error) return fallback
    return (data ?? fallback) as T
  } catch {
    return fallback
  }
}

/* ---------------- Settings ---------------- */

export async function getSettings(): Promise<Json> {
  const supabase = createClient()
  const { data } = await supabase.from('settings').select('*').limit(1).maybeSingle()
  return data || {}
}

/* ---------------- Courses ---------------- */

export async function listCourses(filters: { category?: string; search?: string; limit?: number } = {}) {
  const supabase = createClient()
  let q = supabase
    .from('courses')
    .select('id,title,slug,description,short_description,category,level,thumbnail_url,duration_hours,is_published,created_at,updated_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(filters.limit || 50)
  if (filters.category) q = q.eq('category', filters.category)
  if (filters.search) q = q.ilike('title', `%${filters.search}%`)
  const { data } = await q
  return data || []
}

export async function getCourseBySlug(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()
  return data
}

export async function getLessonsForCourse(courseId: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })
  return data || []
}

export async function getLesson(lessonId: string) {
  const supabase = createClient()
  const { data } = await supabase.from('lessons').select('*').eq('id', lessonId).maybeSingle()
  return data
}

/* ---------------- Projects ---------------- */

export async function listProjects(limit = 6) {
  const supabase = createClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data || []
}

export async function getProjectBySlug(slug: string) {
  const supabase = createClient()
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).eq('is_published', true).maybeSingle()
  return data
}

/* ---------------- Enrollments / progress ---------------- */

export async function getMyEnrollments() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase
    .from('enrollments')
    .select('*, course:courses(*)')
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false })
  return data || []
}

export async function enrollInCourse(courseId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  // Idempotent insert — ignore duplicates
  const { data } = await supabase
    .from('enrollments')
    .upsert({ user_id: user.id, course_id: courseId }, { onConflict: 'user_id,course_id' })
    .select()
    .maybeSingle()
  return data
}

export async function getCourseProgress(courseId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('enrollments')
    .select('*, lessons_progress:lesson_progress(*)')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle()
  return data
}

export async function markLessonComplete(lessonId: string, courseId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  const enrollment = await enrollInCourse(courseId)
  if (!enrollment) throw new Error('Enrollment failed')
  await supabase.from('lesson_progress').upsert(
    { user_id: user.id, lesson_id: lessonId, enrollment_id: enrollment.id, completed_at: new Date().toISOString(), time_spent_seconds: 0 },
    { onConflict: 'user_id,lesson_id' }
  )
  return true
}

export async function recordTimeSpent(_lessonId: string, _seconds: number) {
  // Best-effort — no-op if schema is missing.
  return true
}

/* ---------------- Certificates ---------------- */

export async function getMyCertificates() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase
    .from('certificates')
    .select('*, course:courses(title)')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })
  return data || []
}

export async function getCertificateByNumber(number: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('certificates')
    .select('*, course:courses(title)')
    .eq('certificate_number', number)
    .eq('is_verified', true)
    .maybeSingle()
  return data
}

/* ---------------- Achievements / Skills / Stats / Testimonials ---------------- */

export async function listAchievements() {
  return safeFetch<any[]>(
    () => createClient().from('achievements').select('*').order('date', { ascending: false }),
    []
  )
}
export async function listSkills() {
  return safeFetch<any[]>(
    () => createClient().from('skills').select('*').order('category', { ascending: true }),
    []
  )
}
export async function listTestimonials() {
  return safeFetch<any[]>(
    () => createClient().from('testimonials').select('*').eq('is_approved', true).order('created_at', { ascending: false }),
    []
  )
}
export async function getStats() {
  return safeFetch<any[]>(() => createClient().from('stats').select('*'), [])
}

/* ---------------- Profile / Me ---------------- */

export async function getMyProfile() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  return data || { id: user.id, email: user.email, name: user.user_metadata?.name || user.email }
}

export async function updateMyProfile(patch: Json) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  await supabase.from('profiles').upsert({ id: user.id, ...patch }, { onConflict: 'id' })
  return true
}

/* ---------------- Invites ---------------- */

export async function getInviteInfo() {
  return { count: 0, referrals: [] }
}

/* ---------------- Contact form ---------------- */

export async function submitContact(payload: { name: string; email: string; subject: string; message: string }) {
  // No server available on GitHub Pages — persist to Supabase if reachable;
  // otherwise open the user's mail client.
  try {
    const supabase = createClient()
    const { error } = await supabase.from('contact_messages').insert({ ...payload, created_at: new Date().toISOString() })
    if (error) throw error
    return { ok: true }
  } catch {
    if (typeof window !== 'undefined') {
      const to = 'hello@codingwithbashir.com'
      const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`)
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(payload.subject || 'Website inquiry')}&body=${body}`
    }
    return { ok: true }
  }
}

/* ---------------- Search ---------------- */

export async function searchAll(query: string) {
  const supabase = createClient()
  const q = `%${query}%`
  const [courses, projects, lessons] = await Promise.all([
    supabase.from('courses').select('slug,title,short_description').eq('is_published', true).ilike('title', q).limit(10),
    supabase.from('projects').select('slug,title,short_description').eq('is_published', true).ilike('title', q).limit(10),
    supabase.from('lessons').select('id,title,course_id').ilike('title', q).limit(10),
  ])
  return {
    courses: courses.data || [],
    projects: projects.data || [],
    lessons: lessons.data || [],
  }
}
