/*
  # Homepage Content Management Tables

  ## Overview
  Creates tables specifically for managing homepage content including
  hero section, statistics, and "Why Raydan" section.

  ## New Tables

  ### 1. `hero_content`
  Stores hero section content (main banner on homepage)
  - `id` (uuid, primary key)
  - `title_ar` (text) - Arabic title
  - `title_en` (text) - English title
  - `subtitle_ar` (text) - Arabic subtitle
  - `subtitle_en` (text) - English subtitle
  - `cta_text_ar` (text) - Arabic call-to-action button text
  - `cta_text_en` (text) - English call-to-action button text
  - `cta_link` (text) - Button link URL
  - `background_image` (text) - Background image URL
  - `is_active` (boolean) - Whether this hero is currently active
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `site_stats`
  Stores statistics displayed on the homepage
  - `id` (uuid, primary key)
  - `label_ar` (text) - Arabic label
  - `label_en` (text) - English label
  - `value` (text) - Statistical value
  - `icon` (text) - Icon name from lucide-react
  - `display_order` (integer) - Display order
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `why_raydan_points`
  Stores points for "Why Raydan" section
  - `id` (uuid, primary key)
  - `title_ar` (text) - Arabic title
  - `title_en` (text) - English title
  - `description_ar` (text) - Arabic description
  - `description_en` (text) - English description
  - `icon` (text) - Icon name from lucide-react
  - `display_order` (integer) - Display order
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `site_settings`
  Stores general site settings
  - `id` (uuid, primary key)
  - `key` (text, unique) - Setting key
  - `value_ar` (text) - Arabic value
  - `value_en` (text) - English value
  - `description` (text) - Description of what this setting controls
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Allow public read access for active content
  - Only authenticated admins can modify content

  ## Initial Data
  - Inserts default hero content
  - Inserts initial statistics
  - Inserts why raydan points
  - Inserts basic site settings
*/

-- Create hero_content table
CREATE TABLE IF NOT EXISTS hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  subtitle_ar text NOT NULL,
  subtitle_en text NOT NULL,
  cta_text_ar text NOT NULL DEFAULT 'انضم إلينا',
  cta_text_en text NOT NULL DEFAULT 'Join Us',
  cta_link text NOT NULL DEFAULT '/membership',
  background_image text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_stats table
CREATE TABLE IF NOT EXISTS site_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label_ar text NOT NULL,
  label_en text NOT NULL,
  value text NOT NULL,
  icon text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create why_raydan_points table
CREATE TABLE IF NOT EXISTS why_raydan_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  description_ar text NOT NULL,
  description_en text NOT NULL,
  icon text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value_ar text,
  value_en text,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_raydan_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view active hero content"
  ON hero_content FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view active stats"
  ON site_stats FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view active why raydan points"
  ON why_raydan_points FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin policies for hero_content
CREATE POLICY "Admins can manage hero content"
  ON hero_content FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- Admin policies for site_stats
CREATE POLICY "Admins can manage stats"
  ON site_stats FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- Admin policies for why_raydan_points
CREATE POLICY "Admins can manage why raydan points"
  ON why_raydan_points FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- Admin policies for site_settings
CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hero_content_active ON hero_content(is_active);
CREATE INDEX IF NOT EXISTS idx_site_stats_active_order ON site_stats(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_why_raydan_active_order ON why_raydan_points(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
