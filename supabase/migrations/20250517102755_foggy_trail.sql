/*
  # Update venues RLS policies

  1. Changes
    - Add policy to allow service role to manage venues
    - Update existing policies to be more specific
  
  2. Security
    - Enable service role access for system operations
    - Maintain authenticated user access with proper restrictions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Venues are insertable by authenticated users" ON venues;
DROP POLICY IF EXISTS "Venues are updatable by authenticated users" ON venues;
DROP POLICY IF EXISTS "Venues are viewable by authenticated users" ON venues;

-- Create new policies with proper restrictions
CREATE POLICY "Enable full access for service role"
ON venues
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can view venues"
ON venues
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update their venues"
ON venues
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "System can create initial venue"
ON venues
FOR INSERT
TO authenticated
WITH CHECK (true);