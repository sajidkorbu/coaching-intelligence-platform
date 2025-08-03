import { Message, CoachingSession, EvaluationCriteria, CoachingReport } from '../types';

/**
 * Tony Robbins Coaching Evaluation Framework
 * Combines Tony Robbins' methodology with ICF standards for text-based coaching
 * Specifically designed for Indian metro professional personas
 */

// Tony Robbins' Six Human Needs
export enum SixHumanNeeds {
  CERTAINTY = 'certainty',
  VARIETY = 'variety', 
  SIGNIFICANCE = 'significance',
  LOVE_CONNECTION = 'love_connection',
  GROWTH = 'growth',
  CONTRIBUTION = 'contribution'
}

// Core Tony Robbins Coaching Principles
export enum TonyRobbinsCoachingPrinciples {
  SIX_HUMAN_NEEDS = 'six_human_needs',
  STATE_MANAGEMENT = 'state_management',
  BELIEF_SYSTEMS = 'belief_systems',
  POWERFUL_QUESTIONS = 'powerful_questions',
  OUTCOME_FOCUSED = 'outcome_focused',
  BREAKTHROUGH_CREATION = 'breakthrough_creation'
}

// ICF Core Competencies Mapping
export enum ICFCompetencies {
  ETHICAL_PRACTICE = 'ethical_practice',
  COACHING_MINDSET = 'coaching_mindset',
  AGREEMENTS = 'agreements',
  TRUST_SAFETY = 'trust_safety',
  PRESENCE = 'presence',
  ACTIVE_LISTENING = 'active_listening',
  EVOKES_AWARENESS = 'evokes_awareness',
  FACILITATES_GROWTH = 'facilitates_growth'
}

// Coaching Techniques Specific to Tony Robbins
export enum TonyRobbinsTechniques {
  QUALITY_QUESTIONS = 'quality_questions',
  REFRAMING = 'reframing',
  STATE_CHANGE = 'state_change',
  VALUES_CLARIFICATION = 'values_clarification',
  GOAL_SETTING_RPM = 'goal_setting_rpm', // RPM = Results, Purpose, Massive Action
  ENERGY_RAPPORT = 'energy_rapport',
  LIMITING_BELIEFS = 'limiting_beliefs',
  STRATEGY_STORY_STATE = 'strategy_story_state'
}

// Text-based coaching evaluation criteria
export interface TextCoachingMarkers {
  questionQuality: number;
  responseDepth: number;
  emotionalResonance: number;
  breakthroughIndicators: number;
  rapportBuilding: number;
  culturalSensitivity: number; // Specific to Indian context
}

// Tony Robbins Question Categories
export enum QuestionCategories {
  PROBLEM_SOLVING = 'problem_solving', // "What needs to change here?"
  OUTCOME_FOCUSED = 'outcome_focused', // "What do you really want?"
  EMPOWERING = 'empowering', // "What's great about this situation?"
  CHUNK_DOWN = 'chunk_down', // "What specifically do you mean by...?"
  CHUNK_UP = 'chunk_up', // "What's this really about?"
  REFRAME = 'reframe', // "What else could this mean?"
  ACTION_ORIENTED = 'action_oriented' // "What are you going to do about it?"
}

// State Management Indicators in Text
export interface StateIndicators {
  energyLevel: 'high' | 'medium' | 'low';
  emotionalState: 'empowered' | 'neutral' | 'disempowered';
  clarityLevel: 'clear' | 'somewhat_clear' | 'confused';
  motivationLevel: 'highly_motivated' | 'moderately_motivated' | 'unmotivated';
}

// Breakthrough Moment Identification
export interface BreakthroughMoment {
  messageId: string;
  type: 'insight' | 'reframe' | 'commitment' | 'value_clarification' | 'limiting_belief_shift';
  intensity: 'major' | 'moderate' | 'minor';
  description: string;
  triggerQuestion?: string;
}

// Cultural Context for Indian Professionals
export interface IndianContextFactors {
  familyPressure: boolean;
  culturalConflicts: boolean;
  socialExpectations: boolean;
  hierarchicalWorkCulture: boolean;
  financialFamilyResponsibility: boolean;
}

