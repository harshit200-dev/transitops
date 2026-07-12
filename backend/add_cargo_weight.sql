-- Add cargo_weight column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS cargo_weight NUMERIC DEFAULT NULL;
