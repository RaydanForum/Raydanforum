/*
  # Hero Slides Management with Image Upload

  ## Overview
  Creates a new table for managing hero slider images with support for file uploads
  to Supabase Storage. This replaces the hardcoded slides in the frontend code.

  ## New Tables

  ### `hero_slides`
  Stores hero slider content with uploaded images
  - `id` (uuid, primary key)
  - `title_ar` (text) - Arabic title
  - `title_en` (text) - English title
  - `description_ar` (text) - Arabic description
  - `description_en` (text) - English description
  - `image_url` (text) - URL to image stored in Supabase Storage
  - `display_order` (integer) - Order of display in slider
  - `is_active` (boolean) - Whether this slide is active
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Storage
  - Creates a `hero-images` bucket for storing uploaded images
  - Public read access for all images
  - Only authenticated admins can upload/delete images

  ## Security
  - Enable RLS on hero_slides table
  - Public can view active slides
  - Only admins can manage slides
  - Storage policies for public read, admin write

  ## Initial Data
  - Migrates the three existing hardcoded slides
*/

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  description_ar text NOT NULL,
  description_en text NOT NULL,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Anyone can view active hero slides"
  ON hero_slides FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admin policies
CREATE POLICY "Admins can manage hero slides"
  ON hero_slides FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM admins WHERE is_active = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM admins WHERE is_active = true));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order ON hero_slides(is_active, display_order);

-- Create storage bucket for hero images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-images',
  'hero-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for hero-images bucket
CREATE POLICY "Anyone can view hero images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'hero-images');

CREATE POLICY "Admins can upload hero images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hero-images' AND
    auth.uid() IN (SELECT id FROM admins WHERE is_active = true)
  );

CREATE POLICY "Admins can update hero images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'hero-images' AND
    auth.uid() IN (SELECT id FROM admins WHERE is_active = true)
  )
  WITH CHECK (
    bucket_id = 'hero-images' AND
    auth.uid() IN (SELECT id FROM admins WHERE is_active = true)
  );

CREATE POLICY "Admins can delete hero images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hero-images' AND
    auth.uid() IN (SELECT id FROM admins WHERE is_active = true)
  );

-- Insert initial slides with the current Pexels images
INSERT INTO hero_slides (title_ar, title_en, description_ar, description_en, image_url, display_order, is_active)
VALUES
  (
    'منتدى ريدان للعلاقات الاستراتيجية',
    'Raydan Forum for Strategic Relations',
    'منصة يمنية مستقلة تُعنى بالعلاقات السياسية والإعلامية والدبلوماسية المجتمعية',
    'An independent Yemeni platform dedicated to political, media, and community diplomatic relations',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920',
    1,
    true
  ),
  (
    'التحليل والبحث الاستراتيجي',
    'Strategic Analysis & Research',
    'تحليل معمق للتطورات الإقليمية وتأثيرها على اليمن والمجتمع الدولي',
    'In-depth analysis of regional developments and their impact on Yemen and the international community',
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1920',
    2,
    true
  ),
  (
    'بناء الجسور، خلق الحوار',
    'Building Bridges, Creating Dialogue',
    'تعزيز التفاهم والتعاون من خلال العلاقات الاستراتيجية والدبلوماسية المجتمعية',
    'Fostering understanding and cooperation through strategic relations and community diplomacy',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
    3,
    true
  );