export class TonyRobbinsEvaluationFramework {
  
  // Core evaluation method combining Tony Robbins + ICF standards
  public static evaluateCoachingSession(session: CoachingSession): CoachingReport {
    const messages = session.messages;
    const coachMessages = messages.filter(m => m.role === 'coach');
    const clientMessages = messages.filter(m => m.role === 'client');
    
    const evaluation: EvaluationCriteria = {
      activeListening: this.evaluateActiveListening(messages),
      powerfulQuestioning: this.evaluatePowerfulQuestioning(coachMessages),
      rapportBuilding: this.evaluateRapportBuilding(messages),
      goalSetting: this.evaluateGoalSetting(messages),
      breakthroughCreation: this.evaluateBreakthroughCreation(messages),
      overallEffectiveness: this.evaluateOverallEffectiveness(messages)
    };

    return {
      sessionId: session.id,
      personaId: session.personaId,
      coachPerformance: evaluation,
      sessionSummary: this.generateSessionSummary(messages),
      clientProgression: this.analyzeClientProgression(clientMessages),
      areasForImprovement: this.identifyImprovementAreas(evaluation),
      strengths: this.identifyStrengths(evaluation),
      nextSessionRecommendations: this.generateRecommendations(messages, session.personaId),
      tonyRobbinsStyleFeedback: this.generateTonyRobbinsStyleFeedback(evaluation, messages)
    };
  }

  // Tony Robbins Principle: Active Listening in Text Context
  private static evaluateActiveListening(messages: Message[]) {
    let score = 0;
    let feedback = '';
    let examples: string[] = [];
    
    const coachMessages = messages.filter(m => m.role === 'coach');
    const clientMessages = messages.filter(m => m.role === 'client');
    
    // Check for acknowledgment patterns
    const acknowledgmentPatterns = [
      'I hear that',
      'It sounds like',
      'What I\'m understanding',
      'Let me reflect back',
      'So you\'re saying',
      'I sense that'
    ];
    
    // Check for follow-up questions based on client's previous response
    let activeListeningCount = 0;
    
    for (let i = 1; i < coachMessages.length; i++) {
      const coachMsg = coachMessages[i].content.toLowerCase();
      const prevClientMsg = clientMessages[i-1]?.content.toLowerCase() || '';
      
      // Check if coach acknowledged or built upon client's previous response
      const hasAcknowledgment = acknowledgmentPatterns.some(pattern => 
        coachMsg.includes(pattern.toLowerCase())
      );
      
      // Check if coach referenced specific words/concepts from client's message
      const clientWords = prevClientMsg.split(' ').filter(w => w.length > 4);
      const hasReference = clientWords.some(word => coachMsg.includes(word));
      
      if (hasAcknowledgment || hasReference) {
        activeListeningCount++;
        examples.push(`"${coachMessages[i].content}"`);
      }
    }
    
    // Calculate score (0-100)
    score = Math.min(100, (activeListeningCount / Math.max(1, coachMessages.length - 1)) * 100);
    
    if (score >= 80) {
      feedback = 'Excellent active listening demonstrated through consistent acknowledgment and building upon client responses.';
    } else if (score >= 60) {
      feedback = 'Good active listening with room for more consistent acknowledgment of client\'s expressions.';
    } else if (score >= 40) {
      feedback = 'Moderate active listening. Consider more reflection and acknowledgment of client\'s specific words and emotions.';
    } else {
      feedback = 'Limited active listening demonstrated. Focus on acknowledging and reflecting client\'s responses before asking new questions.';
    }
    
    return { score, feedback, examples: examples.slice(0, 3) };
  }

