-- Step 2: Verification Queries
-- Run these one by one to verify everything was created properly

-- Query 1: Check if the table exists and see its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'persona_backstories' 
ORDER BY ordinal_position;