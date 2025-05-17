/*
  # Update venues RLS policies

  1. Changes
    - Update RLS policies for venues table to allow default venue creation
    - Add policy for default venue ID insertion
    - Maintain existing policies for authenticated users

  2. Security
    - Enable RLS on venues table
    - Add specific policy for default venue creation
    - Maintain existing policies for authenticated users
*/

-- First remove the existing policy that's causing issues
DROP POLICY IF EXISTS "Allow default venue creation" ON venues;

-- Create new policy for default venue creation
CREATE POLICY "Allow default venue creation" 
ON venues 
FOR INSERT 
TO authenticated 
WITH CHECK (
  -- Allow insert only for the default venue ID
  id = '123e4567-e89b-12d3-a456-426614174000'::uuid
);

-- Ensure other policies remain in place
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'venues' 
    AND policyname = 'Enable read access for authenticated users'
  ) THEN
    CREATE POLICY "Enable read access for authenticated users" 
    ON venues 
    FOR SELECT 
    TO authenticated 
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'venues' 
    AND policyname = 'Enable update for authenticated users'
  ) THEN
    CREATE POLICY "Enable update for authenticated users" 
    ON venues 
    FOR UPDATE 
    TO authenticated 
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'venues' 
    AND policyname = 'Enable delete for authenticated users'
  ) THEN
    CREATE POLICY "Enable delete for authenticated users" 
    ON venues 
    FOR DELETE 
    TO authenticated 
    USING (true);
  END IF;
END $$;