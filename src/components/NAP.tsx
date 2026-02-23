import { MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBusinessInfo } from '../hooks/useBusinessInfo';
import { formatNAP } from '../lib/seo';

interface NAPProps {
  variant?: 'default' | 'compact' | 'footer';
  className?: string;
  showIcons?: boolean;
}

export default function NAP({ variant = 'default', className = '', showIcons = true }: NAPProps) {
  const { language } = useLanguage();
  const { businessInfo, loading } = useBusinessInfo();

  if (loading || !businessInfo) return null;

  const isArabic = language === 'ar';
  const businessName = isArabic ? businessInfo.business_name_ar : businessInfo.business_name;
  const addressText = formatNAP(businessInfo, language);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 ${className}`} itemScope itemType="https://schema.org/Organization">
        <meta itemProp="name" content={businessName} />
        {businessInfo.phone && (
          <a
            href={`tel:${businessInfo.phone}`}
            className="flex items-center gap-2 text-sm hover:text-emerald-600 transition"
            itemProp="telephone"
          >
            {showIcons && <Phone className="w-4 h-4" />}
            <span dir="ltr">{businessInfo.phone}</span>
          </a>
        )}
        {businessInfo.email && (
          <a
            href={`mailto:${businessInfo.email}`}
            className="flex items-center gap-2 text-sm hover:text-emerald-600 transition"
            itemProp="email"
          >
            {showIcons && <Mail className="w-4 h-4" />}
            <span>{businessInfo.email}</span>
          </a>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className} itemScope itemType="https://schema.org/Organization">
        <h3 className="text-lg font-semibold mb-4" itemProp="name">{businessName}</h3>
        <div className="space-y-3 text-sm">
          {addressText && (
            <div className="flex items-start gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
              {showIcons && <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <span itemProp="streetAddress">
                {addressText}
              </span>
            </div>
          )}
          {businessInfo.phone && (
            <a
              href={`tel:${businessInfo.phone}`}
              className="flex items-center gap-3 hover:text-emerald-400 transition"
              itemProp="telephone"
            >
              {showIcons && <Phone className="w-5 h-5 flex-shrink-0" />}
              <span dir="ltr">{businessInfo.phone}</span>
            </a>
          )}
          {businessInfo.email && (
            <a
              href={`mailto:${businessInfo.email}`}
              className="flex items-center gap-3 hover:text-emerald-400 transition"
              itemProp="email"
            >
              {showIcons && <Mail className="w-5 h-5 flex-shrink-0" />}
              <span>{businessInfo.email}</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} itemScope itemType="https://schema.org/Organization">
      <h3 className="text-xl font-bold" itemProp="name">{businessName}</h3>
      <div className="space-y-3">
        {addressText && (
          <div className="flex items-start gap-3" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            {showIcons && <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />}
            <div>
              <p className="font-medium text-gray-900">
                {isArabic ? 'العنوان' : 'Address'}
              </p>
              <p className="text-gray-600 mt-1" itemProp="streetAddress">
                {addressText}
              </p>
            </div>
          </div>
        )}
        {businessInfo.phone && (
          <a
            href={`tel:${businessInfo.phone}`}
            className="flex items-start gap-3 hover:text-emerald-600 transition"
            itemProp="telephone"
          >
            {showIcons && <Phone className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />}
            <div>
              <p className="font-medium text-gray-900">
                {isArabic ? 'الهاتف' : 'Phone'}
              </p>
              <p className="text-gray-600 mt-1" dir="ltr">{businessInfo.phone}</p>
            </div>
          </a>
        )}
        {businessInfo.email && (
          <a
            href={`mailto:${businessInfo.email}`}
            className="flex items-start gap-3 hover:text-emerald-600 transition"
            itemProp="email"
          >
            {showIcons && <Mail className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />}
            <div>
              <p className="font-medium text-gray-900">
                {isArabic ? 'البريد الإلكتروني' : 'Email'}
              </p>
              <p className="text-gray-600 mt-1">{businessInfo.email}</p>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
