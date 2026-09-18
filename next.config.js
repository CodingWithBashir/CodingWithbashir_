/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/CodingWithbashir_'
const USE_CUSTOM_DOMAIN = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN === 'true'
const basePath = USE_CUSTOM_DOMAIN ? '' : BASE_PATH

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: 'export',
  distDir: 'docs',
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react-syntax-highlighter', 'simple-icons'],
  },
}

module.exports = nextConfig