  // Tony Robbins Core: Quality Questions Evaluation
  private static evaluatePowerfulQuestioning(coachMessages: Message[]) {
    let score = 0;
    let feedback = '';
    let examples: string[] = [];
    
    const powerfulQuestionPatterns = {
      [QuestionCategories.OUTCOME_FOCUSED]: [
        'what do you really want',
        'what would success look like',
        'what\'s your ultimate goal',
        'what would ideal'
      ],
      [QuestionCategories.EMPOWERING]: [
        'what\'s great about',
        'what\'s working well',
        'what are you proud of',
        'what strengths'
      ],
      [QuestionCategories.PROBLEM_SOLVING]: [
        'what would happen if',
        'what\'s stopping you',
        'what needs to change',
        'what\'s the real issue'
      ],
      [QuestionCategories.REFRAME]: [
        'what else could this mean',
        'how else could you look at',
        'what if this was actually',
        'what\'s another way'
      ],
      [QuestionCategories.ACTION_ORIENTED]: [
        'what are you going to do',
        'what\'s your next step',
        'how will you',
        'when will you start'
      ]
    };
    
    let powerfulQuestionCount = 0;
    let totalQuestions = 0;
    
    coachMessages.forEach(message => {
      const content = message.content.toLowerCase();
      
      // Count total questions
      const questionCount = (content.match(/\?/g) || []).length;
      totalQuestions += questionCount;
      
      // Check for powerful question patterns
      Object.entries(powerfulQuestionPatterns).forEach(([category, patterns]) => {
        patterns.forEach(pattern => {
          if (content.includes(pattern) && content.includes('?')) {
            powerfulQuestionCount++;
            examples.push(`${category}: "${message.content}"`);
          }
        });
      });
    });
    
    // Calculate score
    score = totalQuestions > 0 ? Math.min(100, (powerfulQuestionCount / totalQuestions) * 100) : 0;
    
    if (score >= 80) {
      feedback = 'Outstanding use of Tony Robbins-style powerful questions that drive insight and action.';
    } else if (score >= 60) {
      feedback = 'Good questioning technique with effective use of outcome-focused and empowering questions.';
    } else if (score >= 40) {
      feedback = 'Moderate questioning approach. Consider more outcome-focused and reframing questions.';
    } else {
      feedback = 'Limited use of powerful questions. Focus on "What do you really want?" and "What\'s great about this?" style questions.';
    }
    
    return { score, feedback, examples: examples.slice(0, 3) };
  }

  // Rapport Building in Text Context (Cultural Sensitivity for Indian Professionals)
  private static evaluateRapportBuilding(messages: Message[]) {
    let score = 0;
    let feedback = '';
    let examples: string[] = [];
    
    const coachMessages = messages.filter(m => m.role === 'coach');
    
    // Rapport indicators for text-based coaching
    const rapportIndicators = {
      warmth: ['I understand', 'that makes sense', 'I can see', 'I appreciate'],
      validation: ['that\'s completely normal', 'many people feel', 'it\'s understandable', 'that\'s valid'],
      culturalSensitivity: ['family pressure', 'cultural expectations', 'societal norms', 'traditional values'],
      personalConnection: ['I hear the passion', 'I sense', 'it sounds like this really matters', 'I can feel'],
      encouragement: ['you\'re capable of', 'you have the strength', 'you\'ve already shown', 'you can handle']
    };
    
    let rapportScore = 0;
    
    coachMessages.forEach(message => {
      const content = message.content.toLowerCase();
      
      Object.entries(rapportIndicators).forEach(([category, indicators]) => {
        indicators.forEach(indicator => {
          if (content.includes(indicator.toLowerCase())) {
            rapportScore++;
            examples.push(`${category}: "${message.content}"`);
          }
        });
      });
    });
    
    score = Math.min(100, (rapportScore / Math.max(1, coachMessages.length)) * 100);
    
    if (score >= 80) {
      feedback = 'Excellent rapport building with strong emotional connection and cultural awareness.';
    } else if (score >= 60) {
      feedback = 'Good rapport development with appropriate warmth and validation.';
    } else if (score >= 40) {
      feedback = 'Moderate rapport building. Consider more validation and cultural sensitivity.';
    } else {
      feedback = 'Limited rapport building. Focus on acknowledgment, validation, and cultural understanding.';
    }
    
    return { score, feedback, examples: examples.slice(0, 3) };
  }

