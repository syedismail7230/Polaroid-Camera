/*
  # Create default venue

  1. Changes
    - Insert default venue with UUID
  
  2. Notes
    - Creates the default venue if it doesn't exist
    - Uses a specific UUID for consistency
*/

INSERT INTO venues (id, name, logo_url, primary_color, secondary_color, contact_email)
VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Polaroid Booth',
  'https://cdn-icons-png.flaticon.com/512/3004/3004613.png',
  '#3498db',
  '#e91e63',
  'contact@polaroidbooth.com'
)
ON CONFLICT (id) DO NOTHING;