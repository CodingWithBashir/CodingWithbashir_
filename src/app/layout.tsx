import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { WebSiteJsonLd } from '@/components/shared/JsonLd'
import './globals.css'

// Static export for GitHub Pages — pages render without SSR. Dashboard/auth
// pages opt into client-side auth guards.

const inter = localFont({
  src: [
    { path: '../../public/fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Inter-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://codingwithbashir.github.io/CodingWithbashir_'
  ),
  title: {
    default: 'CodingWithBashir — Learn to Code, Build Projects & Earn Certificates',
    template: '%s | CodingWithBashir',
  },
  description:
    'CodingWithBashir offers 100% free web-development courses, hands-on projects, and verifiable certificates. Learn Python, JavaScript, React, Next.js, and more.',
  keywords: [
    'CodingWithBashir',
    'Bashir',
    'Learn to Code',
    'Free Coding Courses',
    'Python',
    'JavaScript',
    'React',
    'Next.js',
    'Web Development',
    'Verified Certificates',
  ],
  authors: [{ name: 'CodingWithBashir' }],
  creator: 'CodingWithBashir',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'CodingWithBashir',
    title: 'CodingWithBashir — Learn to Code, Build Projects & Earn Certificates',
    description:
      'Free modern web-development courses, hands-on projects, and verifiable certificates.',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodingWithBashir — Learn to Code, Build Projects & Earn Certificates',
    description:
      'Free modern web-development courses, hands-on projects, and verifiable certificates.',
    creator: '@codingwithbashir',
    images: ['/og/default.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.svg`,
    shortcut: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.svg`,
    apple: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.svg`,
  },
}

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>
          <WebSiteJsonLd />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>
          {children}
          <Toaster position="bottom-right" theme="dark" richColors />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
