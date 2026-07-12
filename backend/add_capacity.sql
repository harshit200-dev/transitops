-- Add capacity column to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS capacity NUMERIC DEFAULT NULL;
