/*
  # Add link fields to hero_slides table

  1. Changes
    - Add `link_type` column to hero_slides (values: 'briefing', 'activity', 'external', or null)
    - Add `link_id` column to hero_slides (uuid reference to briefing or activity)
    - Add `external_link` column to hero_slides (for external URLs)

  2. Purpose
    - Allow hero slides to link to specific briefings or activities
    - Support external links when needed
    - Make hero slides interactive and actionable
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_slides' AND column_name = 'link_type'
  ) THEN
    ALTER TABLE hero_slides ADD COLUMN link_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_slides' AND column_name = 'link_id'
  ) THEN
    ALTER TABLE hero_slides ADD COLUMN link_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_slides' AND column_name = 'external_link'
  ) THEN
    ALTER TABLE hero_slides ADD COLUMN external_link text;
  END IF;
END $$;

COMMENT ON COLUMN hero_slides.link_type IS 'Type of link: briefing, activity, external, or null for no link';
COMMENT ON COLUMN hero_slides.link_id IS 'UUID reference to briefing or activity when link_type is briefing or activity';
COMMENT ON COLUMN hero_slides.external_link IS 'External URL when link_type is external';
