interface SiteSettings {
  businessName: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  operatingHours: Array<{ day: string; open: string; close: string }>
  licenseNumber: string
  socialLinks?: {
    google?: string
    facebook?: string
    instagram?: string
  }
}

interface ServiceData {
  title: string
  slug: string
  tagline: string
  overview?: string
}

interface FAQItem {
  question: string
  answer: string
}

interface ArticleData {
  headline: string
  author: string
  publishDate: string
  image?: string
  description: string
  url: string
}

interface Coordinates {
  lat: number
  lng: number
}

const DAY_MAP: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
}

function formatHours(hours: SiteSettings['operatingHours']) {
  return hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: DAY_MAP[h.day] || h.day,
    opens: h.open,
    closes: h.close,
  }))
}

export function generateOrganizationSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.businessName,
    url: 'https://basescapeutah.com',
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      addressRegion: settings.address.state,
      postalCode: settings.address.zip,
      addressCountry: 'US',
    },
    ...(settings.socialLinks && {
      sameAs: [
        settings.socialLinks.google,
        settings.socialLinks.facebook,
        settings.socialLinks.instagram,
      ].filter(Boolean),
    }),
  }
}

export function generateLocalBusinessSchema(
  settings: SiteSettings,
  options?: {
    aggregateRating?: { ratingValue: number; reviewCount: number }
    coordinates?: Coordinates
    serviceRadius?: number
    servicesOffered?: string[]
  },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: settings.businessName,
    url: 'https://basescapeutah.com',
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      addressRegion: settings.address.state,
      postalCode: settings.address.zip,
      addressCountry: 'US',
    },
    openingHoursSpecification: formatHours(settings.operatingHours),
    ...(options?.coordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: options.coordinates.lat,
        longitude: options.coordinates.lng,
      },
    }),
    ...(options?.serviceRadius && {
      areaServed: {
        '@type': 'GeoCircle',
        geoMidpoint: options.coordinates
          ? {
              '@type': 'GeoCoordinates',
              latitude: options.coordinates.lat,
              longitude: options.coordinates.lng,
            }
          : undefined,
        geoRadius: `${options.serviceRadius} mi`,
      },
    }),
    ...(options?.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: options.aggregateRating.ratingValue,
        reviewCount: options.aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(options?.servicesOffered && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'BaseScape Services',
        itemListElement: options.servicesOffered.map((service) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service },
        })),
      },
    }),
  }
}

export function generateServiceSchema(service: ServiceData, settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.tagline,
    url: `https://basescapeutah.com/services/${service.slug}`,
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: settings.businessName,
      telephone: settings.phone,
    },
    areaServed: {
      '@type': 'State',
      name: 'Utah',
    },
  }
}

export function generateFAQPageSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateArticleSchema(article: ArticleData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    author: {
      '@type': 'Organization',
      name: 'BaseScape',
    },
    datePublished: article.publishDate,
    ...(article.image && { image: article.image }),
    description: article.description,
    url: article.url,
    publisher: {
      '@type': 'Organization',
      name: 'BaseScape',
      url: 'https://basescapeutah.com',
    },
  }
}
