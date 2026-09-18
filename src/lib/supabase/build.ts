/**
 * Server-side Supabase client used ONLY during `next build` (generateStaticParams,
 * opengraph images, etc). Uses the ANON key — never exposes the service role.
 */
import { createClient } from '@supabase/supabase-js'

export function buildClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
