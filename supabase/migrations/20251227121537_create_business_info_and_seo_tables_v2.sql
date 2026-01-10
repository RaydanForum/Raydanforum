/*
  # Create Business Info and SEO Tables

  1. New Tables
    - `business_info`
      - `id` (uuid, primary key)
      - `business_name` (text) - Official business name
      - `business_name_ar` (text) - Arabic business name
      - `address` (text) - Street address
      - `address_ar` (text) - Arabic street address
      - `city` (text) - City name
      - `city_ar` (text) - Arabic city name
      - `state` (text) - State/Province
      - `state_ar` (text) - Arabic state/province
      - `country` (text) - Country
      - `country_ar` (text) - Arabic country
      - `postal_code` (text) - Postal/ZIP code
      - `phone` (text) - Primary phone number
      - `phone_secondary` (text) - Secondary phone number
      - `email` (text) - Primary email
      - `latitude` (numeric) - GPS latitude
      - `longitude` (numeric) - GPS longitude
      - `business_hours` (jsonb) - Opening hours structure
      - `founded_year` (integer) - Year founded
      - `description` (text) - Business description
      - `description_ar` (text) - Arabic business description
      - `keywords` (text[]) - SEO keywords
      - `social_media` (jsonb) - Social media links
      - `google_business_profile_url` (text) - Google Business Profile link
      - `updated_at` (timestamptz)
      
    - `seo_metadata`
      - `id` (uuid, primary key)
      - `page_path` (text, unique) - URL path
      - `title` (text) - Page title
      - `title_ar` (text) - Arabic page title
      - `description` (text) - Meta description
      - `description_ar` (text) - Arabic meta description
      - `keywords` (text[]) - Page-specific keywords
      - `og_image` (text) - Open Graph image URL
      - `schema_type` (text) - Schema.org type
      - `additional_schema` (jsonb) - Additional structured data
      - `canonical_url` (text) - Canonical URL
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access for business_info (single row)
    - Public read access for seo_metadata
    - Admin-only write access for both tables

  3. Important Notes
    - Business info should have only one active row
    - SEO metadata is per-page configuration
    - Structured data supports Schema.org JSON-LD format
*/

-- Create business_info table
CREATE TABLE IF NOT EXISTS business_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL DEFAULT 'Raydan Forum',
  business_name_ar text NOT NULL DEFAULT 'منتدى ريدان للعلاقات الاستراتيجية',
  address text NOT NULL DEFAULT '',
  address_ar text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  city_ar text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  state_ar text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT 'Saudi Arabia',
  country_ar text NOT NULL DEFAULT 'المملكة العربية السعودية',
  postal_code text DEFAULT '',
  phone text NOT NULL DEFAULT '',
  phone_secondary text DEFAULT '',
  email text NOT NULL DEFAULT 'info@raydanforum.org',
  latitude numeric,
  longitude numeric,
  business_hours jsonb DEFAULT '{"monday": {"open": "09:00", "close": "17:00", "closed": false}, "tuesday": {"open": "09:00", "close": "17:00", "closed": false}, "wednesday": {"open": "09:00", "close": "17:00", "closed": false}, "thursday": {"open": "09:00", "close": "17:00", "closed": false}, "friday": {"open": "09:00", "close": "17:00", "closed": false}, "saturday": {"open": "09:00", "close": "17:00", "closed": true}, "sunday": {"open": "09:00", "close": "17:00", "closed": true}}'::jsonb,
  founded_year integer DEFAULT 2024,
  description text DEFAULT 'Strategic Relations Think Tank',
  description_ar text DEFAULT 'مركز بحثي متخصص في العلاقات الاستراتيجية',
  keywords text[] DEFAULT ARRAY['strategic relations', 'think tank', 'research', 'analysis']::text[],
  social_media jsonb DEFAULT '{}'::jsonb,
  google_business_profile_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Create seo_metadata table
