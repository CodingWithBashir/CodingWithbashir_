'use client'

import { createContext, useContext, useEffect, useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { withBase } from '@/lib/utils/base-path'
import type { User } from '@supabase/supabase-js'

export type AuthUser = {
  uid: string
  email: string | null
  name: string | null
  image: string | null
  role: string
}

type AuthContextType = {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  signOut: async () => {},
  refresh: async () => {},
})

function fromMetadata(authUser: User): AuthUser {
  const meta = (authUser.user_metadata || {}) as Record<string, any>
  const appMeta = (authUser.app_metadata || {}) as Record<string, any>
  return {
    uid: authUser.id,
    email: authUser.email || null,
    name: meta.name || authUser.email?.split('@')[0] || '',
    image: meta.avatar_url || meta.avatar || null,
    role: appMeta.role || meta.role || 'student',
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setLoading] = useState(true)

  const refreshProfile = useCallback(async (supabase: any, authUser: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, avatar_url, role')
        .eq('id', authUser.id)
        .maybeSingle()
      if (profile) {
        setUser({
          uid: authUser.id,
          email: authUser.email || null,
          name: profile.name || authUser.email?.split('@')[0] || '',
          image: profile.avatar_url || null,
          role: profile.role || 'student',
        })
      }
    } catch {
      /* metadata fallback already shown */
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    supabase.auth
      .getUser()
      .then(({ data: { user: authUser } }) => {
        if (cancelled) return
        if (authUser) {
          setUser(fromMetadata(authUser))
          setLoading(false)
          refreshProfile(supabase, authUser)
        } else {
          setUser(null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) { setUser(null); setLoading(false) }
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      if (session?.user) {
        setUser(fromMetadata(session.user))
        setLoading(false)
        refreshProfile(supabase, session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [refreshProfile])

  const refresh = useCallback(async () => {
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      setUser(fromMetadata(authUser))
      await refreshProfile(supabase, authUser)
    }
  }, [refreshProfile])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut().catch(() => {})
    setUser(null)
    window.location.href = withBase('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
