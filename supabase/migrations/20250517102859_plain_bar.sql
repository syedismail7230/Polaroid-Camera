/*
  # Update venues RLS policies

  1. Changes
    - Add policy to allow creation of default venue
    - Add policy to allow authenticated users to manage their venues
  
  2. Security
    - Enable RLS on venues table (already enabled)
    - Add policy for default venue creation
    - Update existing policies for better security
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON venues;
DROP POLICY IF EXISTS "Enable full access for service role" ON venues;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON venues;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON venues;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON venues;

-- Create new policies
CREATE POLICY "Allow default venue creation"
  ON venues
  FOR INSERT
  TO authenticated
  WITH CHECK (id = '123e4567-e89b-12d3-a456-426614174000'::uuid);

CREATE POLICY "Enable read access for authenticated users"
  ON venues
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON venues
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON venues
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON venues
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Enable full access for service role"
  ON venues
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);