/*
  # Fix venues table RLS policies

  1. Changes
    - Drop all existing policies to start fresh
    - Create new policies with proper access controls
    - Add specific policy for default venue creation
    - Ensure proper column mapping between frontend and database

  2. Security
    - Enable RLS on venues table
    - Add policies for authenticated users
    - Add policy for service role access
    - Add specific policy for default venue creation

  3. Notes
    - Default venue ID: 123e4567-e89b-12d3-a456-426614174000
    - All authenticated users can read venues
    - Only specific venue ID can be created initially
    - Updates and deletes are restricted to authenticated users
*/

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow default venue creation" ON venues;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON venues;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON venues;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON venues;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON venues;
DROP POLICY IF EXISTS "Enable full access for service role" ON venues;

-- Ensure RLS is enabled
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Create policy for default venue creation
CREATE POLICY "Allow default venue creation"
ON venues
FOR INSERT
TO authenticated
WITH CHECK (
  id = '123e4567-e89b-12d3-a456-426614174000'::uuid
);

-- Create policy for reading venues
CREATE POLICY "Enable read access for authenticated users"
ON venues
FOR SELECT
TO authenticated
USING (true);

-- Create policy for updating venues
CREATE POLICY "Enable update for authenticated users"
ON venues
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy for deleting venues
CREATE POLICY "Enable delete for authenticated users"
ON venues
FOR DELETE
TO authenticated
USING (true);

-- Create policy for service role (full access)
CREATE POLICY "Enable full access for service role"
ON venues
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Insert or update the default venue
INSERT INTO venues (
  id,
  name,
  logo_url,
  primary_color,
  secondary_color,
  contact_email
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Polaroid Booth',
  'https://cdn-icons-png.flaticon.com/512/3004/3004613.png',
  '#3498db',
  '#e91e63',
  'contact@polaroidbooth.com'
)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  logo_url = EXCLUDED.logo_url,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  contact_email = EXCLUDED.contact_email;