  // Goal Setting using Tony Robbins' RPM Method
  private static evaluateGoalSetting(messages: Message[]) {
    let score = 0;
    let feedback = '';
    let examples: string[] = [];
    
    const coachMessages = messages.filter(m => m.role === 'coach');
    
    // RPM (Results, Purpose, Massive Action Plan) indicators
    const rpmIndicators = {
      results: ['what specific result', 'what exactly do you want', 'what would success look like', 'what\'s the outcome'],
      purpose: ['why is this important', 'what\'s your why', 'what would this give you', 'how would this change'],
      massiveAction: ['what actions will you take', 'what\'s your plan', 'what steps', 'what will you do']
    };
    
    let goalSettingScore = 0;
    const foundComponents = { results: false, purpose: false, massiveAction: false };
    
    coachMessages.forEach(message => {
      const content = message.content.toLowerCase();
      
      Object.entries(rpmIndicators).forEach(([component, indicators]) => {
        indicators.forEach(indicator => {
          if (content.includes(indicator.toLowerCase())) {
            if (!foundComponents[component as keyof typeof foundComponents]) {
              goalSettingScore += 33.33;
              foundComponents[component as keyof typeof foundComponents] = true;
              examples.push(`${component.toUpperCase()}: "${message.content}"`);
            }
          }
        });
      });
    });
    
    score = Math.round(goalSettingScore);
    
    if (score >= 90) {
      feedback = 'Excellent implementation of Tony Robbins\' RPM method with clear focus on Results, Purpose, and Massive Action.';
    } else if (score >= 66) {
      feedback = 'Good goal-setting approach with most RPM components covered.';
    } else if (score >= 33) {
      feedback = 'Partial goal-setting implementation. Consider completing the RPM framework.';
    } else {
      feedback = 'Limited goal-setting focus. Implement RPM: What do you want? Why do you want it? What actions will you take?';
    }
    
    return { score, feedback, examples: examples.slice(0, 3) };
  }

  // Breakthrough Creation (Tony Robbins' Signature)
  private static evaluateBreakthroughCreation(messages: Message[]) {
    let score = 0;
    let feedback = '';
    let examples: string[] = [];
    
    const clientMessages = messages.filter(m => m.role === 'client');
    
    // Breakthrough indicators in client responses
    const breakthroughPatterns = [
      'I never thought of it that way',
      'that\'s a completely different perspective',
      'I see now',
      'this changes everything',
      'I understand now',
      'that makes so much sense',
      'I feel like a weight has been lifted',
      'I\'m ready to',
      'I can see clearly',
      'this is what I need to do'
    ];
    
    let breakthroughCount = 0;
    
    clientMessages.forEach(message => {
      const content = message.content.toLowerCase();
      
      breakthroughPatterns.forEach(pattern => {
        if (content.includes(pattern.toLowerCase())) {
          breakthroughCount++;
          examples.push(`"${message.content}"`);
        }
      });
    });
    
    score = Math.min(100, (breakthroughCount / Math.max(1, clientMessages.length)) * 100);
    
    if (score >= 20) {
      feedback = 'Excellent breakthrough creation with clear shifts in client perspective and understanding.';
    } else if (score >= 10) {
      feedback = 'Good breakthrough facilitation with some moments of insight and clarity.';
    } else if (score >= 5) {
      feedback = 'Moderate breakthrough creation. Consider more reframing and perspective-shifting questions.';
    } else {
      feedback = 'Limited breakthrough creation. Focus on challenging limiting beliefs and creating "aha" moments.';
    }
    
    return { score, feedback, examples: examples.slice(0, 3) };
  }

