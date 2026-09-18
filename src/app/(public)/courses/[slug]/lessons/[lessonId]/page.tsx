import LessonPageClient from './client'

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const { buildClient } = await import('@/lib/supabase/build')
    const supabase = buildClient()
    const { data: courses } = await supabase
      .from('courses')
      .select('slug,id')
      .eq('is_published', true)
      .limit(100)
    if (courses?.length) {
      const courseIds = courses.map((c: any) => c.id)
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id,course_id')
        .in('course_id', courseIds)
        .limit(500)
      const courseMap = new Map(courses.map((c: any) => [c.id, c.slug]))
      const params = (lessons || []).map((l: any) => ({
        slug: courseMap.get(l.course_id),
        lessonId: l.id,
      })).filter((p: any) => p.slug)
      if (params.length) return params
    }
  } catch {}
  // Placeholder — client will 404/redirect gracefully if unknown.
  return [{ slug: 'placeholder', lessonId: 'placeholder' }]
}

export default function Page() {
  return <LessonPageClient />
}
