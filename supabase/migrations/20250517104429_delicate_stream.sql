/*
  # Fix Analytics RLS Policies
  
  1. Changes
    - Drop existing problematic policies
    - Create new comprehensive policies for analytics table
    - Ensure proper venue_id validation
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Validate venue relationships
*/

-- First ensure RLS is enabled
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow authenticated users to view analytics" ON analytics;
DROP POLICY IF EXISTS "Allow authenticated users to update analytics" ON analytics;
DROP POLICY IF EXISTS "Allow venue analytics inserts" ON analytics;

-- Create new policies with proper security checks

-- Policy for SELECT operations
CREATE POLICY "Allow authenticated users to view analytics"
ON analytics
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM venues WHERE id = venue_id
  )
);

-- Policy for INSERT operations
CREATE POLICY "Allow analytics inserts for valid venues"
ON analytics
FOR INSERT
TO authenticated
WITH CHECK (
  venue_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM venues WHERE id = venue_id
  )
);

-- Policy for UPDATE operations
CREATE POLICY "Allow authenticated users to update analytics"
ON analytics
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM venues WHERE id = venue_id
  )
)
WITH CHECK (
  venue_id IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM venues WHERE id = venue_id
  )
);