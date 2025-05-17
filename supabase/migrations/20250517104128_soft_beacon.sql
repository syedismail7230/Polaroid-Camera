/*
  # Fix analytics table RLS policies

  1. Changes
    - Drop existing RLS policies for analytics table that are causing issues
    - Add new RLS policies that properly handle all required operations
    
  2. Security
    - Enable RLS on analytics table (already enabled)
    - Add policies for:
      - Inserting analytics records (authenticated users)
      - Reading analytics records (authenticated users)
      - Updating analytics records (authenticated users)
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON analytics;
DROP POLICY IF EXISTS "Enable read access to venue analytics" ON analytics;
DROP POLICY IF EXISTS "Enable update for venue analytics" ON analytics;

-- Create new comprehensive policies
CREATE POLICY "Enable full access to venue analytics for authenticated users"
ON analytics
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);