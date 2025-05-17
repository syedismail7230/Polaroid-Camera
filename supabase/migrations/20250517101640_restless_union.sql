/*
  # Initial Schema Setup for Polaroid Booth

  1. New Tables
    - `venues`
      - `id` (uuid, primary key)
      - `name` (text)
      - `logo_url` (text)
      - `primary_color` (text)
      - `secondary_color` (text)
      - `contact_email` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `photos`
      - `id` (uuid, primary key)
      - `venue_id` (uuid, foreign key)
      - `image_url` (text)
      - `filter` (text)
      - `frame` (text)
      - `caption` (text)
      - `created_at` (timestamptz)

    - `analytics`
      - `id` (uuid, primary key)
      - `venue_id` (uuid, foreign key)
      - `date` (date)
      - `total_prints` (integer)
      - `total_revenue` (decimal)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create venues table
CREATE TABLE venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  primary_color text DEFAULT '#3498db',
  secondary_color text DEFAULT '#e91e63',
  contact_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photos table
CREATE TABLE photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  filter text DEFAULT 'original',
  frame text DEFAULT 'classic',
  caption text,
  created_at timestamptz DEFAULT now()
);

-- Create analytics table
CREATE TABLE analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_prints integer DEFAULT 0,
  total_revenue decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for venues
CREATE POLICY "Venues are viewable by authenticated users"
  ON venues
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Venues are insertable by authenticated users"
  ON venues
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Venues are updatable by authenticated users"
  ON venues
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for photos
CREATE POLICY "Photos are viewable by authenticated users"
  ON photos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Photos are insertable by authenticated users"
  ON photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Photos are deletable by authenticated users"
  ON photos
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for analytics
CREATE POLICY "Analytics are viewable by authenticated users"
  ON analytics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Analytics are insertable by authenticated users"
  ON analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Analytics are updatable by authenticated users"
  ON analytics
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update venue updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for venues updated_at
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for analytics updated_at
CREATE TRIGGER update_analytics_updated_at
  BEFORE UPDATE ON analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();