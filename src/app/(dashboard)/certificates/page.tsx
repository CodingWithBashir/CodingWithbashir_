import { permanentRedirect } from 'next/navigation'

// Permanent redirect (HTTP 308) so clients and crawlers go straight to
// /certification without ever rendering a 404 page.
export default function CertificatesRedirect() {
  permanentRedirect('/certification')
}