CREATE TABLE IF NOT EXISTS seo_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text UNIQUE NOT NULL,
  title text NOT NULL,
  title_ar text NOT NULL,
  description text NOT NULL,
  description_ar text NOT NULL,
  keywords text[] DEFAULT ARRAY[]::text[],
  og_image text DEFAULT '',
  schema_type text DEFAULT 'WebPage',
  additional_schema jsonb DEFAULT '{}'::jsonb,
  canonical_url text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- Public read access for business_info
CREATE POLICY "Anyone can read business info"
  ON business_info FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write access for business_info
CREATE POLICY "Admins can insert business info"
  ON business_info FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'editor')
    )
  );

CREATE POLICY "Admins can update business info"
  ON business_info FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'editor')
    )
  );

-- Public read access for seo_metadata
CREATE POLICY "Anyone can read SEO metadata"
  ON seo_metadata FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write access for seo_metadata
CREATE POLICY "Admins can insert SEO metadata"
  ON seo_metadata FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'editor')
    )
  );

CREATE POLICY "Admins can update SEO metadata"
  ON seo_metadata FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete SEO metadata"
  ON seo_metadata FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role IN ('super_admin', 'editor')
    )
  );

-- Insert default business info
INSERT INTO business_info (
  business_name,
  business_name_ar,
  email,
  description,
  description_ar
) VALUES (
  'Raydan Forum',
  'منتدى ريدان للعلاقات الاستراتيجية',
  'info@raydanforum.org',
  'A leading think tank focused on strategic relations and international affairs',
  'مركز بحثي رائد متخصص في العلاقات الاستراتيجية والشؤون الدولية'
) ON CONFLICT DO NOTHING;

-- Insert default SEO metadata for main pages
INSERT INTO seo_metadata (page_path, title, title_ar, description, description_ar, schema_type) VALUES
  ('/', 'Raydan Forum - Strategic Relations Think Tank', 'منتدى ريدان - مركز العلاقات الاستراتيجية', 'Leading think tank specializing in strategic relations, research, and international affairs analysis', 'مركز بحثي رائد متخصص في العلاقات الاستراتيجية والبحوث وتحليل الشؤون الدولية', 'Organization'),
  ('/about', 'About Us - Raydan Forum', 'من نحن - منتدى ريدان', 'Learn about Raydan Forum, our mission, vision, and team dedicated to strategic research', 'تعرف على منتدى ريدان ورسالتنا ورؤيتنا وفريقنا المتفاني للبحث الاستراتيجي', 'AboutPage'),
  ('/briefings', 'Briefings - Raydan Forum', 'الإحاطات - منتدى ريدان', 'Expert briefings and analysis on strategic issues and international relations', 'إحاطات وتحليلات خبراء حول القضايا الاستراتيجية والعلاقات الدولية', 'CollectionPage'),
  ('/activities', 'Activities - Raydan Forum', 'الأنشطة - منتدى ريدان', 'Discover our events, workshops, and research activities', 'اكتشف فعالياتنا وورش العمل والأنشطة البحثية', 'CollectionPage'),
  ('/membership', 'Membership - Raydan Forum', 'العضوية - منتدى ريدان', 'Join Raydan Forum and be part of strategic research community', 'انضم إلى منتدى ريدان وكن جزءًا من مجتمع البحث الاستراتيجي', 'WebPage')
ON CONFLICT (page_path) DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_business_info_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_seo_metadata_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_business_info_timestamp_trigger ON business_info;
CREATE TRIGGER update_business_info_timestamp_trigger
  BEFORE UPDATE ON business_info
  FOR EACH ROW
  EXECUTE FUNCTION update_business_info_timestamp();

DROP TRIGGER IF EXISTS update_seo_metadata_timestamp_trigger ON seo_metadata;
CREATE TRIGGER update_seo_metadata_timestamp_trigger
  BEFORE UPDATE ON seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_metadata_timestamp();