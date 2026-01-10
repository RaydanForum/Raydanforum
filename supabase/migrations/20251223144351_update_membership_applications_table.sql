/*
  # Update Membership Applications Table

  ## Overview
  This migration adds missing fields to the membership_applications table
  to capture complete applicant information.

  ## Changes

  ### 1. Add Missing Fields
  - `email` (text) - Applicant's email address
  - `nationality` (text) - Applicant's nationality
  - `date_of_birth` (date) - Applicant's date of birth
  - `gender` (text) - Applicant's gender
  - `organization` (text) - Organization name (for organizational memberships)
  - `position` (text) - Position in organization
  - `linkedin_url` (text) - LinkedIn profile URL
  - `website_url` (text) - Personal or organization website
  - `areas_of_interest` (text[]) - Areas of interest
  - `motivation` (text) - Motivation for joining
  - `how_heard` (text) - How they heard about Raydan
  - `cv_url` (text) - CV/Resume file URL
  - `admin_notes` (text) - Notes from admin review
  - `reviewed_by` (uuid) - Admin who reviewed the application
  - `reviewed_at` (timestamptz) - When the application was reviewed

  ### 2. Update Constraints
  - Add check constraint for gender
  - Add check constraint for status
*/

-- Add email field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'email'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN email text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Add nationality field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'nationality'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN nationality text DEFAULT '';
  END IF;
END $$;

-- Add date_of_birth field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN date_of_birth date;
  END IF;
END $$;

-- Add gender field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'gender'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));
  END IF;
END $$;

-- Add organization field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'organization'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN organization text DEFAULT '';
  END IF;
END $$;

-- Add position field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'position'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN position text DEFAULT '';
  END IF;
END $$;

-- Add linkedin_url field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'linkedin_url'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN linkedin_url text DEFAULT '';
  END IF;
END $$;

-- Add website_url field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN website_url text DEFAULT '';
  END IF;
END $$;

-- Add areas_of_interest field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'areas_of_interest'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN areas_of_interest text[] DEFAULT '{}';
  END IF;
END $$;

-- Add motivation field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'motivation'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN motivation text DEFAULT '';
  END IF;
END $$;

-- Add how_heard field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'how_heard'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN how_heard text DEFAULT '';
  END IF;
END $$;

-- Add cv_url field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'cv_url'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN cv_url text DEFAULT '';
  END IF;
END $$;

-- Add admin_notes field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN admin_notes text DEFAULT '';
  END IF;
END $$;

-- Add reviewed_by field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'reviewed_by'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN reviewed_by uuid REFERENCES admins(id);
  END IF;
END $$;

-- Add reviewed_at field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'membership_applications' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE membership_applications ADD COLUMN reviewed_at timestamptz;
  END IF;
END $$;

-- Create index for reviewed applications
CREATE INDEX IF NOT EXISTS idx_membership_applications_reviewed ON membership_applications(reviewed_by, reviewed_at);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_membership_applications_status ON membership_applications(status, created_at DESC);