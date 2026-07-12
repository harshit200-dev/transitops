-- TransitOps Database Schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('fleet_manager','dispatcher','safety_officer','financial_analyst')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number TEXT UNIQUE NOT NULL,
  model TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity NUMERIC NOT NULL,
  odometer NUMERIC DEFAULT 0,
  acquisition_cost NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available','On Trip','In Shop','Retired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  license_expiry DATE NOT NULL,
  phone TEXT,
  safety_score NUMERIC DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available','On Trip','Off Duty','Suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  cargo_weight NUMERIC DEFAULT 0,
  planned_distance NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Dispatched','Completed','Cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  description TEXT NOT NULL,
  cost NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','In Progress','Completed')),
  date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS fuel_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  liters NUMERIC NOT NULL,
  cost NUMERIC NOT NULL,
  date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date DATE DEFAULT CURRENT_DATE
);
