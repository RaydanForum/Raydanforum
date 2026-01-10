/*
  # Allow Empty Images for Hero Slides

  ## Overview
  Allows hero slides to be created without an image initially, so admins can upload
  their own images after creating the slide.

  ## Changes
  1. Changes
    - Modify `hero_slides.image_url` column to allow empty strings
    - Remove NOT NULL constraint from `image_url` column

  ## Security
    - No changes to RLS policies
    - Existing admin permissions remain unchanged

  ## Notes
    - This allows admins to create hero slides and then upload their preferred images
    - Empty image_url will be handled gracefully in the UI with a placeholder
*/

-- Allow image_url to be NULL or empty
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'hero_slides' 
    AND column_name = 'image_url'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE hero_slides ALTER COLUMN image_url DROP NOT NULL;
  END IF;
END $$;