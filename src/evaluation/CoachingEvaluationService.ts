import { Message, CoachingSession, CoachingReport, PersonaProfile } from '../types';
import { TonyRobbinsEvaluationFramework, SixHumanNeeds, TonyRobbinsUtils } from './TonyRobbinsEvaluationFramework';

/**
 * Coaching Evaluation Service
 * Integrates Tony Robbins methodology with ICF standards
 * Provides real-time and post-session evaluation for text-based coaching
 */

export interface RealTimeEvaluation {
  currentScore: number;
  suggestions: string[];
  nextQuestionRecommendation: string;
  breakthroughAlert?: string;
  sixNeedsStatus: { [key in SixHumanNeeds]: boolean };
}

export interface DetailedSessionAnalysis {
  coachingReport: CoachingReport;
  sessionMetrics: SessionMetrics;
  culturalContextAnalysis: CulturalContextAnalysis;
  improvementPlan: ImprovementPlan;
}

export interface SessionMetrics {
  totalMessages: number;
  coachToClientRatio: number;
  averageMessageLength: number;
  questionToStatementRatio: number;
  breakthroughMoments: number;
  emotionalProgressionScore: number;
}

export interface CulturalContextAnalysis {
  familyPressureAddressed: boolean;
  workLifeBalanceDiscussed: boolean;
  financialConcernsAcknowledged: boolean;
  culturalSensitivityScore: number;
  recommendations: string[];
}

export interface ImprovementPlan {
  immediateActions: string[];
  skillDevelopmentAreas: string[];
  tonyRobbinsTechniquesToPractice: string[];
  nextSessionPreparation: string[];
}

export class CoachingEvaluationService {
  private static instance: CoachingEvaluationService;
  private evaluationHistory: Map<string, CoachingReport[]> = new Map();

  public static getInstance(): CoachingEvaluationService {
    if (!CoachingEvaluationService.instance) {
      CoachingEvaluationService.instance = new CoachingEvaluationService();
    }
    return CoachingEvaluationService.instance;
  }

  // Real-time evaluation during coaching session
  public evaluateRealTime(
    messages: Message[], 
    personaProfile: PersonaProfile
  ): RealTimeEvaluation {
    const coachMessages = messages.filter(m => m.role === 'coach');
    const clientMessages = messages.filter(m => m.role === 'client');
    
    // Calculate current performance score
    const currentScore = this.calculateRealTimeScore(messages);
    
    // Generate suggestions based on current session
    const suggestions = this.generateRealTimeSuggestions(messages, personaProfile);
    
    // Recommend next question based on Tony Robbins methodology
    const nextQuestionRecommendation = this.recommendNextQuestion(messages, personaProfile);
    
    // Check for breakthrough moments
    const breakthroughAlert = this.checkForBreakthrough(clientMessages);
    
    // Assess which of the six human needs are being addressed
    const sixNeedsStatus = TonyRobbinsEvaluationFramework.identifyHumanNeedsAddressed(messages);

    return {
      currentScore,
      suggestions,
      nextQuestionRecommendation,
      breakthroughAlert,
      sixNeedsStatus
    };
  }

  // Comprehensive post-session evaluation
  public evaluateSession(
    session: CoachingSession, 
    personaProfile: PersonaProfile
  ): DetailedSessionAnalysis {
    // Generate main coaching report using Tony Robbins framework
    const coachingReport = TonyRobbinsEvaluationFramework.evaluateCoachingSession(session);
    
    // Calculate detailed session metrics
    const sessionMetrics = this.calculateSessionMetrics(session.messages);
    
    // Analyze cultural context specific to Indian professionals
    const culturalContextAnalysis = this.analyzeCulturalContext(session.messages, personaProfile);
    
    // Create personalized improvement plan
    const improvementPlan = this.createImprovementPlan(coachingReport, personaProfile);
    
    // Store evaluation for historical tracking
    this.storeEvaluation(session.personaId, coachingReport);

    return {
      coachingReport,
      sessionMetrics,
      culturalContextAnalysis,
      improvementPlan
    };
  }

  // Calculate real-time performance score
  private calculateRealTimeScore(messages: Message[]): number {
    if (messages.length < 2) return 0;
    
    const coachMessages = messages.filter(m => m.role === 'coach');
    let score = 0;
    let factors = 0;
    
    // Factor 1: Question quality (Tony Robbins style)
    const questionQualityScore = this.assessQuestionQuality(coachMessages);
    score += questionQualityScore;
    factors++;
    
    // Factor 2: Active listening indicators
    const listeningScore = this.assessActiveListening(messages);
    score += listeningScore;
    factors++;
    
    // Factor 3: Rapport building
    const rapportScore = this.assessRapport(messages);
    score += rapportScore;
    factors++;
    
    return factors > 0 ? Math.round(score / factors) : 0;
  }

