/**
 * Evaluation Configuration
 * Defines scoring criteria, weights, and cultural adaptations for coaching evaluation
 */

import { SixHumanNeeds, QuestionCategories } from './TonyRobbinsEvaluationFramework';

// Scoring weights for different evaluation aspects
export const EVALUATION_WEIGHTS = {
  tonyRobbins: {
    sixHumanNeeds: 0.20,        // 20% weight
    stateManagement: 0.15,      // 15% weight
    beliefSystems: 0.15,        // 15% weight
    powerfulQuestions: 0.20,    // 20% weight
    outcomesFocus: 0.15,        // 15% weight
    breakthroughCreation: 0.15  // 15% weight
  },
  icf: {
    ethicalPractice: 0.10,      // 10% weight
    coachingMindset: 0.15,      // 15% weight
    agreements: 0.10,           // 10% weight
    trustSafety: 0.15,          // 15% weight
    presence: 0.15,             // 15% weight
    activeListening: 0.20,      // 20% weight
    evokesAwareness: 0.15       // 15% weight
  },
  textBased: {
    questionQuality: 0.25,      // 25% weight for text coaching
    emotionalResonance: 0.20,   // 20% weight
    rapportBuilding: 0.20,      // 20% weight
    culturalSensitivity: 0.15,  // 15% weight (Indian context)
    actionOrientation: 0.20     // 20% weight
  }
};

// Cultural context configurations for Indian metro professionals
export const CULTURAL_CONTEXTS = {
  indian_metro_professional: {
    keyThemes: [
      'family_pressure',
      'work_life_balance',
      'financial_planning',
      'career_advancement',
      'cultural_expectations',
      'social_status',
      'traditional_vs_modern_values'
    ],
    sensitivityIndicators: [
      'understanding family dynamics',
      'respecting cultural values',
      'acknowledging societal pressure',
      'balancing tradition and personal goals',
      'considering extended family impact',
      'addressing financial responsibilities',
      'navigating workplace hierarchy'
    ],
    commonChallenges: {
      mumbai: [
        'high_cost_of_living',
        'long_commutes',
        'space_constraints',
        'competitive_environment'
      ],
      delhi: [
        'political_environment',
        'status_consciousness',
        'bureaucratic_challenges',
        'networking_pressure'
      ],
      bangalore: [
        'tech_industry_pressure',
        'traffic_stress',
        'startup_uncertainty',
        'lifestyle_inflation'
      ]
    }
  }
};

// Tony Robbins question quality assessment criteria
export const QUESTION_QUALITY_CRITERIA = {
  [QuestionCategories.OUTCOME_FOCUSED]: {
    weight: 25,
    examples: [
      'What do you really want?',
      'What would success look like?',
      'What is your ultimate goal here?',
      'What would be the ideal outcome?'
    ],
    indicators: [
      'focuses on desired results',
      'clarifies end goals',
      'moves beyond problems to solutions',
      'creates vision of success'
    ]
  },
  [QuestionCategories.EMPOWERING]: {
    weight: 20,
    examples: [
      'What\'s great about this situation?',
      'What are you proud of here?',
      'What strengths can you use?',
      'What\'s working well?'
    ],
    indicators: [
      'shifts to positive perspective',
      'identifies existing strengths',
      'builds confidence',
      'reframes challenges as opportunities'
    ]
  },
  [QuestionCategories.PROBLEM_SOLVING]: {
    weight: 20,
    examples: [
      'What needs to change here?',
      'What\'s the real issue?',
      'What would happen if you did nothing?',
      'What\'s stopping you?'
    ],
    indicators: [
      'identifies core issues',
      'explores root causes',
      'clarifies obstacles',
      'creates urgency for change'
    ]
  },
  [QuestionCategories.REFRAME]: {
    weight: 15,
    examples: [
      'What else could this mean?',
      'How else could you look at this?',
      'What if this was actually a gift?',
      'What\'s another way to see this?'
    ],
    indicators: [
      'challenges limiting perspectives',
      'opens new possibilities',
      'shifts meaning and interpretation',
      'creates breakthrough thinking'
    ]
  },
  [QuestionCategories.ACTION_ORIENTED]: {
    weight: 20,
    examples: [
      'What are you going to do about it?',
      'What\'s your next step?',
      'How will you make this happen?',
      'When will you start?'
    ],
    indicators: [
      'drives commitment to action',
      'creates specific next steps',
      'establishes timeline',
      'moves from thinking to doing'
    ]
  }
};

