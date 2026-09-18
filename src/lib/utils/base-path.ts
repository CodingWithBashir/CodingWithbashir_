/**
 * App-wide path helpers.
 *
 * When the site is deployed under a sub-path on GitHub Pages
 * (e.g. /CodingWithbashir_), every in-app link, asset, and redirect
 * MUST be prefixed. When a custom domain is configured (BASE_PATH === '')
 * these helpers become no-ops.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/CodingWithbashir_'

/** Prefix a URL with the base path unless it is external or already anchored. */
export function withBase(path: string): string {
  if (!path) return path
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path
  if (path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) return path
  if (path.startsWith(BASE_PATH)) return path
  if (path === '/') return BASE_PATH + '/'
  return BASE_PATH + (path.startsWith('/') ? path : '/' + path)
}

export function assetUrl(path: string): string {
  if (!path) return path
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path
  if (path.startsWith('/')) return withBase(path)
  return withBase('/' + path)
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (BASE_PATH
    ? `https://codingwithbashir.github.io${BASE_PATH}`
    : 'https://codingwithbashir.is-a.dev')
