/*
  # Update Articles and Comments Tables

  ## Overview
  This migration adds missing fields to the articles and comments tables
  to support better content management.

  ## Changes

  ### 1. Articles Table Updates
  - Add `section_id` (uuid, foreign key to sections)
  - Add `is_published` (boolean) - Publication status
  - Add `view_count` alias for compatibility

  ### 2. Comments Table Updates
  - Add `parent_id` (uuid, foreign key to comments) - For nested comments

  ### 3. Update Policies
  - Update policies to support new fields
*/

-- Add section_id to articles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'section_id'
  ) THEN
    ALTER TABLE articles ADD COLUMN section_id uuid REFERENCES sections(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add is_published to articles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE articles ADD COLUMN is_published boolean DEFAULT false;
  END IF;
END $$;

-- Add published_at if it doesn't exist (it should already exist but just in case)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE articles ADD COLUMN published_at timestamptz;
  END IF;
END $$;

-- Create view_count column as alias if needed (views_count already exists)
-- No action needed, we'll use views_count

-- Add parent_id to comments for nested comments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comments' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE comments ADD COLUMN parent_id uuid REFERENCES comments(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for section_id on articles
CREATE INDEX IF NOT EXISTS idx_articles_section_id ON articles(section_id);

-- Create index for parent_id on comments
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- Update published_at for already published articles
UPDATE articles
SET published_at = created_at
WHERE published_at IS NULL AND is_published = true;

-- Drop existing policies on articles to recreate them with better logic
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON articles;
DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
DROP POLICY IF EXISTS "Admins can update articles" ON articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON articles;

-- Recreate articles policies with better logic
CREATE POLICY "Anyone can view published articles"
  ON articles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all articles"
  ON articles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Update sections policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'sections' AND policyname = 'Anyone can view active sections'
  ) THEN
    CREATE POLICY "Anyone can view active sections"
      ON sections FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'sections' AND policyname = 'Admins can manage sections'
  ) THEN
    CREATE POLICY "Admins can manage sections"
      ON sections FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admins
          WHERE admins.id = auth.uid()
          AND admins.is_active = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admins
          WHERE admins.id = auth.uid()
          AND admins.is_active = true
        )
      );
  END IF;
END $$;

-- Update categories policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'categories' AND policyname = 'Anyone can view active categories'
  ) THEN
    CREATE POLICY "Anyone can view active categories"
      ON categories FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'categories' AND policyname = 'Admins can manage categories'
  ) THEN
    CREATE POLICY "Admins can manage categories"
      ON categories FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admins
          WHERE admins.id = auth.uid()
          AND admins.is_active = true
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admins
          WHERE admins.id = auth.uid()
          AND admins.is_active = true
        )
      );
  END IF;
END $$;