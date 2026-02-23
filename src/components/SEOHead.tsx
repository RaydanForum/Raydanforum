import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBusinessInfo } from '../hooks/useBusinessInfo';
import { useSEOMetadata } from '../hooks/useSEOMetadata';
import { generateLocalBusinessSchema } from '../lib/seo';

interface SEOHeadProps {
  pagePath: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  structuredData?: Record<string, unknown>[];
}

export default function SEOHead({
  pagePath,
  title,
  description,
  keywords,
  ogImage,
  structuredData = [],
}: SEOHeadProps) {
  const { language } = useLanguage();
  const { businessInfo } = useBusinessInfo();
  const { seoMetadata } = useSEOMetadata(pagePath);

  useEffect(() => {
    const isArabic = language === 'ar';

    const pageTitle = title || (seoMetadata ? (isArabic ? seoMetadata.title_ar : seoMetadata.title) : 'Raydan Forum');
    const pageDescription = description || (seoMetadata ? (isArabic ? seoMetadata.description_ar : seoMetadata.description) : '');
    const pageKeywords = keywords || seoMetadata?.keywords || [];
    const pageOGImage = ogImage || seoMetadata?.og_image || '/raydan-logo.png';

    document.title = pageTitle;

    updateMetaTag('name', 'description', pageDescription);
    updateMetaTag('name', 'keywords', pageKeywords.join(', '));
    updateMetaTag('property', 'og:title', pageTitle);
    updateMetaTag('property', 'og:description', pageDescription);
    updateMetaTag('property', 'og:image', pageOGImage);
    updateMetaTag('property', 'og:url', window.location.href);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:locale', isArabic ? 'ar_SA' : 'en_US');
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', pageTitle);
    updateMetaTag('name', 'twitter:description', pageDescription);
    updateMetaTag('name', 'twitter:image', pageOGImage);

    const canonicalUrl = seoMetadata?.canonical_url || window.location.href.split('?')[0];
    updateLinkTag('canonical', canonicalUrl);

    const schemas: Record<string, unknown>[] = [...structuredData];

    if (businessInfo) {
      schemas.push(generateLocalBusinessSchema(businessInfo, language));
    }

    if (seoMetadata?.additional_schema && Object.keys(seoMetadata.additional_schema).length > 0) {
      schemas.push(seoMetadata.additional_schema);
    }

    schemas.forEach((schema, index) => {
      updateStructuredData(`structured-data-${index}`, schema);
    });

    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach((elem) => {
      const id = elem.getAttribute('id');
      if (id && id.startsWith('structured-data-') && parseInt(id.replace('structured-data-', '')) >= schemas.length) {
        elem.remove();
      }
    });
  }, [pagePath, title, description, keywords, ogImage, language, businessInfo, seoMetadata, structuredData]);

  return null;
}

function updateMetaTag(attribute: string, name: string, content: string) {
  if (!content) return;

  let element = document.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function updateStructuredData(id: string, data: Record<string, unknown>) {
  let script = document.getElementById(id);

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}