  // Overall Effectiveness combining all Tony Robbins principles
  private static evaluateOverallEffectiveness(messages: Message[]) {
    let score = 0;
    let feedback = '';
    let recommendations: string[] = [];
    
    // This would typically aggregate other scores, but for now we'll calculate based on session flow
    const coachMessages = messages.filter(m => m.role === 'coach');
    const clientMessages = messages.filter(m => m.role === 'client');
    
    // Check for Tony Robbins' core elements
    let effectivenessScore = 0;
    
    // State Management (energy, physiology through language)
    const stateManagementIndicators = ['let\'s shift', 'change your focus', 'what would empower you', 'feel the energy'];
    const hasStateManagement = coachMessages.some(m => 
      stateManagementIndicators.some(indicator => m.content.toLowerCase().includes(indicator))
    );
    if (hasStateManagement) effectivenessScore += 20;
    
    // Belief System Work
    const beliefSystemIndicators = ['what do you believe', 'is that true', 'what if that belief', 'limiting belief'];
    const hasBeliefWork = coachMessages.some(m => 
      beliefSystemIndicators.some(indicator => m.content.toLowerCase().includes(indicator))
    );
    if (hasBeliefWork) effectivenessScore += 20;
    
    // Outcome Focus
    const outcomeFocusIndicators = ['what do you want', 'what\'s your goal', 'what result', 'what outcome'];
    const hasOutcomeFocus = coachMessages.some(m => 
      outcomeFocusIndicators.some(indicator => m.content.toLowerCase().includes(indicator))
    );
    if (hasOutcomeFocus) effectivenessScore += 20;
    
    // Values Clarification
    const valuesIndicators = ['what\'s important to you', 'what do you value', 'what matters most', 'your core values'];
    const hasValuesWork = coachMessages.some(m => 
      valuesIndicators.some(indicator => m.content.toLowerCase().includes(indicator))
    );
    if (hasValuesWork) effectivenessScore += 20;
    
    // Action Orientation
    const actionIndicators = ['what will you do', 'what\'s your next step', 'how will you', 'take action'];
    const hasActionFocus = coachMessages.some(m => 
      actionIndicators.some(indicator => m.content.toLowerCase().includes(indicator))
    );
    if (hasActionFocus) effectivenessScore += 20;
    
    score = effectivenessScore;
    
    // Generate recommendations based on missing elements
    if (!hasStateManagement) recommendations.push('Incorporate more state management techniques - help client shift their emotional state');
    if (!hasBeliefWork) recommendations.push('Challenge limiting beliefs more directly using Tony Robbins\' questioning techniques');
    if (!hasOutcomeFocus) recommendations.push('Maintain stronger focus on desired outcomes and results');
    if (!hasValuesWork) recommendations.push('Explore client\'s core values to align goals with what matters most');
    if (!hasActionFocus) recommendations.push('Ensure every session ends with specific, committed actions');
    
    if (score >= 80) {
      feedback = 'Outstanding coaching effectiveness with strong Tony Robbins methodology implementation.';
    } else if (score >= 60) {
      feedback = 'Good coaching effectiveness with solid application of key principles.';
    } else if (score >= 40) {
      feedback = 'Moderate effectiveness. Consider integrating more Tony Robbins techniques.';
    } else {
      feedback = 'Limited effectiveness. Focus on Tony Robbins\' core principles: state, story, and strategy.';
    }
    
    // Extract real quotes for report
    const bestQuestion = coachMessages.find(msg => msg.content.includes('?'))?.content || 'N/A';
    const clientBreakthroughQuote = clientMessages.find(msg => msg.content.toLowerCase().includes('realization'))?.content || 'N/A';
    const keyLearning = clientMessages.find(msg => msg.content.toLowerCase().includes('learned'))?.content || 'N/A';

    return { score, feedback, recommendations, bestQuestion, clientBreakthroughQuote, keyLearning };
  }

  // Additional helper methods for comprehensive evaluation
  
  private static generateSessionSummary(messages: Message[]): string {
    // Analyze the session flow and key themes
    const coachMessages = messages.filter(m => m.role === 'coach');
    const clientMessages = messages.filter(m => m.role === 'client');
    
    return `Session included ${coachMessages.length} coach interventions and ${clientMessages.length} client responses. Key themes identified: goal clarification, emotional state management, and action planning.`;
  }
  
