-- Step 3: Insert Rich Backstory Data for All 9 Personas
-- Copy and paste this entire script to add all persona backstories

-- 1. Rahul Sharma - Mumbai IT Professional
INSERT INTO persona_backstories (
    persona_id, name, age, city, occupation,
    full_backstory, childhood_summary, family_dynamics, career_journey, relationship_history, core_struggles,
    communication_style, emotional_triggers, daily_challenges, hidden_motivations
) VALUES (
    'rahul-mumbai-it', 'Rahul Sharma', 28, 'Mumbai', 'Senior Software Engineer',
    
    'Rahul''s story begins in a modest two-bedroom house in Pune''s Kharadi area, where the sound of his mother Sunita grading papers late into the night mixed with his father Anil''s worried conversations about monthly bank targets. Growing up, Rahul was the family''s golden boy - the first to score above 90% in tenth grade, the one who''d "make it big in computers." His parents sold his mother''s gold bangles to fund his engineering coaching classes, a sacrifice that still weighs on him during Mumbai''s sleepless nights. The transition to Mumbai four years ago was jarring. Rahul arrived with two suitcases and dreams of Silicon Valley salaries, only to discover that his "decent college" degree meant sharing cramped PG accommodations with five other engineers, all competing for the same entry-level positions. His first job paid ₹3.5 lakhs - a fortune in Pune, barely survival money in Mumbai. The real transformation happened during his second job switch. Rahul taught himself three new programming frameworks over six months of 4 AM study sessions, finally landing his current role through sheer persistence rather than pedigree. But success came with its own demons. The US client calls mean he''s awake when most of Mumbai sleeps, coding through Diwali nights while his college friends post family celebration photos on WhatsApp groups he''s too exhausted to check.',
    
    'Grew up as the family''s golden boy in Pune, parents sold mother''s gold bangles for his coaching classes, first in family to score above 90%, carried weight of family''s hopes and financial sacrifice',
    
    'Father Anil (bank manager) and mother Sunita (school teacher) in Pune, younger sister doing MBA needs financial support, parents pressure for marriage, guilt about lying about rent costs, sends ₹25K home monthly',
    
    'Started with ₹3.5L job, shared cramped PG with 5 engineers, self-taught programming frameworks at 4 AM, landed current ₹18L role through persistence, now leads US client projects with 70+ hour weeks',
    
    'Lost college girlfriend Kavya to distance and work demands, she married a Pune CA, too exhausted for relationships, parents arranging marriage meetings, fears commitment due to financial instability',
    
    'High Mumbai living costs consuming majority of salary, work-life balance crisis, family marriage pressure without financial stability, social isolation, career growth uncertainty',
    
    'analytical', 
    
    'IIT graduate achievements, family financial struggles, marriage timeline discussions, work-life balance criticism, salary comparisons with friends',
    
    'Managing US client calls at night, debugging production issues at 2 AM, calculating wedding costs vs savings, justifying rent costs to parents, dealing with 2-hour daily commute',
    
    'Dreams of starting tech consulting firm but fears income instability, wants to prove merit can compete with privilege, secretly calculates if financial success was worth personal cost'
);

