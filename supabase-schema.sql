-- ====================================================================
-- YUKTI '27 — POSTGRESQL / SUPABASE TABLE SCHEMA
-- ====================================================================
-- If you connect a PostgreSQL database (e.g. Supabase, Neon, or Railway):
-- Run this SQL query in your database SQL Editor:

CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reg_id VARCHAR(50) UNIQUE NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  fee_amount VARCHAR(50) NOT NULL,
  lead_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  college VARCHAR(255) NOT NULL,
  academic_year VARCHAR(100),
  delegation_type VARCHAR(100),
  team_members TEXT,
  special_requirements TEXT,
  payment_method VARCHAR(100) DEFAULT 'UPI QR',
  transaction_ref VARCHAR(100),
  status VARCHAR(100) DEFAULT 'Confirmed'
);

-- Enable public read/write if using Supabase with Row Level Security:
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for registrations" 
ON registrations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated read for committee" 
ON registrations 
FOR SELECT 
TO authenticated 
USING (true);