// Breakthrough moment identification criteria
export const BREAKTHROUGH_CRITERIA = {
  major: {
    score: 30,
    indicators: [
      'complete perspective shift',
      'emotional release or breakthrough',
      'commitment to major life change',
      'sudden clarity on core values',
      'resolution of internal conflict'
    ],
    textPatterns: [
      'I never thought of it that way',
      'This changes everything',
      'I see clearly now',
      'I feel like a weight has been lifted',
      'This is what I need to do'
    ]
  },
  moderate: {
    score: 15,
    indicators: [
      'new insight or understanding',
      'shift in emotional state',
      'commitment to specific action',
      'recognition of pattern',
      'increased self-awareness'
    ],
    textPatterns: [
      'That makes sense now',
      'I understand better',
      'I can see the connection',
      'That\'s a good point',
      'I hadn\'t considered that'
    ]
  },
  minor: {
    score: 5,
    indicators: [
      'slight perspective shift',
      'acknowledgment of point',
      'small realization',
      'increased interest',
      'willingness to explore'
    ],
    textPatterns: [
      'That\'s interesting',
      'I see what you mean',
      'That\'s worth thinking about',
      'I hadn\'t thought about it',
      'That makes some sense'
    ]
  }
};

// Active listening assessment for text-based coaching
export const ACTIVE_LISTENING_CRITERIA = {
  acknowledgment: {
    weight: 30,
    patterns: [
      'I hear that',
      'It sounds like',
      'What I\'m understanding is',
      'Let me reflect back',
      'So you\'re saying',
      'I sense that'
    ]
  },
  reflection: {
    weight: 25,
    patterns: [
      'feelings reflection',
      'content reflection',
      'meaning reflection',
      'summarizing key points'
    ]
  },
  building_upon: {
    weight: 25,
    indicators: [
      'references client\'s previous words',
      'builds on client\'s ideas',
      'connects themes across messages',
      'shows continuity of understanding'
    ]
  },
  clarification: {
    weight: 20,
    patterns: [
      'What specifically do you mean by',
      'Can you tell me more about',
      'Help me understand',
      'What does that look like for you'
    ]
  }
};

// Rapport building indicators for Indian cultural context
export const RAPPORT_BUILDING_CRITERIA = {
  warmth: {
    weight: 25,
    patterns: [
      'I understand',
      'That makes sense',
      'I can see',
      'I appreciate',
      'Thank you for sharing'
    ]
  },
  validation: {
    weight: 25,
    patterns: [
      'That\'s completely normal',
      'Many people feel this way',
      'It\'s understandable',
      'That\'s a valid concern',
      'You\'re not alone in this'
    ]
  },
  cultural_sensitivity: {
    weight: 30, // Higher weight for Indian context
    patterns: [
      'family expectations',
      'cultural values',
      'traditional perspectives',
      'societal pressures',
      'balancing different worlds'
    ]
  },
  encouragement: {
    weight: 20,
    patterns: [
      'You\'re capable of',
      'You have the strength',
      'You\'ve already shown',
      'You can handle this',
      'I believe in your ability'
    ]
  }
};

// State management indicators in text
export const STATE_MANAGEMENT_CRITERIA = {
  energy_shift: {
    indicators: [
      'shift to more positive language',
      'increased enthusiasm in responses',
      'more proactive statements',
      'solution-focused thinking'
    ]
  },
  emotional_regulation: {
    indicators: [
      'calmer tone in messages',
      'less reactive language',
      'more balanced perspective',
      'acknowledgment of emotions without being overwhelmed'
    ]
  },
  clarity_increase: {
    indicators: [
      'more specific language',
      'clearer goal articulation',
      'decisive statements',
      'reduced confusion indicators'
    ]
  },
  motivation_boost: {
    indicators: [
      'commitment statements',
      'action-oriented language',
      'future-focused thinking',
      'ownership of solutions'
    ]
  }
};

