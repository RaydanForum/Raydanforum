export interface BusinessInfo {
  id: string;
  business_name: string;
  business_name_ar: string;
  address: string;
  address_ar: string;
  city: string;
  city_ar: string;
  state: string;
  state_ar: string;
  country: string;
  country_ar: string;
  postal_code: string;
  phone: string;
  phone_secondary?: string;
  email: string;
  latitude?: number;
  longitude?: number;
  business_hours: BusinessHours;
  founded_year: number;
  description: string;
  description_ar: string;
  keywords: string[];
  social_media: Record<string, string>;
  google_business_profile_url?: string;
  updated_at: string;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface SEOMetadata {
  id: string;
  page_path: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  keywords: string[];
  og_image?: string;
  schema_type: string;
  additional_schema: Record<string, unknown>;
  canonical_url?: string;
  updated_at: string;
}

export function generateLocalBusinessSchema(
  businessInfo: BusinessInfo,
  language: 'en' | 'ar' = 'en'
) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: language === 'ar' ? businessInfo.business_name_ar : businessInfo.business_name,
    description: language === 'ar' ? businessInfo.description_ar : businessInfo.description,
    email: businessInfo.email,
    telephone: businessInfo.phone,
    foundingDate: businessInfo.founded_year.toString(),
    url: typeof window !== 'undefined' ? window.location.origin : 'https://raydanforum.org',
  };

  if (businessInfo.address && businessInfo.city) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: language === 'ar' ? businessInfo.address_ar : businessInfo.address,
      addressLocality: language === 'ar' ? businessInfo.city_ar : businessInfo.city,
      addressRegion: language === 'ar' ? businessInfo.state_ar : businessInfo.state,
      postalCode: businessInfo.postal_code,
      addressCountry: language === 'ar' ? businessInfo.country_ar : businessInfo.country,
    };
  }

  if (businessInfo.latitude && businessInfo.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: businessInfo.latitude,
      longitude: businessInfo.longitude,
    };
  }

  if (businessInfo.business_hours) {
    const openingHours: string[] = [];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayAbbrev = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    days.forEach((day, index) => {
      const hours = businessInfo.business_hours[day as keyof BusinessHours];
      if (hours && !hours.closed) {
        openingHours.push(`${dayAbbrev[index]} ${hours.open}-${hours.close}`);
      }
    });

    if (openingHours.length > 0) {
      schema.openingHours = openingHours;
    }
  }

  if (Object.keys(businessInfo.social_media).length > 0) {
    schema.sameAs = Object.values(businessInfo.social_media).filter(Boolean);
  }

  return schema;
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  author: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Raydan Forum',
      logo: {
        '@type': 'ImageObject',
        url: typeof window !== 'undefined' ? `${window.location.origin}/raydan-logo.png` : 'https://raydanforum.org/raydan-logo.png',
      },
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
  };
}

export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
    },
    image: event.image,
    organizer: {
      '@type': 'Organization',
      name: 'Raydan Forum',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://raydanforum.org',
    },
  };
}

export function generateWebPageSchema(page: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: page.url,
    publisher: {
      '@type': 'Organization',
      name: 'Raydan Forum',
    },
  };
}

export function formatNAP(businessInfo: BusinessInfo, language: 'en' | 'ar' = 'en'): string {
  const parts: string[] = [];

  if (businessInfo.address) {
    parts.push(language === 'ar' ? businessInfo.address_ar : businessInfo.address);
  }

  const cityState: string[] = [];
  if (businessInfo.city) {
    cityState.push(language === 'ar' ? businessInfo.city_ar : businessInfo.city);
  }
  if (businessInfo.state) {
    cityState.push(language === 'ar' ? businessInfo.state_ar : businessInfo.state);
  }
  if (cityState.length > 0) {
    parts.push(cityState.join(', '));
  }

  if (businessInfo.postal_code) {
    parts.push(businessInfo.postal_code);
  }

  if (businessInfo.country) {
    parts.push(language === 'ar' ? businessInfo.country_ar : businessInfo.country);
  }

  return parts.join(', ');
}
