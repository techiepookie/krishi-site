/*
  # Fix profiles table schema

  1. Tables
    - Drop and recreate profiles table with correct schema
    - Add all required columns including agriculture_type
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table with correct schema
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  profile_photo text,
  land_type text NOT NULL,
  agriculture_type text NOT NULL,
  crops text[] DEFAULT '{}',
  location jsonb DEFAULT '{}',
  language text DEFAULT 'hi',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();