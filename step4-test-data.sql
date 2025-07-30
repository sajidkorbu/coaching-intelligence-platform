-- Step 4: Test That All Data Was Inserted Correctly
-- Run this to verify all 9 personas are in the database with their backstories

-- Test 1: Count how many personas were inserted
SELECT COUNT(*) as total_personas FROM persona_backstories;

-- Test 2: See all persona names and cities  
SELECT name, age, city, occupation FROM persona_backstories ORDER BY city, name;

-- Test 3: Check one full backstory (Rahul from Mumbai)
SELECT name, LEFT(full_backstory, 100) || '...' as backstory_preview 
FROM persona_backstories 
WHERE persona_id = 'rahul-mumbai-it';