  // Generate real-time suggestions based on current session flow
  private generateRealTimeSuggestions(messages: Message[], persona: PersonaProfile): string[] {
    const suggestions: string[] = [];
    const coachMessages = messages.filter(m => m.role === 'coach');
    const latestClientMessage = messages.filter(m => m.role === 'client').pop();
    
    if (!latestClientMessage) return suggestions;
    
    // Analyze latest client response for coaching opportunities
    const clientContent = latestClientMessage.content.toLowerCase();
    
    // Suggestion based on emotional state
    if (clientContent.includes('stressed') || clientContent.includes('anxious') || clientContent.includes('overwhelmed')) {
      suggestions.push('🎯 State Management Opportunity: Help them shift their emotional state with empowering questions');
    }
    
    // Suggestion based on limiting beliefs
    if (clientContent.includes('can\'t') || clientContent.includes('impossible') || clientContent.includes('never')) {
      suggestions.push('💡 Limiting Belief Detected: Challenge this belief with "What if that weren\'t true?" or "What would have to happen for this to be possible?"');
    }
    
    // Suggestion based on problem focus
    if (clientContent.includes('problem') || clientContent.includes('issue') || clientContent.includes('difficulty')) {
      suggestions.push('🚀 Reframe Opportunity: Shift from problem to outcome - ask "What do you want instead?"');
    }
    
    // Suggestion based on cultural context
    if (clientContent.includes('family') || clientContent.includes('parents') || clientContent.includes('society')) {
      suggestions.push('🏮 Cultural Sensitivity: Acknowledge family pressures while empowering personal choice');
    }
    
    // Suggestion based on lack of clarity
    if (clientContent.includes('confused') || clientContent.includes('don\'t know') || clientContent.includes('unsure')) {
      suggestions.push('🎲 Clarity Needed: Use Tony\'s chunking questions - "What specifically do you mean by...?"');
    }
    
    return suggestions;
  }

  // Recommend next question based on Tony Robbins methodology
  private recommendNextQuestion(messages: Message[], persona: PersonaProfile): string {
    const clientMessages = messages.filter(m => m.role === 'client');
    const latestClient = clientMessages[clientMessages.length - 1];
    
    if (!latestClient) {
      return "What's the most important thing you'd like to focus on in your life right now?";
    }
    
    const content = latestClient.content.toLowerCase();
    
    // Tony Robbins' question selection based on client state
    if (content.includes('goal') || content.includes('want')) {
      return "What would achieving this goal give you that's even more important?";
    }
    
    if (content.includes('problem') || content.includes('challenge')) {
      return "What's great about this challenge that you might not have considered?";
    }
    
    if (content.includes('stuck') || content.includes('confused')) {
      return "If you knew you couldn't fail, what would you do right now?";
    }
    
    if (content.includes('family') || content.includes('pressure')) {
      return "What would honoring both your family's values and your own dreams look like?";
    }
    
    // Default Tony Robbins style question
    const defaultQuestions = [
      "What do you really want here?",
      "What would have to happen for you to feel totally fulfilled?",
      "What's one decision you could make right now that would change everything?",
      "What are you most grateful for in this situation?",
      "What action could you take today that would move you closer to your dreams?"
    ];
    
    return defaultQuestions[Math.floor(Math.random() * defaultQuestions.length)];
  }

  // Check for breakthrough moments in recent client messages
  private checkForBreakthrough(clientMessages: Message[]): string | undefined {
    const recentMessages = clientMessages.slice(-2); // Check last 2 messages
    
    for (const message of recentMessages) {
      const breakthrough = TonyRobbinsUtils.detectBreakthrough(message.content);
      if (breakthrough) {
        return `🔥 BREAKTHROUGH DETECTED: ${breakthrough.description}`;
      }
    }
    
    return undefined;
  }

  // Assessment helper methods
  private assessQuestionQuality(coachMessages: Message[]): number {
    if (coachMessages.length === 0) return 0;
    
    let qualityScore = 0;
    let questionCount = 0;
    
    coachMessages.forEach(message => {
      const questions = message.content.split('?').length - 1;
      questionCount += questions;
      
      if (questions > 0) {
        const category = TonyRobbinsUtils.assessQuestionQuality(message.content);
        if (category) qualityScore += 20; // High-quality question
        else qualityScore += 5; // Basic question
      }
    });
    
    return questionCount > 0 ? Math.min(100, qualityScore / questionCount * 5) : 0;
  }

