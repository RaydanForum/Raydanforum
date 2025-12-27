/*
  # Create Admin Dashboard Tables

  ## Overview
  This migration creates all necessary tables for the Raydan Forum admin dashboard,
  including briefings, activities, team members, values, and admin management.

  ## New Tables
  
  ### 1. `briefings`
  Political and policy briefings/research papers
  - `id` (uuid, primary key)
  - `title_ar` (text) - Arabic title
  - `title_en` (text) - English title
  - `content_ar` (text) - Full Arabic content
  - `content_en` (text) - Full English content
  - `excerpt_ar` (text) - Arabic summary/excerpt
  - `excerpt_en` (text) - English summary/excerpt
  - `author_ar` (text) - Arabic author name
  - `author_en` (text) - English author name
  - `category_ar` (text) - Arabic category (e.g., "سياسي", "اقتصادي")
  - `category_en` (text) - English category (e.g., "Political", "Economic")
  - `featured_image` (text) - URL to cover image
  - `pdf_url` (text, nullable) - URL to downloadable PDF
  - `is_featured` (boolean) - Whether to show on homepage
  - `views_count` (integer) - Number of views
  - `published_at` (timestamptz) - Publication date
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `activities`
  Events, workshops, conferences, etc.
  - `id` (uuid, primary key)
  - `title_ar` (text) - Arabic title
  - `title_en` (text) - English title
  - `description_ar` (text) - Arabic description
  - `description_en` (text) - English description
  - `activity_type_ar` (text) - Arabic type (e.g., "ورشة عمل", "مؤتمر")
  - `activity_type_en` (text) - English type (e.g., "Workshop", "Conference")
  - `location_ar` (text) - Arabic location
  - `location_en` (text) - English location
  - `featured_image` (text) - Activity image URL
  - `start_date` (timestamptz) - Start date and time
  - `end_date` (timestamptz, nullable) - End date and time
  - `is_upcoming` (boolean) - Whether activity is upcoming
  - `registration_link` (text, nullable) - External registration URL
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `team_members`
  Organization team members and leadership
  - `id` (uuid, primary key)
  - `name_ar` (text) - Arabic full name
  - `name_en` (text) - English full name
  - `position_ar` (text) - Arabic job title/position
  - `position_en` (text) - English job title/position
  - `bio_ar` (text) - Arabic biography
  - `bio_en` (text) - English biography
  - `photo_url` (text) - Profile photo URL
  - `email` (text, nullable) - Contact email
  - `linkedin_url` (text, nullable) - LinkedIn profile
  - `twitter_url` (text, nullable) - Twitter/X profile
  - `display_order` (integer) - Order for display (lower numbers first)
  - `is_leadership` (boolean) - Whether member is in leadership team
  - `is_active` (boolean) - Whether to show on website
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `organization_values`
  Organization's mission, vision, values
  - `id` (uuid, primary key)
  - `type` (text) - Type: 'mission', 'vision', or 'value'
  - `title_ar` (text) - Arabic title
  - `title_en` (text) - English title
  - `content_ar` (text) - Arabic content
  - `content_en` (text) - English content
  - `icon` (text, nullable) - Icon name (for values)
  - `display_order` (integer) - Order for display
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. `admins`
  Admin users management (extends auth.users)
  - `id` (uuid, primary key, references auth.users)
  - `email` (text) - Admin email
  - `full_name` (text) - Full name
  - `role` (text) - Admin role: 'super_admin' or 'editor'
  - `is_active` (boolean) - Whether admin is active
  - `last_login_at` (timestamptz, nullable) - Last login timestamp
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Only authenticated admins can view/modify data
  - Each table has restrictive policies checking admin status

  ## Important Notes
  1. All text content fields support both Arabic and English
  2. Timestamps use `timestamptz` for proper timezone handling
  3. Default values are set for booleans and timestamps
  4. All tables are protected by Row Level Security
  5. Admin verification is done through the `admins` table
*/

-- Create briefings table
CREATE TABLE IF NOT EXISTS briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text NOT NULL,
  content_en text NOT NULL,
  excerpt_ar text NOT NULL,
  excerpt_en text NOT NULL,
  author_ar text NOT NULL,
  author_en text NOT NULL,
  category_ar text NOT NULL,
  category_en text NOT NULL,
  featured_image text NOT NULL,
  pdf_url text,
  is_featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  description_ar text NOT NULL,
  description_en text NOT NULL,
  activity_type_ar text NOT NULL,
  activity_type_en text NOT NULL,
  location_ar text NOT NULL,
  location_en text NOT NULL,
  featured_image text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  is_upcoming boolean DEFAULT true,
  registration_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  position_ar text NOT NULL,
  position_en text NOT NULL,
  bio_ar text NOT NULL,
  bio_en text NOT NULL,
  photo_url text NOT NULL,
  email text,
  linkedin_url text,
  twitter_url text,
  display_order integer DEFAULT 0,
  is_leadership boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create organization_values table
CREATE TABLE IF NOT EXISTS organization_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('mission', 'vision', 'value')),
  title_ar text NOT NULL,
  title_en text NOT NULL,
  content_ar text NOT NULL,
  content_en text NOT NULL,
  icon text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('super_admin', 'editor')) DEFAULT 'editor',
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for briefings
CREATE POLICY "Anyone can view published briefings"
  ON briefings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert briefings"
  ON briefings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Only admins can update briefings"
  ON briefings FOR UPDATE
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

CREATE POLICY "Only admins can delete briefings"
  ON briefings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Create RLS Policies for activities
CREATE POLICY "Anyone can view activities"
  ON activities FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Only admins can update activities"
  ON activities FOR UPDATE
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

CREATE POLICY "Only admins can delete activities"
  ON activities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Create RLS Policies for team_members
CREATE POLICY "Anyone can view active team members"
  ON team_members FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Only admins can update team members"
  ON team_members FOR UPDATE
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

CREATE POLICY "Only admins can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Create RLS Policies for organization_values
CREATE POLICY "Anyone can view organization values"
  ON organization_values FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert organization values"
  ON organization_values FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Only admins can update organization values"
  ON organization_values FOR UPDATE
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

CREATE POLICY "Only admins can delete organization values"
  ON organization_values FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

-- Create RLS Policies for admins
CREATE POLICY "Admins can view all admins"
  ON admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.is_active = true
    )
  );

CREATE POLICY "Only super admins can insert admins"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role = 'super_admin'
      AND admins.is_active = true
    )
  );

CREATE POLICY "Only super admins can update admins"
  ON admins FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role = 'super_admin'
      AND admins.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role = 'super_admin'
      AND admins.is_active = true
    )
  );

CREATE POLICY "Only super admins can delete admins"
  ON admins FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
      AND admins.role = 'super_admin'
      AND admins.is_active = true
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_briefings_published_at ON briefings(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefings_is_featured ON briefings(is_featured);
CREATE INDEX IF NOT EXISTS idx_activities_start_date ON activities(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_is_upcoming ON activities(is_upcoming);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_is_leadership ON team_members(is_leadership);
CREATE INDEX IF NOT EXISTS idx_organization_values_type ON organization_values(type);
CREATE INDEX IF NOT EXISTS idx_organization_values_display_order ON organization_values(display_order);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_briefings_updated_at
  BEFORE UPDATE ON briefings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_values_updated_at
  BEFORE UPDATE ON organization_values
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();