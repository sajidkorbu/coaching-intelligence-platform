// Core persona and coaching session types

export interface PersonaProfile {
  id: string;
  name: string;
  age: number;
  city: 'Mumbai' | 'Delhi' | 'Bangalore' | 'Pune' | 'Hyderabad' | 'Chennai' | 'Ahmedabad' | 'Kolkata' | 'Jaipur' | 'Bhubaneswar' | 'Lucknow' | 'Indore' | 'Chandigarh';
  occupation: string;
  background: string;
  currentSituation: string;
  coreProblems: string[];
  personalityTraits: {
    communicationStyle: 'direct' | 'indirect' | 'emotional' | 'analytical';
    energyLevel: 'high' | 'medium' | 'low';
    opennessToChange: 'high' | 'medium' | 'low';
    emotionalState: 'anxious' | 'frustrated' | 'hopeful' | 'confused' | 'motivated';
  };
  workPersona: {
    jobTitle: string;
    industry: string;
    workChallenges: string[];
    careerGoals: string[];
  };
  personalLife: {
    familySituation: string;
    relationships: string[];
    personalGoals: string[];
    stressors: string[];
  };
  coachingHistory: {
    previousExperience: boolean;
    expectations: string[];
    resistanceAreas: string[];
  };
}

export interface Message {
  id: string;
  role: 'coach' | 'client';
  content: string;
  timestamp: Date;
  emotionalTone?: 'positive' | 'negative' | 'neutral' | 'breakthrough';
  coachingTechnique?: string;
}

export interface CoachingSession {
  id: string;
  personaId: string;
  startTime: Date;
  endTime?: Date;
  messages: Message[];
  sessionGoals: string[];
  keyInsights: string[];
  breakthroughMoments: string[];
  personaEmotionalState: {
    initial: string;
    current: string;
    progression: string[];
  };
}

export interface PersonaMemory {
  personaId: string;
  conversationHistory: Message[];
  emotionalJourney: {
    timestamp: Date;
    emotion: string;
    trigger: string;
  }[];
  keyMemories: {
    timestamp: Date;
    content: string;
    importance: 'high' | 'medium' | 'low';
  }[];
  coachingProgress: {
    insightsGained: string[];
    behaviorChanges: string[];
    goalsSet: string[];
    goalsAchieved: string[];
  };
  contextSummary: string;
}

export interface EvaluationCriteria {
  activeListening: {
    score: number;
    feedback: string;
    examples: string[];
  };
  powerfulQuestioning: {
    score: number;
    feedback: string;
    examples: string[];
  };
  rapportBuilding: {
    score: number;
    feedback: string;
    examples: string[];
  };
  goalSetting: {
    score: number;
    feedback: string;
    examples: string[];
  };
  breakthroughCreation: {
    score: number;
    feedback: string;
    examples: string[];
  };
  overallEffectiveness: {
    score: number;
    feedback: string;
    recommendations: string[];
  };
}

export interface CoachingReport {
  sessionId: string;
  personaId: string;
  coachPerformance: EvaluationCriteria;
  sessionSummary: string;
  clientProgression: string;
  areasForImprovement: string[];
  strengths: string[];
  nextSessionRecommendations: string[];
  tonyRobbinsStyleFeedback: string;
  // Session highlights for display
  bestQuestion?: string;
  clientBreakthroughQuote?: string;
  keyLearning?: string;
}