  private assessActiveListening(messages: Message[]): number {
    const coachMessages = messages.filter(m => m.role === 'coach');
    if (coachMessages.length < 2) return 0;
    
    let listeningIndicators = 0;
    const totalMessages = coachMessages.length;
    
    // Check for acknowledgment patterns
    const acknowledgmentPatterns = [
      'I hear', 'It sounds like', 'What I understand', 'So you\'re saying',
      'Let me reflect', 'I sense that', 'What I\'m hearing'
    ];
    
    coachMessages.forEach(message => {
      const hasAcknowledgment = acknowledgmentPatterns.some(pattern =>
        message.content.toLowerCase().includes(pattern.toLowerCase())
      );
      if (hasAcknowledgment) listeningIndicators++;
    });
    
    return Math.min(100, (listeningIndicators / totalMessages) * 100);
  }

  private assessRapport(messages: Message[]): number {
    const coachMessages = messages.filter(m => m.role === 'coach');
    if (coachMessages.length === 0) return 0;
    
    let rapportScore = 0;
    const rapportIndicators = [
      'I understand', 'That makes sense', 'I can see', 'I appreciate',
      'That\'s completely normal', 'Many people feel', 'You\'re not alone'
    ];
    
    coachMessages.forEach(message => {
      const content = message.content;
      rapportIndicators.forEach(indicator => {
        if (content.toLowerCase().includes(indicator.toLowerCase())) {
          rapportScore++;
        }
      });
    });
    
    return Math.min(100, (rapportScore / coachMessages.length) * 50);
  }

  // Calculate comprehensive session metrics
  private calculateSessionMetrics(messages: Message[]): SessionMetrics {
    const coachMessages = messages.filter(m => m.role === 'coach');
    const clientMessages = messages.filter(m => m.role === 'client');
    
    const totalMessages = messages.length;
    const coachToClientRatio = clientMessages.length > 0 ? coachMessages.length / clientMessages.length : 0;
    
    const averageMessageLength = messages.reduce((sum, msg) => sum + msg.content.length, 0) / totalMessages;
    
    // Count questions vs statements in coach messages
    let questionCount = 0;
    let statementCount = 0;
    
    coachMessages.forEach(message => {
      const questions = (message.content.match(/\?/g) || []).length;
      questionCount += questions;
      if (questions === 0) statementCount++;
    });
    
    const questionToStatementRatio = statementCount > 0 ? questionCount / statementCount : questionCount;
    
    // Count breakthrough moments
    let breakthroughMoments = 0;
    clientMessages.forEach(message => {
      if (TonyRobbinsUtils.detectBreakthrough(message.content)) {
        breakthroughMoments++;
      }
    });
    
    // Assess emotional progression (simplified)
    const emotionalProgressionScore = this.calculateEmotionalProgression(clientMessages);
    
    return {
      totalMessages,
      coachToClientRatio,
      averageMessageLength,
      questionToStatementRatio,
      breakthroughMoments,
      emotionalProgressionScore
    };
  }

  // Analyze cultural context for Indian professionals
  private analyzeCulturalContext(messages: Message[], persona: PersonaProfile): CulturalContextAnalysis {
    const allContent = messages.map(m => m.content.toLowerCase()).join(' ');
    
    const familyPressureAddressed = /family|parents|marriage|tradition|society|cultural/.test(allContent);
    const workLifeBalanceDiscussed = /work.life|balance|overtime|stress|career/.test(allContent);
    const financialConcernsAcknowledged = /money|salary|financial|income|expense|saving/.test(allContent);
    
    let culturalSensitivityScore = 0;
    
    // Check for culturally sensitive responses
    const culturalIndicators = [
      'understand the family pressure',
      'cultural expectations',
      'honoring your values',
      'balancing tradition and personal goals',
      'respecting your background'
    ];
    
    const coachMessages = messages.filter(m => m.role === 'coach');
    coachMessages.forEach(message => {
      culturalIndicators.forEach(indicator => {
        if (message.content.toLowerCase().includes(indicator)) {
          culturalSensitivityScore += 20;
        }
      });
    });
    
    culturalSensitivityScore = Math.min(100, culturalSensitivityScore);
    
    const recommendations: string[] = [];
    if (!familyPressureAddressed) {
      recommendations.push('Address family and cultural pressures more directly in future sessions');
    }
    if (!workLifeBalanceDiscussed) {
      recommendations.push('Explore work-life balance challenges specific to Indian work culture');
    }
    if (!financialConcernsAcknowledged) {
      recommendations.push('Acknowledge financial planning concerns common to Indian metro professionals');
    }
    if (culturalSensitivityScore < 60) {
      recommendations.push('Increase cultural sensitivity by acknowledging traditional values while empowering personal choice');
    }
    
    return {
      familyPressureAddressed,
      workLifeBalanceDiscussed,
      financialConcernsAcknowledged,
      culturalSensitivityScore,
      recommendations
    };
  }

