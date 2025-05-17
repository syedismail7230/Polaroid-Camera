/*
  # Fix Analytics RLS Policies

  1. Changes
    - Remove existing ALL policy that's too permissive
    - Add specific policies for INSERT, SELECT, and UPDATE operations
    - Policies are scoped to authenticated users
    
  2. Security
    - Enable RLS (already enabled)
    - Add granular policies for better security control
*/

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Enable full access to venue analytics for authenticated users" ON analytics;

-- Add specific policies for each operation
CREATE POLICY "Allow authenticated users to insert analytics"
ON analytics
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view analytics"
ON analytics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update analytics"
ON analytics
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);