'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { useAuth } from '@/components/auth-provider'
import { withBase } from '@/lib/utils/base-path'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Client-side redirect to /login when session is missing.
      const redirect = withBase(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      window.location.replace(redirect)
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="text-text-secondary text-sm">Redirecting to sign in…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-20 container-wide pb-20">{children}</main>
    </div>
  )
}