-- 2. Priya Malhotra - Delhi Startup CEO  
INSERT INTO persona_backstories (
    persona_id, name, age, city, occupation,
    full_backstory, childhood_summary, family_dynamics, career_journey, relationship_history, core_struggles,
    communication_style, emotional_triggers, daily_challenges, hidden_motivations
) VALUES (
    'priya-delhi-startup', 'Priya Malhotra', 31, 'Delhi', 'EdTech Startup CEO',
    
    'Priya''s rebellion started early, though nobody recognized it as such. While her mother Meera arranged evening tea parties for neighborhood aunties, discussing suitable boys for their daughters, eight-year-old Priya would escape to her father''s study, reading his government policy files instead of Tinkle comics. Her father, Rajesh Malhotra, a principled IAS officer, unknowingly planted seeds of her future by discussing administrative challenges over dinner - corruption, bureaucratic inefficiency, the need for systemic change. Growing up in Delhi''s intellectual circles meant Priya understood power structures from childhood. Family friends were politicians, bureaucrats, business leaders - mostly men who made decisions affecting millions. She watched her brilliant mother reduce herself to social coordinator for her father''s career, hosting dinner parties where wives discussed children''s schools while husbands shaped policy. This observation crystallized into determination: Priya would never be the supporting character in someone else''s story. Her McKinsey years were golden handcuffs disguised as liberation. The consulting world loved her - sharp analytical mind, Delhi connections, ability to navigate complex client relationships. But every strategy deck she created for male CEOs who implemented her ideas without credit reminded her why she needed to build her own platform.',
    
    'Escaped to father''s IAS office files instead of playing, watched mother reduce herself to social coordinator role, determined never to be supporting character in someone else''s story',
    
    'Father Rajesh (retired IAS officer) wants her in established businesses, mother Meera (homemaker) worries about marriage prospects, family treats startup as "time-pass" until marriage',
    
    'McKinsey consultant for 5 years, left stable career to start EdTech company, raised ₹8 crore Series A funding, now CEO of 25-employee startup, faces constant gender bias from investors',
    
    'Previous relationship with Rohit (McKinsey colleague) ended when her success made him insecure, dating difficult as men either want to "fix" her or feel intimidated by ambition',
    
    'Family questioning risky startup decision, gender bias from investors and partners, marriage pressure at 31, burnout from 16-hour workdays, isolation from traditional peer group',
    
    'direct',
    
    'Male investors addressing her co-founder instead of her, family marriage pressure discussions, being called "too feelings-focused" in board meetings, social media friends'' family milestones',
    
    'Commanding respect in investor meetings, managing team morale during tough markets, dealing with regulatory compliance, competing with well-funded male-led startups',
    
    'Building template for other women to follow, proving female founders can scale successfully, eventually having children on her timeline not society''s, redefining success on her terms'
);

-- 3. Arjun Reddy - Bangalore Product Manager
INSERT INTO persona_backstories (
    persona_id, name, age, city, occupation,
    full_backstory, childhood_summary, family_dynamics, career_journey, relationship_history, core_struggles,
    communication_style, emotional_triggers, daily_challenges, hidden_motivations
) VALUES (
    'arjun-bangalore-pm', 'Arjun Reddy', 29, 'Bangalore', 'Senior Product Manager',
    
    'Arjun''s identity crisis began on his first day at the Bangalore startup when he realized his biggest achievement - getting promoted from engineer to product manager - meant competing with people for whom his dream job was a backup plan. The conference room full of IIT Bombay, IIM Ahmedabad tags on LinkedIn profiles became a daily reminder of paths not taken, doors never opened, a different kind of privilege he''d never access. Growing up in Hyderabad''s middle-class Telugu family meant success was measured in steady progression: good grades leading to engineering admission, engineering leading to stable job, stable job leading to suitable marriage. His father Venkatesh taught mathematics at a government high school with the patient dedication of someone who believed education could break generational barriers. His mother Lakshmi managed their modest household with the precision of a CFO, stretching every rupee while maintaining the dignity expected of a teacher''s family. The shift to product management happened accidentally. During his software engineering days, Arjun noticed he was better at understanding user problems than writing elegant code. While his colleagues debugged algorithms, he mapped user journeys. His manager noticed and suggested the transition, but Arjun discovered that intuitive product sense wasn''t enough in rooms full of MBA frameworks and strategic jargon he''d never learned in his engineering curriculum.',
    
    'Middle-class Telugu family with high expectations, father taught math at government school believing education breaks barriers, felt pressure to prove himself more than others',
    
    'Father Venkatesh (teacher earning ₹40K monthly), mother Lakshmi (homemaker with diabetes), sister doing PhD needs support, extended family compares him to cousin in US',
    
    'Started as software engineer, accidentally transitioned to product management, now earning ₹25L at unicorn startup, struggles with imposter syndrome against IIT/IIM backgrounds',
    
    'Painful breakup with Meera (marketing professional) after 2 years when he couldn''t commit to marriage due to financial insecurity, parents arranging marriage meetings monthly',
    
    'Imposter syndrome competing with elite backgrounds, family marriage pressure after breakup, lifestyle inflation despite good salary, constant comparison with higher-earning friends',
    
    'indirect',
    
    'IIT/IIM background discussions, family comparisons with successful cousin, marriage rejection due to non-elite college background, LinkedIn posts of friends'' achievements',
    
    'Competing with elite college graduates in meetings, managing financial burden for family, attending arranged marriage meetings, maintaining professional image on limited savings',
    
    'Building genuine confidence in abilities, finding authentic self-worth beyond credentials, healing from breakup to prepare for healthy relationship, achieving success without elite pedigree'
);

