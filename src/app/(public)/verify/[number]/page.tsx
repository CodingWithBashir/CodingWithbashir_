import VerifyPageClient from './client'

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const { buildClient } = await import('@/lib/supabase/build')
    const supabase = buildClient()
    const { data } = await supabase.from('certificates').select('certificate_number').eq('is_verified', true).limit(500)
    if (data?.length) return data.map((c: any) => ({ number: c.certificate_number }))
  } catch {}
  return [{ number: '00000000' }]
}

export default function Page() {
  return <VerifyPageClient />
}
