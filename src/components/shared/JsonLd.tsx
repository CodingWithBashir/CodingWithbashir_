const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codingwithbashir.com'
const SITE_NAME = 'CodingWithBashir'
const SITE_DESC =
  'CodingWithBashir — free web-development courses, hands-on projects, and verifiable certificates.'
const AUTHOR_NAME = 'Bashir (CodingWithBashir)'

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESC,
    author: { '@type': 'Person', name: AUTHOR_NAME },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ProfilePageJsonLd({ name, jobTitle, url, image, sameAs }: {
  name: string; jobTitle: string; url: string; image?: string; sameAs?: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `About ${name}`,
    mainEntity: {
      '@type': 'Person',
      name,
      jobTitle,
      url,
      image,
      sameAs,
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function FAQJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(i => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ItemListJsonLd({ items, type, name }: {
  items: { name: string; url: string; description?: string }[]
  type: string
  name: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((i, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: { '@type': type, name: i.name, url: i.url, description: i.description },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function PersonJsonLd({ name, jobTitle, url, image, sameAs }: {
  name: string; jobTitle: string; url: string; image?: string; sameAs?: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    url,
    image,
    sameAs,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function CourseJsonLd({ name, description, provider, url }: {
  name: string; description: string; provider: string; url: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: { '@type': 'Organization', name: provider || SITE_NAME },
    url,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
