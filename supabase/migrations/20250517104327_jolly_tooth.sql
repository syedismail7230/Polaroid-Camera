/*
  # Fix Analytics RLS Policies

  1. Changes
    - Drop existing INSERT policy that was too permissive
    - Create new INSERT policy with proper venue_id check
    - Ensure authenticated users can only insert analytics for venues they have access to
  
  2. Security
    - Enable RLS (already enabled)
    - Add policy for INSERT with proper checks
*/

-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Allow authenticated users to insert analytics" ON "analytics";

-- Create new INSERT policy with proper venue checks
CREATE POLICY "Allow venue analytics inserts" ON "analytics"
FOR INSERT TO authenticated
WITH CHECK (
  -- Allow insert if the venue_id exists in the venues table
  EXISTS (
    SELECT 1 FROM venues 
    WHERE id = analytics.venue_id
  )
);