  // Create personalized improvement plan
  private createImprovementPlan(report: CoachingReport, persona: PersonaProfile): ImprovementPlan {
    const immediateActions: string[] = [];
    const skillDevelopmentAreas: string[] = [];
    const tonyRobbinsTechniquesToPractice: string[] = [];
    const nextSessionPreparation: string[] = [];
    
    // Analyze scores and create specific recommendations
    if (report.coachPerformance.activeListening.score < 70) {
      immediateActions.push('Practice more acknowledgment phrases: "What I hear you saying is..."');
      skillDevelopmentAreas.push('Active Listening in Text-Based Coaching');
    }
    
    if (report.coachPerformance.powerfulQuestioning.score < 70) {
      immediateActions.push('Use Tony Robbins\' quality questions: "What do you really want?"');
      tonyRobbinsTechniquesToPractice.push('Outcome-focused questioning');
    }
    
    if (report.coachPerformance.breakthroughCreation.score < 50) {
      skillDevelopmentAreas.push('Creating breakthrough moments through reframing');
      tonyRobbinsTechniquesToPractice.push('Belief challenging and perspective shifting');
    }
    
    // Persona-specific recommendations
    if (persona.personalityTraits.emotionalState === 'anxious') {
      nextSessionPreparation.push('Focus on state management techniques for anxiety');
      tonyRobbinsTechniquesToPractice.push('State change through empowering questions');
    }
    
    if (persona.coreProblems.some(problem => problem.includes('family') || problem.includes('pressure'))) {
      nextSessionPreparation.push('Prepare culturally sensitive approaches to family pressure');
      immediateActions.push('Research family dynamics in Indian metro professional context');
    }
    
    // Always include Tony Robbins fundamentals
    tonyRobbinsTechniquesToPractice.push('RPM Method (Results, Purpose, Massive Action)');
    tonyRobbinsTechniquesToPractice.push('Six Human Needs assessment');
    
    return {
      immediateActions,
      skillDevelopmentAreas,
      tonyRobbinsTechniquesToPractice,
      nextSessionPreparation
    };
  }

  // Helper method for emotional progression calculation
  private calculateEmotionalProgression(clientMessages: Message[]): number {
    if (clientMessages.length < 2) return 0;
    
    const firstMessage = clientMessages[0].content.toLowerCase();
    const lastMessage = clientMessages[clientMessages.length - 1].content.toLowerCase();
    
    // Simple sentiment analysis
    const negativeWords = ['stuck', 'confused', 'overwhelmed', 'anxious', 'frustrated', 'hopeless'];
    const positiveWords = ['clear', 'confident', 'excited', 'motivated', 'ready', 'understand'];
    
    let firstScore = 0;
    let lastScore = 0;
    
    negativeWords.forEach(word => {
      if (firstMessage.includes(word)) firstScore -= 10;
      if (lastMessage.includes(word)) lastScore -= 10;
    });
    
    positiveWords.forEach(word => {
      if (firstMessage.includes(word)) firstScore += 10;
      if (lastMessage.includes(word)) lastScore += 10;
    });
    
    return Math.max(0, Math.min(100, 50 + (lastScore - firstScore)));
  }

  // Store evaluation for historical tracking
  private storeEvaluation(personaId: string, report: CoachingReport): void {
    if (!this.evaluationHistory.has(personaId)) {
      this.evaluationHistory.set(personaId, []);
    }
    this.evaluationHistory.get(personaId)!.push(report);
  }

  // Get evaluation history for progress tracking
  public getEvaluationHistory(personaId: string): CoachingReport[] {
    return this.evaluationHistory.get(personaId) || [];
  }

  // Generate progress report across multiple sessions
  public generateProgressReport(personaId: string): any {
    const history = this.getEvaluationHistory(personaId);
    if (history.length < 2) return null;
    
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    
    return {
      improvement: {
        activeListening: latest.coachPerformance.activeListening.score - previous.coachPerformance.activeListening.score,
        powerfulQuestioning: latest.coachPerformance.powerfulQuestioning.score - previous.coachPerformance.powerfulQuestioning.score,
        rapportBuilding: latest.coachPerformance.rapportBuilding.score - previous.coachPerformance.rapportBuilding.score,
        breakthroughCreation: latest.coachPerformance.breakthroughCreation.score - previous.coachPerformance.breakthroughCreation.score
      },
      overallTrend: latest.coachPerformance.overallEffectiveness.score - previous.coachPerformance.overallEffectiveness.score,
      sessionsAnalyzed: history.length
    };
  }
}