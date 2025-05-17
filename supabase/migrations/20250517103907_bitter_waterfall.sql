/*
  # Fix Analytics RLS Policies

  1. Changes
    - Drop existing RLS policies for analytics table
    - Create new policies that properly handle venue-related analytics
    
  2. Security
    - Enable RLS on analytics table
    - Add policies for:
      - Inserting analytics data for venues
      - Updating analytics data for venues
      - Viewing analytics data for venues
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Analytics are updatable by venue" ON analytics;
DROP POLICY IF EXISTS "Analytics are viewable by venue" ON analytics;
DROP POLICY IF EXISTS "Analytics require venue_id for insert" ON analytics;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users with valid venue_id"
ON analytics
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM venues
    WHERE id = analytics.venue_id
  )
);

CREATE POLICY "Enable select for users with access to venue"
ON analytics
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM venues
    WHERE id = analytics.venue_id
  )
);

CREATE POLICY "Enable update for users with access to venue"
ON analytics
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM venues
    WHERE id = analytics.venue_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM venues
    WHERE id = analytics.venue_id
  )
);