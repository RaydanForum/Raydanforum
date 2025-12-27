/*
  # Create Storage Buckets for Images
  
  ## Overview
  This migration creates storage buckets for uploading images and sets up appropriate access policies.
  
  ## Changes
  
  ### 1. Create Storage Buckets
  - `team-photos` - For team member profile photos
  - `activity-images` - For activity featured images
  - `briefing-images` - For briefing featured images
  
  ### 2. Security Policies
  - Allow authenticated admins to upload images
  - Allow public read access to all images
  - Allow authenticated admins to delete images
*/

-- Create team-photos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-photos',
  'team-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create activity-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'activity-images',
  'activity-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create briefing-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'briefing-images',
  'briefing-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for team-photos
CREATE POLICY "Admins can upload team photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'team-photos' AND
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Anyone can view team photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'team-photos');

CREATE POLICY "Admins can delete team photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'team-photos' AND
  auth.uid() IN (SELECT id FROM admins)
);

-- Storage policies for activity-images
CREATE POLICY "Admins can upload activity images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'activity-images' AND
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Anyone can view activity images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'activity-images');

CREATE POLICY "Admins can delete activity images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'activity-images' AND
  auth.uid() IN (SELECT id FROM admins)
);

-- Storage policies for briefing-images
CREATE POLICY "Admins can upload briefing images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'briefing-images' AND
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Anyone can view briefing images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'briefing-images');

CREATE POLICY "Admins can delete briefing images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'briefing-images' AND
  auth.uid() IN (SELECT id FROM admins)
);