-- 4. Kavita Joshi - Mumbai Finance Professional
INSERT INTO persona_backstories (
    persona_id, name, age, city, occupation,
    full_backstory, childhood_summary, family_dynamics, career_journey, relationship_history, core_struggles,
    communication_style, emotional_triggers, daily_challenges, hidden_motivations
) VALUES (
    'kavita-mumbai-finance', 'Kavita Joshi', 32, 'Mumbai', 'Investment Manager',
    
    'The trading floor of Deutsche Bank Mumbai was no place for doubt, but Kavita Joshi''s confidence was armor built over years of proving she belonged. Growing up in Dadar''s middle-class Marathi family, she learned early that brilliance had to be twice as bright when wrapped in a sari rather than a suit. Her father Dilip, a dedicated school principal, filled their small flat with books and dreams of his daughters conquering worlds he''d only imagined. Her mother Sushma balanced traditional expectations with progressive support, teaching Kavita to cook perfect puran poli while pushing her toward chartered accountancy. The journey from suburban girl to finance professional wasn''t linear. Kavita''s CA finals coincided with her younger sister''s engineering entrance coaching - their family''s finances stretched between supporting both daughters'' ambitions. She studied for her final exams in the local library while her friends prepared in expensive coaching institutes, her determination fueled by the knowledge that failure wasn''t just personal but would impact her sister''s future. Her first job at a mid-tier firm introduced her to the gender dynamics of Indian finance. While male colleagues discussed investment strategies over drinks she wasn''t invited to join, Kavita learned to navigate professional relationships that assumed she''d leave for marriage within two years.',
    
    'Middle-class Marathi family in Dadar, father filled home with books and dreams, learned brilliance had to be twice as bright when wrapped in sari rather than suit',
    
    'Father Dilip (school principal) and mother Sushma balance traditional expectations with progressive support, younger sister''s engineering dreams depend partly on Kavita''s success',
    
    'Studied CA in local library while friends used expensive coaching, first job at mid-tier firm navigating gender dynamics, now at Deutsche Bank managing investment portfolios',
    
    'Dating complicated by men who either feel threatened by financial independence or fetishize it, family relatives offer back-handed compliments about success vs marriageability',
    
    'Gender dynamics in male-dominated finance, family expectations about marriage timeline, financial independence creating dating challenges, perfectionism from needing to be indispensable',
    
    'diplomatic',
    
    'Being asked to serve tea in client meetings, assumptions about leaving for marriage, salary comparisons with male colleagues, family comments about marriageability',
    
    'Managing millions for clients while struggling to plan own future, dealing with Mumbai property prices, perfectionist approach exhausting team, maintaining professional image',
    
    'Building financial independence while navigating family love, proving women belong in high-stakes finance, finding partner who appreciates rather than fears her success'
);

-- 5. Rajesh Kumar - Delhi Corporate Lawyer
INSERT INTO persona_backstories (
    persona_id, name, age, city, occupation,
    full_backstory, childhood_summary, family_dynamics, career_journey, relationship_history, core_struggles,
    communication_style, emotional_triggers, daily_challenges, hidden_motivations
) VALUES (
    'rajesh-delhi-lawyer', 'Rajesh Kumar', 35, 'Delhi', 'Senior Corporate Lawyer',
    
    'The Supreme Court of India loomed like a temple to justice in Rajesh Kumar''s childhood imagination, but twenty years of corporate law practice taught him that justice and law were often distant cousins. Born in Delhi''s Lajpat Nagar to a lower-middle-class family, Rajesh''s path to legal prominence was paved with 4 AM study sessions by streetlight and library books held together with tape because he couldn''t afford new ones. His father Ramesh sold insurance policies door-to-door, carrying rejection like a badge of persistence. His mother Kamala stitched clothes for neighborhood women to supplement income while dreaming of her son wearing the black coat that represented respectability, stability, escape from their economic uncertainty. When Rajesh cleared the law entrance exam, their celebration involved mithai from the corner shop and promises that their sacrifice would be worth it. Law college introduced him to India''s class complexities. While classmates from South Delhi discussed vacation internships at family friends'' firms, Rajesh worked part-time data entry jobs to afford photocopied textbooks. His Hindi-medium schooling made legal English initially challenging, but his determination to master every precedent, memorize every judgment, analyze every case law became legendary among professors who recognized raw talent unpolished by privilege.',
    
    'Born in Lajpat Nagar lower-middle-class family, studied by streetlight at 4 AM, library books held together with tape, parents'' celebration for law entrance was mithai from corner shop',
    
    'Father Ramesh (door-to-door insurance salesman), mother Kamala (stitched clothes for neighbors), wife Sunita (government teacher), parents'' neighbors expect free legal advice',
    
    'Law college with part-time data entry jobs, Hindi-medium schooling made legal English challenging, breakthrough in merger case saved client ₹50 crores, now senior corporate lawyer',
    
    'Married to Sunita from similar background providing emotional stability, but created new pressures from both families expecting rapid growth and grandchildren',
    
    'Ethical compromises representing questionable companies, outsider status in elite business circles, success creating isolation from roots, increasing cynicism about legal profession',
    
    'formal',
    
    'Class privilege discussions, golf club membership requirements, family questions about why he abandoned idealistic law student dreams, health issues from work stress',
    
    'Drafting agreements favoring powerful over vulnerable, attending social events feeling professionally competent but socially awkward, managing work stress affecting health',
    
    'Questioning if childhood dreams were worth the cost, wondering if law degree that once represented justice now legitimizes inequality, seeking meaning beyond financial success'
);

