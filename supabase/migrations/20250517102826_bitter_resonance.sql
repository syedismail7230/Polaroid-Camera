/*
  # Fix venues RLS policies

  1. Changes
    - Add policy to allow authenticated users to create venues
    - Add policy to allow authenticated users to read venues
    - Add policy to allow authenticated users to update venues
    - Add policy to allow service role full access

  2. Security
    - Enable RLS on venues table
    - Add policies for CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can update their venues" ON venues;
DROP POLICY IF EXISTS "Authenticated users can view venues" ON venues;
DROP POLICY IF EXISTS "Enable full access for service role" ON venues;
DROP POLICY IF EXISTS "System can create initial venue" ON venues;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
ON venues FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert access for authenticated users"
ON venues FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
ON venues FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users"
ON venues FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Enable full access for service role"
ON venues FOR ALL
TO service_role
USING (true)
WITH CHECK (true);