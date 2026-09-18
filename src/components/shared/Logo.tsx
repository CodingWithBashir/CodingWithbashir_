import { cn } from '@/lib/utils/cn'

interface LogoProps {
  className?: string
}

/** CodingWithBashir "CB" monogram (violet → fuchsia gradient). */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn('h-8 w-8', className)}
    >
      <defs>
        <linearGradient id="cbg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#cbg)" />
      <g
        stroke="#ffffff"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* C */}
        <path d="M19 16.5a7 7 0 1 0 0 15" />
        {/* B */}
        <path d="M27 13.5v21" />
        <path d="M27 13.5h5a4.5 4.5 0 0 1 0 9h-5" />
        <path d="M27 22.5h5.5a4.75 4.75 0 0 1 0 9.5H27" />
      </g>
    </svg>
  )
}