-- 6. Dr. Sneha Nair - Bangalore Data Scientist  
INSERT INTO persona_backstories (
    persona_id, name, age, city, occupation,
    full_backstory, childhood_summary, family_dynamics, career_journey, relationship_history, core_struggles,
    communication_style, emotional_triggers, daily_challenges, hidden_motivations
) VALUES (
    'sneha-bangalore-data', 'Dr. Sneha Nair', 33, 'Bangalore', 'Senior Data Scientist',
    
    'The algorithm was supposed to be neutral, but Dr. Sneha Nair''s machine learning model kept producing biased results, and she knew exactly why. Growing up in Kochi''s matriarchal society where her grandmother ran the household and her mother practiced medicine, Sneha learned early that women''s intelligence was simultaneously celebrated and contained. Her journey from Kerala''s backwaters to Bangalore''s tech epicenter was mapped in PhD dissertations, research papers, and the quiet satisfaction of solving problems others couldn''t see. Her childhood home near Kochi''s Marine Drive buzzed with intellectual energy. Her mother, Dr. Radha Nair, was one of the first female cardiologists in Kerala, balancing life-saving surgeries with traditional family expectations. Her father, Suresh, an engineer with ISRO, filled evenings with stories of satellite launches and space exploration. Sneha absorbed both parents'' love for science while watching her mother navigate professional respect and social scrutiny with equal grace. The transition from medicine to mathematics happened during her MBBS when she became fascinated with diagnostic patterns, statistical modeling, the possibility of predicting health outcomes through data analysis. Her family''s confusion was profound - why abandon prestigious medical career for "computer mathematics"? But Sneha saw the future: healthcare transformed by artificial intelligence, medical decisions supported by algorithmic precision, human intuition enhanced by machine learning.',
    
    'Grew up in Kochi''s matriarchal society, mother was pioneering female cardiologist, learned women''s intelligence was simultaneously celebrated and contained, home buzzed with intellectual energy',
    
    'Mother Dr. Radha Nair (cardiologist) balanced surgeries with family expectations, father Suresh (ISRO engineer), parents pride mixed with concern about single daughter achieving professionally',
    
    'MBBS to PhD transition from medicine to data science, IISc Bangalore research labs, now senior data scientist building AI models, family confused about abandoning medical career',
    
    'Relationships with men who either felt threatened by intelligence or fetishized it, dating difficult with men wanting to relocate her for their careers or expecting her to prioritize their ambitions',
    
    'Weight of representation as only woman in technical meetings, algorithmic bias warnings dismissed as over-thinking, perfectionism exhausting her while seemingly effortless for male colleagues',
    
    'analytical',
    
    'Being introduced by physical appearance before credentials, male colleagues assuming she handles documentation while they manage strategy, conference presentations focused on looks first',
    
    'Proving competence repeatedly while maintaining gracious demeanor, living alone as single woman facing landlord questions about stability, managing perfectionist tendencies',
    
    'Building algorithmic solutions while navigating human biases no machine learning can solve, representing women in tech, finding balance between achievement and social fulfillment'
);

