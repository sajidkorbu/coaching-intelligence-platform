-- Step 1: Create Persona Backstories Table
-- Copy and paste this entire script into Supabase SQL Editor

-- Create the main persona backstories table
CREATE TABLE persona_backstories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    persona_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    city VARCHAR(50) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    
    -- Rich backstory content (the 500-word stories)
    full_backstory TEXT NOT NULL,
    childhood_summary TEXT NOT NULL,
    family_dynamics TEXT NOT NULL,
    career_journey TEXT NOT NULL,
    relationship_history TEXT NOT NULL,
    core_struggles TEXT NOT NULL,
    
    -- Character depth for conversations
    communication_style VARCHAR(50) NOT NULL,
    emotional_triggers TEXT NOT NULL,
    daily_challenges TEXT NOT NULL,
    hidden_motivations TEXT NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX idx_persona_backstories_persona_id ON persona_backstories(persona_id);

-- Create update trigger
CREATE OR REPLACE FUNCTION update_persona_backstory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_persona_backstory_timestamp
    BEFORE UPDATE ON persona_backstories
    FOR EACH ROW
    EXECUTE FUNCTION update_persona_backstory_timestamp();

-- Enable Row Level Security (but allow all access for now)
ALTER TABLE persona_backstories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to persona backstories" 
ON persona_backstories 
FOR ALL 
USING (true);