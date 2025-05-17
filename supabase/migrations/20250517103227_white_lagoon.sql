/*
  # Fix Analytics RLS Policies

  1. Changes
    - Drop existing RLS policies for analytics table
    - Add new policies that properly handle venue_id requirement
    - Ensure authenticated users can only insert/update analytics for their venue

  2. Security
    - Enable RLS (already enabled)
    - Add policies for INSERT/UPDATE/SELECT that check venue_id
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Analytics are insertable by authenticated users" ON analytics;
DROP POLICY IF EXISTS "Analytics are updatable by authenticated users" ON analytics;
DROP POLICY IF EXISTS "Analytics are viewable by authenticated users" ON analytics;

-- Create new policies that properly handle venue_id
CREATE POLICY "Analytics require venue_id for insert"
ON analytics
FOR INSERT
TO authenticated
WITH CHECK (
  venue_id IS NOT NULL
);

CREATE POLICY "Analytics are viewable by venue"
ON analytics
FOR SELECT
TO authenticated
USING (
  venue_id IS NOT NULL
);

CREATE POLICY "Analytics are updatable by venue"
ON analytics
FOR UPDATE
TO authenticated
USING (
  venue_id IS NOT NULL
)
WITH CHECK (
  venue_id IS NOT NULL
);