-- 7. Amit Shah - Mumbai Marketing Manager
INSERT INTO persona_backstories (
    persona_id, name, age, city, occupation,
    full_backstory, childhood_summary, family_dynamics, career_journey, relationship_history, core_struggles,
    communication_style, emotional_triggers, daily_challenges, hidden_motivations
) VALUES (
    'amit-mumbai-marketing', 'Amit Shah', 30, 'Mumbai', 'Creative Director',
    
    'The campaign was supposed to go viral, but Amit Shah''s creative concept was buried under corporate politics and client indecision, becoming another case study in brilliant ideas killed by committee. His corner office in Bandra''s advertising district overlooked the slums of Dharavi, a daily reminder of the distance between Mumbai dreams and Mumbai reality. Growing up in Surat''s diamond merchant family, he''d traded guaranteed prosperity for creative uncertainty, and some days he wondered if the exchange was worth it. His childhood was comfortable but constrained. The Shah family''s diamond business meant financial security, social status, predictable future - Amit would learn the trade, marry within the community, continue traditions his grandfather established. But family dinner conversations about carat weights and market fluctuations felt like foreign language to a teenager who dreamed in advertising taglines and brand strategies. The rebellion began subtly. While his cousins learned diamond evaluation, Amit collected advertisement clippings from magazines, analyzing why some campaigns stuck in memory while others faded. His father Mahesh watched with bemused tolerance, expecting this "creative phase" to pass once real world responsibilities demanded attention. His mother Kiran supported his interests while secretly hoping he''d combine creativity with family business - maybe marketing diamonds to younger customers.',
    
    'Comfortable but constrained childhood in Surat diamond merchant family, rebelled by collecting ad clippings while cousins learned diamond evaluation, family expected him to continue traditions',
    
    'Father Mahesh (diamond merchant) expected creative phase to pass, mother Kiran hoped he''d combine creativity with family business, relatives question why he didn''t inherit secure diamond business',
    
    'Mass Communication at Xavier''s Mumbai, internships at small agencies, junior executive years with idea theft by seniors, rose to Creative Director managing teams and difficult clients',
    
    'Relationships suffered under professional demands, partners couldn''t understand weekend work schedules, family friends'' daughters'' parents liked settled career but not work hours',
    
    'Conflict between artistic ambition and commercial reality, brilliant campaigns killed by client fear, Mumbai lifestyle inflation trapping him in golden handcuffs, creative blocks terrifying him',
    
    'expressive',
    
    'Family questions about not joining diamond business, creative ideas being watered down by committees, salary comparisons with CA friends who own property while he rents',
    
    'Managing teams while being managed by less creative but more political people, client relationships battling creative vision with commercial anxiety, maintaining creative professional image',
    
    'Questioning if creativity is finite and consumable, wondering if choice of passion over stability is sustainable, fear that years of commercial compromise consumed natural creative insight'
);

