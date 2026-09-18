'use client'

import { createBrowserClient } from '@supabase/ssr'

let _client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (_client) return _client
  _client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Use localStorage + cookies so sessions survive under the GitHub
        // Pages subpath (cookies set to Path=/ work for all subpaths).
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return ''
          const match = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
          return match ? decodeURIComponent(match.split('=')[1]) : ''
        },
        set(name: string, value: string, options?: any) {
          if (typeof document === 'undefined') return
          const opts = { path: '/', sameSite: 'Lax', secure: location.protocol === 'https:', ...options }
          let cookie = `${name}=${encodeURIComponent(value)}; path=${opts.path}; SameSite=${opts.sameSite}`
          if (opts.maxAge) cookie += `; Max-Age=${opts.maxAge}`
          if (opts.secure) cookie += '; Secure'
          document.cookie = cookie
        },
        remove(name: string) {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=; path=/; Max-Age=0`
        },
      },
    }
  )
  return _client
}