// ICF Core Competencies mapping for text-based evaluation
export const ICF_TEXT_MAPPING = {
  ethical_practice: {
    indicators: [
      'maintains confidentiality language',
      'respects client autonomy',
      'avoids giving advice directly',
      'maintains professional boundaries'
    ]
  },
  coaching_mindset: {
    indicators: [
      'curiosity over judgment',
      'client-focused questions',
      'belief in client capability',
      'growth-oriented language'
    ]
  },
  trust_safety: {
    indicators: [
      'non-judgmental responses',
      'acceptance of client perspective',
      'encouraging vulnerability',
      'supportive language'
    ]
  },
  presence: {
    indicators: [
      'fully engaged responses',
      'appropriate response timing',
      'contextual awareness',
      'emotional attunement'
    ]
  },
  evokes_awareness: {
    indicators: [
      'insightful questions',
      'pattern identification',
      'perspective-shifting responses',
      'self-discovery facilitation'
    ]
  }
};

// Scoring thresholds for different performance levels
export const PERFORMANCE_THRESHOLDS = {
  excellent: { min: 85, color: 'green', emoji: '🔥', message: 'Outstanding performance!' },
  good: { min: 70, color: 'blue', emoji: '💪', message: 'Good performance with room for growth!' },
  needs_improvement: { min: 55, color: 'yellow', emoji: '🎯', message: 'Performance shows potential for improvement!' },
  poor: { min: 0, color: 'red', emoji: '📚', message: 'Significant improvement needed!' }
};

// Session length and message count considerations
export const SESSION_PARAMETERS = {
  optimal_message_count: { min: 10, max: 20 },
  coach_to_client_ratio: { optimal: 0.8, min: 0.5, max: 1.2 },
  question_to_statement_ratio: { optimal: 2.0, min: 1.0 },
  average_message_length: { min: 20, optimal: 100, max: 300 }
};

// Real-time evaluation update frequency
export const REAL_TIME_CONFIG = {
  update_frequency: 2, // Update every 2 messages
  suggestion_threshold: 60, // Show suggestions when score drops below 60
  breakthrough_sensitivity: 'high', // 'low', 'medium', 'high'
  cultural_awareness_boost: 1.2 // Multiply cultural sensitivity scores by this factor
};

// Export configuration getter functions
export const getEvaluationConfig = () => ({
  weights: EVALUATION_WEIGHTS,
  cultural: CULTURAL_CONTEXTS,
  questions: QUESTION_QUALITY_CRITERIA,
  breakthroughs: BREAKTHROUGH_CRITERIA,
  listening: ACTIVE_LISTENING_CRITERIA,
  rapport: RAPPORT_BUILDING_CRITERIA,
  state: STATE_MANAGEMENT_CRITERIA,
  icf: ICF_TEXT_MAPPING,
  thresholds: PERFORMANCE_THRESHOLDS,
  session: SESSION_PARAMETERS,
  realTime: REAL_TIME_CONFIG
});

export const getCulturalContextForPersona = (personaId: string) => {
  // Extract city from persona ID for city-specific considerations
  if (personaId.includes('mumbai')) {
    return {
      ...CULTURAL_CONTEXTS.indian_metro_professional,
      citySpecific: CULTURAL_CONTEXTS.indian_metro_professional.commonChallenges.mumbai
    };
  } else if (personaId.includes('delhi')) {
    return {
      ...CULTURAL_CONTEXTS.indian_metro_professional,
      citySpecific: CULTURAL_CONTEXTS.indian_metro_professional.commonChallenges.delhi
    };
  } else if (personaId.includes('bangalore')) {
    return {
      ...CULTURAL_CONTEXTS.indian_metro_professional,
      citySpecific: CULTURAL_CONTEXTS.indian_metro_professional.commonChallenges.bangalore
    };
  }
  
  return CULTURAL_CONTEXTS.indian_metro_professional;
};