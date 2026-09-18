'use client'
import { useState } from 'react'
import Link from '@/components/Link'
import { useRouter } from 'next/navigation'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { QrCode, Search, ShieldCheck } from 'lucide-react'
import { withBase } from '@/lib/utils/base-path'

export default function VerifyLandingPage() {
  const router = useRouter()
  const [number, setNumber] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = number.trim().toUpperCase()
    if (!n) return
    router.push(withBase(`/verify/${encodeURIComponent(n)}`))
  }
  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-2xl">
        <MetadataInjector title="Verify a Certificate" description="Enter a CodingWithBashir certificate number or scan its QR code to verify authenticity." url="/verify" />
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Verify a Certificate</h1>
          <p className="text-text-secondary">
            Every CodingWithBashir certificate has a unique ID and a scannable QR code. Enter it below to confirm authenticity.
          </p>
        </div>

        <Card className="card-hover glow-border">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="certnum" className="text-sm font-medium block mb-1.5">
                  Certificate Number
                </label>
                <div className="flex gap-2">
                  <Input
                    id="certnum"
                    placeholder="e.g. CWB-2F8A9C1D"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="font-mono tracking-wider"
                  />
                  <Button type="submit" className="gradient-bg text-white shrink-0">
                    <Search className="h-4 w-4 mr-2" /> Verify
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 flex items-center gap-3 text-sm text-text-secondary">
              <QrCode className="h-5 w-5 text-brand-primary" />
              <span>Or scan the QR code printed on any certificate to land directly on its verification page.</span>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-text-muted mt-6">
          Want to earn your own? <Link href="/courses" className="text-brand-primary hover:underline">Browse free courses →</Link>
        </p>
      </div>
    </main>
  )
}
