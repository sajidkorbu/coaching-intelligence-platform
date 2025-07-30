-- Coaching Intelligence Platform Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create coaching_sessions table
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR DEFAULT 'anonymous',
  persona_id VARCHAR NOT NULL,
  messages JSONB NOT NULL,
  evaluation_report JSONB,
  completed_at TIMESTAMP DEFAULT NOW(),
  session_duration INTEGER
);

-- Create user_progress table for tracking competency scores
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR DEFAULT 'anonymous',
  persona_id VARCHAR NOT NULL,
  competency VARCHAR NOT NULL,
  score INTEGER NOT NULL,
  session_id UUID REFERENCES coaching_sessions(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_user_id ON coaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_persona_id ON coaching_sessions(persona_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_completed_at ON coaching_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_persona_id ON user_progress(persona_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_session_id ON user_progress(session_id);

-- Enable Row Level Security (optional, can be disabled for MVP)
-- ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous access (for MVP)
-- CREATE POLICY "Allow anonymous access to coaching_sessions" ON coaching_sessions
--   FOR ALL USING (user_id = 'anonymous');

-- CREATE POLICY "Allow anonymous access to user_progress" ON user_progress
--   FOR ALL USING (user_id = 'anonymous');

-- Insert sample data (optional)
INSERT INTO coaching_sessions (persona_id, messages, evaluation_report, session_duration) VALUES 
('test-persona', '[]'::jsonb, '{}'::jsonb, 0)
ON CONFLICT DO NOTHING;