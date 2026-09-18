import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codingwithbashir.com'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin-control', '/api', '/dashboard'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
