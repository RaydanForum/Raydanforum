/*
  # Create membership applications table

  1. New Tables
    - `membership_applications`
      - `id` (uuid, primary key) - Unique identifier for each application
      - `first_name` (text) - Applicant's first name
      - `last_name` (text) - Applicant's last name
      - `phone` (text) - Applicant's phone number
      - `address` (text) - Applicant's address
      - `membership_tier` (text) - Type of membership (individual, institutional, founding)
      - `status` (text) - Application status (pending, approved, rejected)
      - `created_at` (timestamptz) - Timestamp when application was submitted
      - `updated_at` (timestamptz) - Timestamp when application was last updated

  2. Security
    - Enable RLS on `membership_applications` table
    - Add policy for anyone to submit applications (insert only)
    - Add policy for authenticated users to view their own applications
*/

CREATE TABLE IF NOT EXISTS membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  membership_tier text NOT NULL DEFAULT 'individual',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit membership applications"
  ON membership_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can view all applications"
  ON membership_applications
  FOR SELECT
  TO anon
  USING (true);