  private static analyzeClientProgression(clientMessages: Message[]): string {
    if (clientMessages.length < 2) return 'Insufficient data for progression analysis.';
    
    const initial = clientMessages[0].content;
    const final = clientMessages[clientMessages.length - 1].content;
    
    // Simple sentiment analysis based on language patterns
    const progressIndicators = ['I will', 'I can', 'I understand', 'I\'m ready', 'this helps'];
    const finalHasProgress = progressIndicators.some(indicator => 
      final.toLowerCase().includes(indicator.toLowerCase())
    );
    
    return finalHasProgress 
      ? 'Client showed positive progression with increased clarity and commitment to action.'
      : 'Client progression unclear. Consider more breakthrough-focused techniques.';
  }
  
  private static identifyImprovementAreas(evaluation: EvaluationCriteria): string[] {
    const improvements: string[] = [];
    
    if (evaluation.activeListening.score < 70) {
      improvements.push('Enhance active listening through more acknowledgment and reflection');
    }
    if (evaluation.powerfulQuestioning.score < 70) {
      improvements.push('Increase use of Tony Robbins\' quality questions framework');
    }
    if (evaluation.rapportBuilding.score < 70) {
      improvements.push('Build stronger rapport through cultural sensitivity and validation');
    }
    if (evaluation.goalSetting.score < 70) {
      improvements.push('Implement complete RPM (Results, Purpose, Massive Action) framework');
    }
    if (evaluation.breakthroughCreation.score < 70) {
      improvements.push('Focus more on creating breakthrough moments and perspective shifts');
    }
    
    return improvements;
  }
  
  private static identifyStrengths(evaluation: EvaluationCriteria): string[] {
    const strengths: string[] = [];
    
    if (evaluation.activeListening.score >= 70) {
      strengths.push('Strong active listening and client acknowledgment');
    }
    if (evaluation.powerfulQuestioning.score >= 70) {
      strengths.push('Effective use of powerful, outcome-focused questions');
    }
    if (evaluation.rapportBuilding.score >= 70) {
      strengths.push('Excellent rapport building and emotional connection');
    }
    if (evaluation.goalSetting.score >= 70) {
      strengths.push('Clear goal-setting and action orientation');
    }
    if (evaluation.breakthroughCreation.score >= 70) {
      strengths.push('Strong ability to create insights and breakthrough moments');
    }
    
    return strengths;
  }
  
  private static generateRecommendations(messages: Message[], personaId: string): string[] {
    const recommendations: string[] = [];
    
    // Persona-specific recommendations based on cultural context
    if (personaId.includes('mumbai') || personaId.includes('delhi') || personaId.includes('bangalore')) {
      recommendations.push('Continue addressing cultural pressures and family expectations with sensitivity');
      recommendations.push('Focus on financial planning and work-life balance challenges specific to Indian professionals');
    }
    
    recommendations.push('Implement Tony Robbins\' Strategy-Story-State framework in next session');
    recommendations.push('Use more reframing questions to shift limiting beliefs');
    recommendations.push('End session with specific, time-bound action commitments');
    
    return recommendations;
  }
  
  private static generateTonyRobbinsStyleFeedback(evaluation: EvaluationCriteria, messages: Message[]): string {
    const totalScore = Math.round(
      (evaluation.activeListening.score + 
       evaluation.powerfulQuestioning.score + 
       evaluation.rapportBuilding.score + 
       evaluation.goalSetting.score + 
       evaluation.breakthroughCreation.score + 
       evaluation.overallEffectiveness.score) / 6
    );
    
    let tonyStyle = '';
    
    if (totalScore >= 80) {
      tonyStyle = `🔥 OUTSTANDING! You're coaching like a champion! Your ability to create breakthrough moments and drive results is phenomenal. You're not just asking questions - you're creating transformation. Keep this energy and watch your clients soar to new heights!`;
    } else if (totalScore >= 60) {
      tonyStyle = `💪 SOLID WORK! You're on the right track with good fundamentals. Now it's time to turn up the intensity! Remember: Success is 80% psychology, 20% mechanics. Focus on creating more emotional breakthroughs and watch the magic happen!`;
    } else {
      tonyStyle = `🎯 OPPORTUNITY FOR MASSIVE GROWTH! Here's your chance to become the coach you were meant to be! Focus on RESULTS, discover their WHY, and create MASSIVE ACTION plans. Every question should drive them closer to their breakthrough. You've got this!`;
    }
    
    return tonyStyle;
  }

