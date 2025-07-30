-- Enhanced Database Schema for Rich Persona Backstories
-- This schema extends our existing coaching platform with deep character backgrounds

-- First, let's create the persona_backstories table
CREATE TABLE IF NOT EXISTS persona_backstories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    persona_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Basic character information (matches existing persona structure)
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    city VARCHAR(50) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    
    -- Rich backstory content
    full_backstory TEXT NOT NULL, -- The complete 500-word novel-like backstory
    childhood_summary TEXT NOT NULL, -- Key childhood experiences that shaped them
    family_dynamics TEXT NOT NULL, -- Complex family relationships and pressures
    career_journey TEXT NOT NULL, -- Professional evolution and challenges
    relationship_history TEXT NOT NULL, -- Personal relationships and romantic history
    core_struggles TEXT NOT NULL, -- Deep psychological and practical challenges
    hidden_fears TEXT NOT NULL, -- Fears they don't easily admit to
    secret_dreams TEXT NOT NULL, -- Aspirations they haven't shared with others
    
    -- Character depth for coaching interactions
    communication_patterns TEXT NOT NULL, -- How they typically express themselves
    emotional_triggers TEXT[] NOT NULL, -- Topics/situations that provoke strong reactions
    defense_mechanisms TEXT[] NOT NULL, -- How they protect themselves emotionally
    growth_potential_areas TEXT[] NOT NULL, -- Areas where they could develop
    life_philosophy TEXT NOT NULL, -- Core beliefs about life, work, relationships
    
    -- Contextual details for authentic conversations
    daily_routine TEXT NOT NULL, -- Typical day structure
    stress_manifestations TEXT NOT NULL, -- How stress shows up in their life
    support_system TEXT NOT NULL, -- Who they turn to (or don't) for help
    financial_situation TEXT NOT NULL, -- Money pressures and financial goals
    social_environment TEXT NOT NULL, -- Friends, colleagues, social circle
    
    -- Meta information
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_persona_backstories_persona_id ON persona_backstories(persona_id);
CREATE INDEX IF NOT EXISTS idx_persona_backstories_city ON persona_backstories(city);
CREATE INDEX IF NOT EXISTS idx_persona_backstories_occupation ON persona_backstories(occupation);

-- Create trigger to update timestamp
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

-- Create table for persona memories that reference the rich backstory
CREATE TABLE IF NOT EXISTS persona_contextual_memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    persona_id VARCHAR(50) NOT NULL,
    memory_type VARCHAR(50) NOT NULL, -- 'childhood', 'career', 'relationship', 'trauma', 'achievement'
    memory_content TEXT NOT NULL, -- Specific memory that could come up in conversation
    emotional_weight INTEGER CHECK (emotional_weight >= 1 AND emotional_weight <= 10), -- How significant this memory is
    accessibility_level VARCHAR(20) CHECK (accessibility_level IN ('surface', 'moderate', 'deep', 'buried')), -- How easily they'd share this
    triggers TEXT[], -- What conversation topics might bring this up
    coaching_opportunities TEXT[], -- How this memory could be used for growth
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (persona_id) REFERENCES persona_backstories(persona_id)
);

-- Create indexes for contextual memories
CREATE INDEX IF NOT EXISTS idx_contextual_memories_persona_id ON persona_contextual_memories(persona_id);
CREATE INDEX IF NOT EXISTS idx_contextual_memories_type ON persona_contextual_memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_contextual_memories_emotional_weight ON persona_contextual_memories(emotional_weight);

-- Create table for relationship dynamics (family, friends, colleagues, romantic)
CREATE TABLE IF NOT EXISTS persona_relationships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    persona_id VARCHAR(50) NOT NULL,
    relationship_type VARCHAR(30) NOT NULL, -- 'family', 'romantic', 'friend', 'colleague', 'mentor'
    person_name VARCHAR(100) NOT NULL,
    relationship_description TEXT NOT NULL, -- Their connection and history
    current_status VARCHAR(30) NOT NULL, -- 'active', 'strained', 'ended', 'complicated'
    influence_level INTEGER CHECK (influence_level >= 1 AND influence_level <= 10), -- How much this person affects their decisions
    emotional_complexity TEXT NOT NULL, -- The nuanced feelings they have about this person
    conversation_relevance TEXT[], -- Topics where this relationship might come up
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (persona_id) REFERENCES persona_backstories(persona_id)
);

-- Create indexes for relationships
CREATE INDEX IF NOT EXISTS idx_persona_relationships_persona_id ON persona_relationships(persona_id);
CREATE INDEX IF NOT EXISTS idx_persona_relationships_type ON persona_relationships(relationship_type);
CREATE INDEX IF NOT EXISTS idx_persona_relationships_influence ON persona_relationships(influence_level);

-- Create table for tracking which backstory elements have been revealed in conversations
CREATE TABLE IF NOT EXISTS backstory_revelations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    persona_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) DEFAULT 'anonymous',
    
    revealed_element_type VARCHAR(50) NOT NULL, -- 'childhood_memory', 'family_conflict', 'career_turning_point', etc.
    revealed_content TEXT NOT NULL, -- What specifically was shared
    conversation_context TEXT NOT NULL, -- What led to this revelation
    coaching_opportunity TEXT, -- How this could be leveraged for growth
    
    revealed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (persona_id) REFERENCES persona_backstories(persona_id)
);

-- Create indexes for revelations tracking
CREATE INDEX IF NOT EXISTS idx_backstory_revelations_session ON backstory_revelations(session_id);
CREATE INDEX IF NOT EXISTS idx_backstory_revelations_persona ON backstory_revelations(persona_id);
CREATE INDEX IF NOT EXISTS idx_backstory_revelations_user ON backstory_revelations(user_id);

-- Enable RLS (Row Level Security) for all tables
ALTER TABLE persona_backstories ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_contextual_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE backstory_revelations ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access (personas are meant to be accessible)
CREATE POLICY "Allow read access to persona backstories" 
ON persona_backstories FOR SELECT 
USING (true);

CREATE POLICY "Allow read access to contextual memories" 
ON persona_contextual_memories FOR SELECT 
USING (true);

CREATE POLICY "Allow read access to relationships" 
ON persona_relationships FOR SELECT 
USING (true);

CREATE POLICY "Allow insert/read access to revelations" 
ON backstory_revelations FOR ALL 
USING (true);

-- Comments for documentation
COMMENT ON TABLE persona_backstories IS 'Rich character backstories for coaching personas - contains deep character development to enable authentic conversations';
COMMENT ON TABLE persona_contextual_memories IS 'Specific memories and experiences that can surface during coaching conversations';
COMMENT ON TABLE persona_relationships IS 'Important relationships in each personas life that influence their decisions and emotions';
COMMENT ON TABLE backstory_revelations IS 'Tracks which backstory elements have been revealed to each user during coaching sessions';