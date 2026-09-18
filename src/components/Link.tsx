'use client'

import NextLink from 'next/link'
import type { LinkProps as NextLinkProps } from 'next/link'
import { forwardRef } from 'react'
import { withBase } from '@/lib/utils/base-path'

export type LinkProps = NextLinkProps & {
  children?: React.ReactNode
  className?: string
  target?: string
  rel?: string
  'aria-label'?: string
  title?: string
}

/**
 * Site Link that automatically prefixes the GitHub Pages base path so internal
 * href="/foo" works both locally and when deployed to /CodingWithbashir_/.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, ...rest },
  ref
) {
  const finalHref =
    typeof href === 'string' ? withBase(href) : href
  return <NextLink ref={ref} href={finalHref} {...rest} />
})

export default Link