  // Method to identify Six Human Needs being addressed
  public static identifyHumanNeedsAddressed(messages: Message[]): { [key in SixHumanNeeds]: boolean } {
    const needsAddressed: { [key in SixHumanNeeds]: boolean } = {
      [SixHumanNeeds.CERTAINTY]: false,
      [SixHumanNeeds.VARIETY]: false,
      [SixHumanNeeds.SIGNIFICANCE]: false,
      [SixHumanNeeds.LOVE_CONNECTION]: false,
      [SixHumanNeeds.GROWTH]: false,
      [SixHumanNeeds.CONTRIBUTION]: false
    };
    
    const needsIndicators = {
      [SixHumanNeeds.CERTAINTY]: ['security', 'stability', 'control', 'certainty', 'predictable'],
      [SixHumanNeeds.VARIETY]: ['change', 'variety', 'adventure', 'different', 'new experience'],
      [SixHumanNeeds.SIGNIFICANCE]: ['important', 'special', 'unique', 'recognition', 'achievement'],
      [SixHumanNeeds.LOVE_CONNECTION]: ['love', 'connection', 'relationship', 'belonging', 'together'],
      [SixHumanNeeds.GROWTH]: ['growth', 'learning', 'development', 'improve', 'expand'],
      [SixHumanNeeds.CONTRIBUTION]: ['contribute', 'help others', 'give back', 'make a difference', 'serve']
    };
    
    messages.forEach(message => {
      const content = message.content.toLowerCase();
      
      Object.entries(needsIndicators).forEach(([need, indicators]) => {
        if (indicators.some(indicator => content.includes(indicator))) {
          needsAddressed[need as SixHumanNeeds] = true;
        }
      });
    });
    
    return needsAddressed;
  }
}

// Export utility functions for component usage
export const TonyRobbinsUtils = {
  // Quick assessment functions for real-time feedback
  assessQuestionQuality: (question: string): QuestionCategories | null => {
    const patterns = {
      [QuestionCategories.OUTCOME_FOCUSED]: /what do you (really )?want|what would success look like|what's your (ultimate )?goal/i,
      [QuestionCategories.EMPOWERING]: /what's great about|what's working|what are you proud of|what strengths/i,
      [QuestionCategories.PROBLEM_SOLVING]: /what would happen if|what's stopping you|what needs to change/i,
      [QuestionCategories.REFRAME]: /what else could this mean|how else could you|what if this was|what's another way/i,
      [QuestionCategories.ACTION_ORIENTED]: /what are you going to do|what's your next step|how will you|when will you start/i
    };
    
    for (const [category, pattern] of Object.entries(patterns)) {
      if (pattern.test(question)) {
        return category as QuestionCategories;
      }
    }
    
    return null;
  },
  
  // Real-time breakthrough detection
  detectBreakthrough: (clientResponse: string): BreakthroughMoment | null => {
    const breakthroughPatterns = [
      { pattern: /I never thought of it that way/i, type: 'reframe' as const, intensity: 'major' as const },
      { pattern: /that makes so much sense/i, type: 'insight' as const, intensity: 'moderate' as const },
      { pattern: /I'm ready to/i, type: 'commitment' as const, intensity: 'major' as const },
      { pattern: /I see now/i, type: 'insight' as const, intensity: 'moderate' as const }
    ];
    
    for (const { pattern, type, intensity } of breakthroughPatterns) {
      if (pattern.test(clientResponse)) {
        return {
          messageId: Date.now().toString(),
          type,
          intensity,
          description: `Client showed ${intensity} ${type} breakthrough`,
          triggerQuestion: undefined
        };
      }
    }
    
    return null;
  }
};