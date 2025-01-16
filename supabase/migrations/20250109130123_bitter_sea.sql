/*
  # Initial Schema Setup for Service Management Application

  1. New Tables
    - `users_roles` (enum type for user roles)
    - `service_categories` (lookup table for service categories)
    - `service_priorities` (enum type for priorities)
    - `service_statuses` (enum type for ticket statuses)
    - `zones` (lookup table for service zones)
    - `sectors` (lookup table for sectors within zones)
    - `service_tickets` (main table for service requests)
    - `ticket_logs` (audit trail for ticket changes)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'technician');
CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE ticket_status AS ENUM ('pending', 'in_progress', 'resolved', 'closed');

-- Create zones table
CREATE TABLE zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sectors table
CREATE TABLE sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid REFERENCES zones(id),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service categories table
CREATE TABLE service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Extend auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'operator';
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS assigned_zone_id uuid REFERENCES zones(id);

-- Create service tickets table
CREATE TABLE service_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES service_categories(id),
  priority priority_level DEFAULT 'medium',
  status ticket_status DEFAULT 'pending',
  zone_id uuid REFERENCES zones(id),
  sector_id uuid REFERENCES sectors(id),
  assigned_to uuid REFERENCES auth.users(id),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  closed_at timestamptz
);

-- Create ticket logs table
CREATE TABLE ticket_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES service_tickets(id),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Zones policies
CREATE POLICY "Zones are viewable by all authenticated users"
  ON zones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Zones are manageable by admins"
  ON zones FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Sectors policies
CREATE POLICY "Sectors are viewable by all authenticated users"
  ON sectors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sectors are manageable by admins"
  ON sectors FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Categories policies
CREATE POLICY "Categories are viewable by all authenticated users"
  ON service_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Categories are manageable by admins and managers"
  ON service_categories FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

-- Tickets policies
CREATE POLICY "Tickets are viewable by all authenticated users with role-based filters"
  ON service_tickets FOR SELECT
  TO authenticated
  USING (
    CASE auth.jwt() ->> 'role'
      WHEN 'admin' THEN true
      WHEN 'manager' THEN true
      WHEN 'operator' THEN created_by = auth.uid()
      WHEN 'technician' THEN assigned_to = auth.uid() OR zone_id = (SELECT assigned_zone_id FROM auth.users WHERE id = auth.uid())
      ELSE false
    END
  );

CREATE POLICY "Tickets can be created by operators and above"
  ON service_tickets FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'manager', 'operator'));

CREATE POLICY "Tickets can be updated based on role"
  ON service_tickets FOR UPDATE
  TO authenticated
  USING (
    CASE auth.jwt() ->> 'role'
      WHEN 'admin' THEN true
      WHEN 'manager' THEN true
      WHEN 'technician' THEN assigned_to = auth.uid()
      ELSE false
    END
  );

-- Logs policies
CREATE POLICY "Logs are viewable by admins and managers"
  ON ticket_logs FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('admin', 'manager'));

CREATE POLICY "Logs can be created by all authenticated users"
  ON ticket_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