-- 8. Manish Gupta - Delhi Management Consultant
INSERT INTO persona_backstories (
    persona_id, name, age, city, occupation,
    full_backstory, childhood_summary, family_dynamics, career_journey, relationship_history, core_struggles,
    communication_style, emotional_triggers, daily_challenges, hidden_motivations
) VALUES (
    'manish-delhi-consultant', 'Manish Gupta', 34, 'Delhi', 'Senior Management Consultant',
    
    'The PowerPoint slide was perfect - data visualization that told a compelling story, strategic recommendations that would transform the client''s business, consulting excellence that justified McKinsey''s premium pricing. But as Manish Gupta presented to the CEO who''d implement these strategies affecting thousands of employees, he wondered if he was solving problems or creating elegant justifications for decisions already made. His rise from Delhi University''s middle-class corridors to global consulting firm''s partnership track was supposed to feel like victory, not moral complexity. Growing up in Karol Bagh''s crowded bylanes, Manish absorbed his father Vikram''s philosophy about respectability through education. A government accountant who''d spent thirty years in identical office cubicles, Vikram saw his son''s academic brilliance as escape route from bureaucratic mediocrity. Every school achievement was celebrated like family festival, every scholarship won was proof that merit could overcome circumstance. His mother Sushma managed their modest household with precision that would later inform his approach to complex business problems. Watching her stretch budget to accommodate his coaching classes, school fees, and younger sister''s expenses taught him resource optimization before he learned the consulting terminology. Their small flat became study sanctuary where he prepared for competitive exams that represented gateway to different life.',
    
    'Karol Bagh middle-class upbringing, father''s philosophy about respectability through education, every achievement celebrated as proof merit could overcome circumstance, small flat became study sanctuary',
    
    'Father Vikram (government accountant) saw son''s brilliance as escape from bureaucratic mediocrity, mother Sushma managed household with precision, parents celebrated promotions but confused about actual work',
    
    'Delhi University economics to IIM management, junior associate working hundred-hour weeks, learned to package insights into impressive jargon, now senior consultant on partnership track',
    
    'Relationships struggled under professional demands, dated economics lecturer who couldn''t understand corporate career abandonment, fellow consultant relationship couldn''t survive competing schedules',
    
    'Moral weight of recommendations affecting thousands of employees, companies hiring consultants to justify predetermined layoffs, intellectual challenge now feels like rationalization for inequality',
    
    'structured',
    
    'Questions about social purpose of work compared to father''s government service, moral implications of efficiency measures reducing employee satisfaction, fear of being exposed as fraud',
    
    'Creating compelling narratives around predetermined conclusions, living in luxury hotels while analyzing companies whose workers can''t afford single night''s accommodation',
    
    'Questioning whether achievements contributed to problems he was hired to solve, wondering if optimization of profit margins serves any meaningful social purpose beyond shareholder value'
);

-- 9. Karthik Venkatesh - Bangalore Software Architect
INSERT INTO persona_backstories (
    persona_id, name, age, city, occupation,
    full_backstory, childhood_summary, family_dynamics, career_journey, relationship_history, core_struggles,
    communication_style, emotional_triggers, daily_challenges, hidden_motivations
) VALUES (
    'karthik-bangalore-architect', 'Karthik Venkatesh', 36, 'Bangalore', 'Principal Software Architect',
    
    'The system design was elegant - microservices architecture that could scale to millions of users, fault-tolerant infrastructure that would survive any disaster, technical excellence that junior developers would study for years. But as Karthik Venkatesh reviewed code at 2 AM in his Koramangala apartment, debugging issues that could have been prevented by better initial planning, he wondered if technical perfection was worth the personal cost. His journey from Mysore''s engineering college to Bangalore''s tech leadership was supposed to be fulfillment, not exhaustion. Growing up in Mysore''s academic atmosphere, Karthik inherited his father Venkatesh''s love for systematic thinking. A professor at University of Mysore''s mathematics department, his father filled their home with logic puzzles, algorithmic challenges, theoretical problems that had practical solutions. His mother Lakshmi, a high school physics teacher, balanced scientific rigor with humanistic warmth, teaching him that technology should serve people, not the reverse. His childhood was comfortable but intellectually demanding. Family dinner conversations involved discussing mathematical proofs, scientific discoveries, logical frameworks for understanding complex problems. When personal computers arrived in India, Karthik''s fascination with programming felt like natural evolution of his analytical upbringing. Writing code was like solving puzzles that could automate human tasks, optimize business processes, connect people across distances.',
    
    'Academic family in Mysore, father filled home with logic puzzles and algorithmic challenges, learned technology should serve people not reverse, programming felt like natural evolution',
    
    'Father Venkatesh (mathematics professor), mother Lakshmi (physics teacher), parents celebrated technical leadership but worried about weight gain and irregular sleep from work obsession',
    
    'Smooth transition from engineering to software industry, systematic problem-solving made him valuable immediately, promoted to architect requiring stakeholder management beyond technical skills',
    
    'Relationships struggled under professional perfection obsession, software engineer girlfriend felt ignored during design deep-dives, arranged marriage families appreciated career but not work hours',
    
    'Personal cost of technical excellence, responsibility of decisions affecting entire business outcomes, insomnia from mentally debugging code, precision required becoming exhausting perfectionism',
    
    'methodical',
    
    'System outages he could have prevented, performance issues affecting thousands of users, colleagues who moved to US earning twice salary working half hours',
    
    'Reviewing code at 2 AM debugging preventable issues, explaining technical complexity to non-technical audiences, managing anxiety about architectural choices affecting company revenues',
    
    'Questioning if technical perfection worth personal cost, wondering if building systems connecting millions while struggling to maintain personal connections is sustainable life choice'
);