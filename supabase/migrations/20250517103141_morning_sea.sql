/*
  # Disable RLS on venues table
  
  1. Changes
    - Disable Row Level Security on venues table
    - Remove existing RLS policies as they are no longer needed
  
  Note: This migration disables RLS as per user requirement since it's causing issues
  with venue creation and is stated as unnecessary.
*/

-- Disable RLS on venues table
ALTER TABLE venues DISABLE ROW LEVEL SECURITY;

-- Drop existing policies as they are no longer needed
DROP POLICY IF EXISTS "Allow default venue creation" ON venues;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON venues;
DROP POLICY IF EXISTS "Enable full access for service role" ON venues;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON venues;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON venues;