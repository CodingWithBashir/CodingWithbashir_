'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from '@/components/Link'
import { Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { CertificateDocument } from '@/components/courses/CertificateDocument'
import { getCertificateByNumber } from '@/lib/client-data'

interface VerifiedCert {
  certificate_number: string
  course: { title: string } | null
  course_title?: string
  recipient_name: string
  issued_at: string
  score: number | null
  is_verified: boolean
  recipient_photo_url?: string | null
}

export default function VerifyCertificatePage() {
  const params = useParams()
  const number = params?.number as string
  const [cert, setCert] = useState<VerifiedCert | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!number || number === '00000000' || number === 'placeholder') {
      setNotFound(true); setLoading(false); return
    }
    getCertificateByNumber(number).then(d => {
      if (d) setCert(d)
      else setNotFound(true)
      setLoading(false)
    })
  }, [number])

  if (number && (number === '00000000' || number === 'placeholder')) {
    // placeholder page shouldn't show an error; just render the landing form.
    return (
      <main id="main-content" className="section-padding pt-24">
        <div className="container-wide max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Verify a Certificate</h1>
          <p className="text-text-secondary mb-6">Enter a certificate number or scan a QR code.</p>
          <Button asChild className="gradient-bg text-white"><Link href="/verify">Go to verification</Link></Button>
        </div>
      </main>
    )
  }

  const courseTitle = cert?.course?.title || cert?.course_title || ''
  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-3xl">
        <MetadataInjector
          title={cert ? `${cert.recipient_name} — ${courseTitle} Certificate` : 'Verify Certificate'}
          description={cert ? `Verified certificate awarded to ${cert.recipient_name} for completing ${courseTitle}.` : 'Verify a CodingWithBashir course certificate.'}
          url={`/verify/${number}`}
        />
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
        ) : notFound || !cert ? (
          <Card className="card-hover">
            <CardContent className="p-12 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Certificate not found</h1>
              <p className="text-text-muted mb-6">That certificate number doesn&apos;t exist or has been revoked.</p>
              <Button asChild variant="outline"><Link href="/verify">Try another number</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <CertificateDocument
            certificateNumber={cert.certificate_number}
            courseTitle={courseTitle}
            recipientName={cert.recipient_name}
            issueDate={cert.issued_at}
            score={cert.score}
            verified={cert.is_verified}
            recipientPhoto={cert.recipient_photo_url || undefined}
          />
        )}
      </div>
    </main>
  )
}
