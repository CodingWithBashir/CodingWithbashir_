'use client'
import { useState } from 'react'
import Link from '@/components/Link'
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/Logo'
import { withBase } from '@/lib/utils/base-path'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget as HTMLFormElement
    const data = Object.fromEntries(new FormData(form))
    const emailVal = (data.email as string).trim()
    const nameVal = (data.name as string).trim()
    const pw = data.password as string
    if (pw !== data.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }
    if (pw.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }
    try {
      const supabase = createClient()
      // Save the intended name/password temporarily while we verify email.
      setEmail(emailVal); setName(nameVal); setPassword(pw)
      // signUp sends a confirmation email (Supabase's OTP/magic link).
      const { error: signUpError } = await supabase.auth.signUp({
        email: emailVal,
        password: pw,
        options: { data: { name: nameVal } },
      })
      if (signUpError) {
        const msg = signUpError.message.toLowerCase()
        if (msg.includes('already registered')) {
          setError('This email is already registered — try signing in instead.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }
      setStep('otp')
      setNotice('We sent a 6-digit verification code to your email. Enter it below to activate your account. (If your Supabase project is configured for magic links, click the link in the email instead.)')
      toast.success('Verification email sent.')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp.trim(),
        type: 'signup',
      })
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      // Persist name to profiles table.
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert(
          { id: user.id, email: user.email!, name, avatar_url: null },
          { onConflict: 'id' }
        ).catch(() => {})
      }
      toast.success('Account verified! Welcome aboard.')
      window.location.href = withBase('/dashboard')
    } catch {
      setError('Verification failed. Please check the code and try again.')
    }
    setLoading(false)
  }

  return (
    <div className="w-full">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <div className="rounded-2xl border border-border-primary bg-surface-card/80 p-8">
        <div className="text-center mb-6">
          <Link href="/" className="mb-3 inline-flex justify-center">
            <Logo className="h-10 w-10" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {step === 'form' ? 'Create your account' : 'Verify your email'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {step === 'form' ? 'Join free and start learning today' : `Enter the 6-digit code we sent to ${email}`}
          </p>
        </div>

        {notice && (
          <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
            {notice}
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="e.g. Ahmad Bashir" required autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" required minLength={8} autoComplete="new-password" className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Repeat your password" required autoComplete="new-password" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full gradient-bg text-white" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending code…</> : 'Create account & send code'}
            </Button>
            <p className="text-center text-sm text-text-secondary mt-5">
              Already have an account? <Link href="/login" className="text-brand-primary hover:underline">Sign in</Link>
            </p>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="otp">6-digit verification code</Label>
              <Input
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                className="tracking-[0.5em] text-center text-lg font-mono"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full gradient-bg text-white" disabled={loading || otp.length !== 6}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying…</> : 'Verify & create account'}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setStep('form')} disabled={loading}>
              Use a different email
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
