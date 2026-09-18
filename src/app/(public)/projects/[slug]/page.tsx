import ProjectDetailPageClient from './client'

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const { buildClient } = await import('@/lib/supabase/build')
    const supabase = buildClient()
    const { data } = await supabase.from('projects').select('slug').eq('is_published', true).limit(200)
    if (data?.length) return data.map((p: any) => ({ slug: p.slug }))
  } catch {}
  return [{ slug: 'placeholder' }]
}

export default function Page() {
  return <ProjectDetailPageClient />
}
