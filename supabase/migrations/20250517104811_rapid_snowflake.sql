/*
  # Fix default venue UUID

  1. Changes
    - Insert default venue with proper UUID
    - Add RLS policies for venues table
  
  2. Security
    - Enable RLS on venues table
    - Add policies for authenticated users
*/

-- Insert default venue if it doesn't exist
INSERT INTO venues (id, name, logo_url, primary_color, secondary_color, contact_email)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Polaroid Booth',
  'https://cdn-icons-png.flaticon.com/512/3004/3004613.png',
  '#3498db',
  '#e91e63',
  'contact@polaroidbooth.com'
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Venues are viewable by authenticated users"
ON venues FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Venues are updatable by authenticated users"
ON venues FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);