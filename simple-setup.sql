-- Simple Database Setup for Coaching Platform
-- Just copy everything below and paste it in Supabase SQL Editor, then click "Run"

CREATE TABLE coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR DEFAULT 'anonymous',
  persona_id VARCHAR NOT NULL,
  messages JSONB NOT NULL,
  evaluation_report JSONB,
  completed_at TIMESTAMP DEFAULT NOW(),
  session_duration INTEGER
);

CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR DEFAULT 'anonymous',
  persona_id VARCHAR NOT NULL,
  competency VARCHAR NOT NULL,
  score INTEGER NOT NULL,
  session_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);