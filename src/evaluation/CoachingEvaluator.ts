import { Message, CoachingSession, EvaluationCriteria, CoachingReport } from '../types';
import { PersonaProfile } from '../types';

interface TonyRobbinsMetrics {
  sixNeedsAddressed: string[];
  stateManagement: number;
  powerfulQuestions: number;
  breakthroughMoments: number;
  outcomeOrientation: number;
  beliefSystemWork: number;
  energyAndRapport: number;
}

interface ICFMetrics {
  activeListening: number;
  powerfulQuestioning: number;
  rapportBuilding: number;
  goalSetting: number;
  awarenessEvocation: number;
  clientGrowth: number;
  coachingPresence: number;
}

export class CoachingEvaluator {
  
  public evaluateSession(
    session: CoachingSession,
    persona: PersonaProfile
  ): CoachingReport {
    const coachMessages = session.messages.filter(msg => msg.role === 'coach');
    const clientMessages = session.messages.filter(msg => msg.role === 'client');
    
    // Check for minimum session length - if too short, return low scores
    const sessionQualityMultiplier = this.getSessionQualityMultiplier(coachMessages.length);
    
    // Tony Robbins evaluation
    const tonyRobbinsMetrics = this.evaluateTonyRobbinsApproach(coachMessages, clientMessages, persona);
    
    // ICF evaluation
    const icfMetrics = this.evaluateICFCompetencies(coachMessages, clientMessages);
    
    // Cultural sensitivity evaluation
    const culturalSensitivity = this.evaluateCulturalSensitivity(coachMessages, persona);
    
    // Apply session quality multiplier to all scores
    this.applySessionQualityMultiplier(tonyRobbinsMetrics, icfMetrics, sessionQualityMultiplier);
    
    // Generate overall performance
    const overallScore = this.calculateOverallScore(tonyRobbinsMetrics, icfMetrics, culturalSensitivity);
    
    return {
      sessionId: session.id,
      personaId: session.personaId,
      coachPerformance: {
        activeListening: this.buildActiveListeningFeedback(coachMessages, clientMessages),
        powerfulQuestioning: this.buildPowerfulQuestioningFeedback(tonyRobbinsMetrics, icfMetrics),
        rapportBuilding: this.buildRapportBuildingFeedback(coachMessages, clientMessages),
        goalSetting: this.buildGoalSettingFeedback(coachMessages),
        breakthroughCreation: this.buildBreakthroughFeedback(tonyRobbinsMetrics, clientMessages),
        overallEffectiveness: {
          score: overallScore,
          feedback: this.generateOverallFeedback(overallScore, tonyRobbinsMetrics),
          recommendations: this.generateRecommendations(tonyRobbinsMetrics, icfMetrics)
        }
      },
      sessionSummary: this.generateSessionSummary(session, tonyRobbinsMetrics),
      clientProgression: this.analyzeClientProgression(clientMessages),
      areasForImprovement: this.identifyImprovementAreas(tonyRobbinsMetrics, icfMetrics),
      strengths: this.identifyStrengths(tonyRobbinsMetrics, icfMetrics),
      nextSessionRecommendations: this.generateNextSessionRecommendations(persona, tonyRobbinsMetrics),
      tonyRobbinsStyleFeedback: this.generateTonyRobbinsStyleFeedback(tonyRobbinsMetrics, overallScore)
    };
  }

  private evaluateTonyRobbinsApproach(
    coachMessages: Message[],
    clientMessages: Message[],
    persona: PersonaProfile
  ): TonyRobbinsMetrics {
    return {
      sixNeedsAddressed: this.identifySixNeedsAddressed(coachMessages, persona),
      stateManagement: this.evaluateStateManagement(coachMessages, clientMessages),
      powerfulQuestions: this.evaluatePowerfulQuestions(coachMessages),
      breakthroughMoments: this.detectBreakthroughMoments(clientMessages),
      outcomeOrientation: this.evaluateOutcomeOrientation(coachMessages),
      beliefSystemWork: this.evaluateBeliefSystemWork(coachMessages, clientMessages),
      energyAndRapport: this.evaluateEnergyAndRapport(coachMessages, clientMessages)
    };
  }

  private evaluateICFCompetencies(coachMessages: Message[], clientMessages: Message[]): ICFMetrics {
    return {
      activeListening: this.evaluateActiveListening(coachMessages, clientMessages),
      powerfulQuestioning: this.evaluateICFQuestioning(coachMessages),
      rapportBuilding: this.evaluateRapportBuilding(coachMessages, clientMessages),
      goalSetting: this.evaluateGoalSetting(coachMessages),
      awarenessEvocation: this.evaluateAwarenessEvocation(coachMessages, clientMessages),
      clientGrowth: this.evaluateClientGrowth(clientMessages),
      coachingPresence: this.evaluateCoachingPresence(coachMessages)
    };
  }

  private identifySixNeedsAddressed(coachMessages: Message[], persona: PersonaProfile): string[] {
    const needs: string[] = [];
    const allText = coachMessages.map(msg => msg.content.toLowerCase()).join(' ');
    
    // Certainty
    if (this.containsPatterns(allText, ['plan', 'structure', 'security', 'stability', 'consistent'])) {
      needs.push('Certainty');
    }
    
    // Variety
    if (this.containsPatterns(allText, ['options', 'different', 'change', 'variety', 'new'])) {
      needs.push('Variety');
    }
    
    // Significance
    if (this.containsPatterns(allText, ['important', 'special', 'unique', 'valuable', 'matter'])) {
      needs.push('Significance');
    }
    
    // Love/Connection
    if (this.containsPatterns(allText, ['connect', 'relationship', 'support', 'understand', 'care'])) {
      needs.push('Love/Connection');
    }
    
    // Growth
    if (this.containsPatterns(allText, ['grow', 'learn', 'develop', 'improve', 'better'])) {
      needs.push('Growth');
    }
    
    // Contribution
    if (this.containsPatterns(allText, ['help', 'serve', 'contribute', 'impact', 'difference'])) {
      needs.push('Contribution');
    }
    
    return needs;
  }

  private evaluateStateManagement(coachMessages: Message[], clientMessages: Message[]): number {
    let score = 0;
    const totalMessages = coachMessages.length;
    
    coachMessages.forEach((msg, index) => {
      const msgText = msg.content.toLowerCase();
      
      // Check for state change techniques
      if (this.containsPatterns(msgText, ['feel', 'emotion', 'energy', 'excited', 'confident'])) {
        score += 15;
      }
      
      // Check for physiology references
      if (this.containsPatterns(msgText, ['breathe', 'posture', 'body', 'physical'])) {
        score += 10;
      }
      
      // Check if coach acknowledges emotional state
      if (index < clientMessages.length) {
        const clientResponse = clientMessages[index].content.toLowerCase();
        if (this.detectEmotionalShift(clientResponse)) {
          score += 20;
        }
      }
    });
    
    return Math.min(100, score / totalMessages * 10);
  }

  private evaluatePowerfulQuestions(coachMessages: Message[]): number {
    let powerfulQuestionCount = 0;
    let totalQuestions = 0;
    
    coachMessages.forEach(msg => {
      const questions = msg.content.split('?').length - 1;
      totalQuestions += questions;
      
      const msgText = msg.content.toLowerCase();
      
      // Tony Robbins style powerful questions
      if (this.containsPatterns(msgText, [
        'what would happen if',
        'what\'s possible',
        'what do you really want',
        'what\'s stopping you',
        'what would it mean',
        'how would you feel if',
        'what needs to change',
        'what would you do if you knew you couldn\'t fail'
      ])) {
        powerfulQuestionCount += 2;
      }
      
      // Outcome-focused questions
      if (this.containsPatterns(msgText, [
        'what do you want',
        'what\'s your goal',
        'what outcome',
        'what result',
        'what does success look like'
      ])) {
        powerfulQuestionCount += 1;
      }
      
      // Empowering questions
      if (this.containsPatterns(msgText, [
        'what resources do you have',
        'what\'s worked before',
        'what are you good at',
        'what\'s your strength'
      ])) {
        powerfulQuestionCount += 1;
      }
    });
    
    return totalQuestions > 0 ? Math.min(100, (powerfulQuestionCount / totalQuestions) * 100) : 0;
  }

  private detectBreakthroughMoments(clientMessages: Message[]): number {
    let breakthroughCount = 0;
    
    clientMessages.forEach(msg => {
      const msgText = msg.content.toLowerCase();
      
      // Breakthrough indicators
      if (this.containsPatterns(msgText, [
        'i never thought',
        'i realize',
        'aha',
        'now i see',
        'that makes sense',
        'i understand now',
        'wow',
        'that\'s it',
        'i get it'
      ])) {
        breakthroughCount++;
      }
      
      // Emotional shifts
      if (this.containsPatterns(msgText, [
        'i feel different',
        'i\'m excited',
        'i\'m motivated',
        'i feel lighter',
        'i feel empowered'
      ])) {
        breakthroughCount++;
      }
    });
    
    return Math.min(100, breakthroughCount * 25);
  }

  private evaluateOutcomeOrientation(coachMessages: Message[]): number {
    let outcomeScore = 0;
    
    coachMessages.forEach(msg => {
      const msgText = msg.content.toLowerCase();
      
      // Outcome-focused language
      if (this.containsPatterns(msgText, [
        'what do you want',
        'what\'s your goal',
        'what outcome',
        'what result',
        'what does success',
        'what would achievement',
        'what\'s your vision'
      ])) {
        outcomeScore += 20;
      }
      
      // Action-oriented questions
      if (this.containsPatterns(msgText, [
        'what will you do',
        'what\'s your next step',
        'what action',
        'how will you',
        'when will you'
      ])) {
        outcomeScore += 15;
      }
    });
    
    return Math.min(100, outcomeScore / coachMessages.length * 5);
  }

  private evaluateBeliefSystemWork(coachMessages: Message[], clientMessages: Message[]): number {
    let beliefWorkScore = 0;
    
    coachMessages.forEach(msg => {
      const msgText = msg.content.toLowerCase();
      
      // Belief challenging questions
      if (this.containsPatterns(msgText, [
        'what if that\'s not true',
        'is that always the case',
        'what evidence',
        'what assumptions',
        'what beliefs',
        'what\'s another way to look at this',
        'what if you\'re wrong about'
      ])) {
        beliefWorkScore += 25;
      }
      
      // Empowering reframes
      if (this.containsPatterns(msgText, [
        'another perspective',
        'different way to see',
        'opportunity',
        'learning experience',
        'what if this is actually'
      ])) {
        beliefWorkScore += 20;
      }
    });
    
    return Math.min(100, beliefWorkScore / coachMessages.length * 5);
  }

  private evaluateActiveListening(coachMessages: Message[], clientMessages: Message[]): number {
    let listeningScore = 0;
    
    coachMessages.forEach((msg, index) => {
      if (index > 0) {
        const previousClientMsg = clientMessages[index - 1]?.content.toLowerCase() || '';
        const msgText = msg.content.toLowerCase();
        
        // Paraphrasing
        if (this.containsPhrases(msgText, ['what i hear you saying', 'it sounds like', 'if i understand correctly'])) {
          listeningScore += 20;
        }
        
        // Acknowledgment
        if (this.containsPhrases(msgText, ['i understand', 'that makes sense', 'i can see why'])) {
          listeningScore += 15;
        }
        
        // Reflecting emotions
        if (this.containsPhrases(msgText, ['you sound', 'you seem', 'you feel'])) {
          listeningScore += 15;
        }
      }
    });
    
    return Math.min(100, listeningScore / coachMessages.length * 5);
  }

  private containsPatterns(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern));
  }

  private containsPhrases(text: string, phrases: string[]): boolean {
    return phrases.some(phrase => text.includes(phrase));
  }

  private detectEmotionalShift(text: string): boolean {
    const positiveEmotions = ['excited', 'motivated', 'confident', 'empowered', 'hopeful'];
    return positiveEmotions.some(emotion => text.includes(emotion));
  }

  private evaluateEnergyAndRapport(coachMessages: Message[], clientMessages: Message[]): number {
    // Simplified energy evaluation based on language patterns
    let energyScore = 0;
    
    coachMessages.forEach(msg => {
      const msgText = msg.content.toLowerCase();
      
      // High energy language
      if (this.containsPatterns(msgText, ['amazing', 'fantastic', 'incredible', 'powerful', 'outstanding'])) {
        energyScore += 15;
      }
      
      // Encouraging language
      if (this.containsPatterns(msgText, ['you can', 'you\'re capable', 'you have what it takes', 'you\'ve got this'])) {
        energyScore += 10;
      }
    });
    
    return Math.min(100, energyScore / coachMessages.length * 10);
  }

  private getSessionQualityMultiplier(coachMessageCount: number): number {
    // Penalize very short sessions heavily
    if (coachMessageCount === 0) return 0;
    if (coachMessageCount === 1) return 0.1;
    if (coachMessageCount === 2) return 0.3;
    if (coachMessageCount === 3) return 0.5;
    if (coachMessageCount >= 4 && coachMessageCount < 6) return 0.7;
    if (coachMessageCount >= 6 && coachMessageCount < 8) return 0.9;
    return 1.0; // Full score for 8+ messages
  }

  private applySessionQualityMultiplier(
    tonyRobbins: TonyRobbinsMetrics,
    icf: ICFMetrics,
    multiplier: number
  ): void {
    // Apply multiplier to Tony Robbins metrics
    tonyRobbins.stateManagement *= multiplier;
    tonyRobbins.powerfulQuestions *= multiplier;
    tonyRobbins.breakthroughMoments *= multiplier;
    tonyRobbins.outcomeOrientation *= multiplier;
    tonyRobbins.beliefSystemWork *= multiplier;
    tonyRobbins.energyAndRapport *= multiplier;

    // Apply multiplier to ICF metrics
    icf.activeListening *= multiplier;
    icf.powerfulQuestioning *= multiplier;
    icf.rapportBuilding *= multiplier;
    icf.goalSetting *= multiplier;
    icf.awarenessEvocation *= multiplier;
    icf.clientGrowth *= multiplier;
    icf.coachingPresence *= multiplier;
  }

  // Additional ICF evaluation methods would go here...
  private evaluateICFQuestioning(coachMessages: Message[]): number {
    if (coachMessages.length === 0) return 0;
    
    let questionCount = 0;
    let qualityScore = 0;
    
    coachMessages.forEach(msg => {
      const questions = msg.content.split('?').length - 1;
      questionCount += questions;
      
      // Look for quality questioning patterns
      const msgLower = msg.content.toLowerCase();
      if (msgLower.includes('what') || msgLower.includes('how')) {
        qualityScore += 10;
      }
      if (msgLower.includes('tell me more') || msgLower.includes('help me understand')) {
        qualityScore += 15;
      }
    });
    
    return Math.min(100, questionCount > 0 ? qualityScore / coachMessages.length * 5 : 0);
  }

  private evaluateRapportBuilding(coachMessages: Message[], clientMessages: Message[]): number {
    if (coachMessages.length === 0) return 0;
    
    let rapportScore = 0;
    
    coachMessages.forEach((msg, index) => {
      const msgLower = msg.content.toLowerCase();
      
      // Empathy and validation
      if (this.containsPatterns(msgLower, ['i understand', 'that makes sense', 'i can see why', 'i hear you'])) {
        rapportScore += 20;
      }
      
      // Active listening indicators
      if (this.containsPatterns(msgLower, ['you mentioned', 'you said', 'what i\'m hearing'])) {
        rapportScore += 15;
      }
    });
    
    return Math.min(100, rapportScore / coachMessages.length * 3);
  }

  private evaluateGoalSetting(coachMessages: Message[]): number {
    if (coachMessages.length === 0) return 0;
    
    let goalScore = 0;
    
    coachMessages.forEach(msg => {
      const msgLower = msg.content.toLowerCase();
      
      // Goal-oriented language
      if (this.containsPatterns(msgLower, ['what do you want', 'what\'s your goal', 'what would success', 'what outcome'])) {
        goalScore += 25;
      }
      
      // Action planning
      if (this.containsPatterns(msgLower, ['what will you do', 'what\'s your next step', 'how will you', 'when will you'])) {
        goalScore += 20;
      }
    });
    
    return Math.min(100, goalScore / coachMessages.length * 2);
  }

  private evaluateAwarenessEvocation(coachMessages: Message[], clientMessages: Message[]): number {
    if (coachMessages.length === 0) return 0;
    
    let awarenessScore = 0;
    
    // Look for insight-generating questions
    coachMessages.forEach(msg => {
      const msgLower = msg.content.toLowerCase();
      
      if (this.containsPatterns(msgLower, ['what do you notice', 'what patterns', 'what\'s the connection', 'what does this tell you'])) {
        awarenessScore += 25;
      }
    });
    
    // Look for client insights in responses
    clientMessages.forEach(msg => {
      const msgLower = msg.content.toLowerCase();
      
      if (this.containsPatterns(msgLower, ['i realize', 'i see', 'i notice', 'i understand', 'that makes me think'])) {
        awarenessScore += 15;
      }
    });
    
    return Math.min(100, awarenessScore / Math.max(coachMessages.length, 1) * 2);
  }

  private evaluateClientGrowth(clientMessages: Message[]): number {
    if (clientMessages.length <= 1) return 0;
    
    // Compare first and last client messages for growth indicators
    const firstMessage = clientMessages[0]?.content.toLowerCase() || '';
    const lastMessage = clientMessages[clientMessages.length - 1]?.content.toLowerCase() || '';
    
    let growthScore = 0;
    
    // Look for positive language progression
    const positiveWords = ['confident', 'ready', 'excited', 'clear', 'motivated', 'empowered'];
    const negativeWords = ['confused', 'stuck', 'overwhelmed', 'frustrated', 'lost'];
    
    const finalPositive = positiveWords.some(word => lastMessage.includes(word));
    const initialNegative = negativeWords.some(word => firstMessage.includes(word));
    
    if (finalPositive && initialNegative) growthScore += 50;
    else if (finalPositive) growthScore += 30;
    
    return Math.min(100, growthScore);
  }

  private evaluateCoachingPresence(coachMessages: Message[]): number {
    if (coachMessages.length === 0) return 0;
    
    let presenceScore = 0;
    
    coachMessages.forEach(msg => {
      const msgLower = msg.content.toLowerCase();
      
      // Present-moment awareness
      if (this.containsPatterns(msgLower, ['right now', 'in this moment', 'what\'s happening for you', 'what are you experiencing'])) {
        presenceScore += 20;
      }
      
      // Non-judgmental language
      if (!this.containsPatterns(msgLower, ['should', 'must', 'have to', 'wrong', 'bad'])) {
        presenceScore += 5;
      }
    });
    
    return Math.min(100, presenceScore / coachMessages.length * 8);
  }

  private evaluateCulturalSensitivity(coachMessages: Message[], persona: PersonaProfile): number {
    let culturalScore = 0;
    
    coachMessages.forEach(msg => {
      const msgText = msg.content.toLowerCase();
      
      // Check for cultural awareness
      if (persona.city === 'Mumbai' && msgText.includes('family pressure')) culturalScore += 10;
      if (persona.city === 'Delhi' && msgText.includes('status')) culturalScore += 10;
      if (persona.city === 'Bangalore' && msgText.includes('work pressure')) culturalScore += 10;
      
      // Avoid cultural insensitivity
      if (!this.containsPatterns(msgText, ['just leave', 'ignore family', 'western approach'])) {
        culturalScore += 5;
      }
    });
    
    return Math.min(100, culturalScore);
  }

  private calculateOverallScore(
    tonyRobbins: TonyRobbinsMetrics,
    icf: ICFMetrics,
    cultural: number
  ): number {
    const trAvg = (
      tonyRobbins.stateManagement +
      tonyRobbins.powerfulQuestions +
      tonyRobbins.breakthroughMoments +
      tonyRobbins.outcomeOrientation +
      tonyRobbins.beliefSystemWork +
      tonyRobbins.energyAndRapport
    ) / 6;
    
    const icfAvg = (
      icf.activeListening +
      icf.powerfulQuestioning +
      icf.rapportBuilding +
      icf.goalSetting +
      icf.awarenessEvocation +
      icf.clientGrowth +
      icf.coachingPresence
    ) / 7;
    
    return Math.round((trAvg * 0.5 + icfAvg * 0.4 + cultural * 0.1));
  }

  // Helper methods for building feedback sections
  private buildActiveListeningFeedback(coachMessages: Message[], clientMessages: Message[]) {
    const score = this.evaluateActiveListening(coachMessages, clientMessages);
    return {
      score,
      feedback: this.getActiveListeningFeedback(score),
      examples: this.getActiveListeningExamples(coachMessages)
    };
  }

  private buildPowerfulQuestioningFeedback(tonyRobbins: TonyRobbinsMetrics, icf: ICFMetrics) {
    const score = Math.round((tonyRobbins.powerfulQuestions + icf.powerfulQuestioning) / 2);
    return {
      score,
      feedback: this.getPowerfulQuestioningFeedback(score),
      examples: this.getPowerfulQuestioningExamples(score)
    };
  }

  private buildRapportBuildingFeedback(coachMessages: Message[], clientMessages: Message[]) {
    const score = this.evaluateRapportBuilding(coachMessages, clientMessages);
    return {
      score,
      feedback: this.getRapportBuildingFeedback(score),
      examples: this.getRapportBuildingExamples(score)
    };
  }

  private buildGoalSettingFeedback(coachMessages: Message[]) {
    const score = this.evaluateGoalSetting(coachMessages);
    return {
      score,
      feedback: this.getGoalSettingFeedback(score),
      examples: this.getGoalSettingExamples(score)
    };
  }

  private buildBreakthroughFeedback(tonyRobbins: TonyRobbinsMetrics, clientMessages: Message[]) {
    const score = tonyRobbins.breakthroughMoments;
    return {
      score,
      feedback: this.getBreakthroughFeedback(score),
      examples: this.getBreakthroughExamples(clientMessages)
    };
  }

  // Feedback generation methods
  private getActiveListeningFeedback(score: number): string {
    if (score >= 85) return "Excellent active listening! You consistently acknowledged and reflected what the client shared.";
    if (score >= 70) return "Good listening skills shown, with room to improve on paraphrasing and emotional reflection.";
    if (score >= 50) return "Moderate listening skills. Focus more on acknowledging what the client says before asking new questions.";
    return "Needs improvement in active listening. Practice paraphrasing and reflecting emotions before moving forward.";
  }

  private getPowerfulQuestioningFeedback(score: number): string {
    if (score >= 85) return "Outstanding questioning! You used powerful questions that created genuine insights and breakthroughs.";
    if (score >= 70) return "Good questioning with some powerful moments. Aim for more outcome-focused and empowering questions.";
    if (score >= 50) return "Decent questioning but could be more powerful. Focus on 'what' and 'how' rather than 'why' questions.";
    return "Questions need more power and focus. Study advanced questioning techniques for better results.";
  }

  private getRapportBuildingFeedback(score: number): string {
    if (score >= 85) return "Excellent rapport building! The client felt understood and supported throughout.";
    if (score >= 70) return "Good rapport established. Continue building trust and understanding.";
    return "Focus on building stronger rapport through validation and acknowledgment.";
  }

  private getGoalSettingFeedback(score: number): string {
    if (score >= 85) return "Outstanding goal-setting approach! Clear outcomes and action steps identified.";
    if (score >= 70) return "Good goal orientation. Continue focusing on specific, measurable outcomes.";
    return "Improve goal-setting by being more specific about desired outcomes and next steps.";
  }

  private getBreakthroughFeedback(score: number): string {
    if (score >= 75) return "Amazing! You created breakthrough moments that shifted the client's perspective.";
    if (score >= 50) return "Some good insights generated. Focus on creating more 'aha' moments.";
    return "Work on creating breakthrough moments through powerful questions and reframing.";
  }

  // Example generation methods (simplified)
  private getActiveListeningExamples(coachMessages: Message[]): string[] {
    return ["Look for more 'What I hear you saying...' statements"];
  }

  private getPowerfulQuestioningExamples(score: number): string[] {
    return ["Try: 'What would happen if you knew you couldn't fail?'"];
  }

  private getRapportBuildingExamples(score: number): string[] {
    return ["Use more validation: 'That makes complete sense given your situation'"];
  }

  private getGoalSettingExamples(score: number): string[] {
    return ["Ask: 'What does success look like specifically?'"];
  }

  private getBreakthroughExamples(clientMessages: Message[]): string[] {
    return ["Client showed insight when they said: 'I never thought of it that way'"];
  }

  private generateOverallFeedback(score: number, tonyRobbins: TonyRobbinsMetrics): string {
    if (score >= 85) {
      return "Outstanding coaching session! You demonstrated mastery of breakthrough coaching methodology and professional standards. Your client experienced genuine insights and emotional shifts.";
    }
    if (score >= 70) {
      return "Strong coaching performance! You showed good understanding of powerful coaching techniques with room to enhance breakthrough creation and outcome focus.";
    }
    if (score >= 55) {
      return "Solid coaching foundation with opportunities for growth. Focus on more powerful questioning and creating breakthrough moments for your clients.";
    }
    return "This session shows you're learning, but there's significant room for improvement. Study advanced coaching methodology and practice the fundamentals of powerful coaching.";
  }

  private generateRecommendations(tonyRobbins: TonyRobbinsMetrics, icf: ICFMetrics): string[] {
    const recommendations: string[] = [];
    
    if (tonyRobbins.powerfulQuestions < 70) {
      recommendations.push("Study advanced questioning patterns - focus on outcome and empowerment questions");
    }
    if (tonyRobbins.breakthroughMoments < 50) {
      recommendations.push("Practice creating 'aha' moments through powerful reframes and perspective shifts");
    }
    if (icf.activeListening < 70) {
      recommendations.push("Improve active listening by paraphrasing and reflecting emotions before asking new questions");
    }
    
    return recommendations;
  }

  private generateSessionSummary(session: CoachingSession, tonyRobbins: TonyRobbinsMetrics): string {
    const needsAddressed = tonyRobbins.sixNeedsAddressed.join(', ');
    const messageCount = Math.floor(session.messages.length / 2);
    const sessionLength = messageCount <= 3 ? 'brief conversation' : 
                         messageCount <= 6 ? 'short session' : 
                         messageCount <= 10 ? 'standard session' : 'extended session';
    
    return `This ${sessionLength} (${messageCount} exchanges) addressed ${needsAddressed} needs and achieved ${tonyRobbins.breakthroughMoments}% breakthrough effectiveness.`;
  }

  private analyzeClientProgression(clientMessages: Message[]): string {
    // Analyze emotional progression through the session
    const firstHalf = clientMessages.slice(0, Math.floor(clientMessages.length / 2));
    const secondHalf = clientMessages.slice(Math.floor(clientMessages.length / 2));
    
    const initialTone = this.analyzeTone(firstHalf);
    const finalTone = this.analyzeTone(secondHalf);
    
    if (finalTone > initialTone) {
      return "Client showed positive emotional progression, moving from uncertainty to greater clarity and motivation.";
    }
    return "Client maintained steady engagement throughout the session with moderate emotional shifts.";
  }

  private analyzeTone(messages: Message[]): number {
    // Simplified tone analysis
    let positiveCount = 0;
    messages.forEach(msg => {
      if (this.containsPatterns(msg.content.toLowerCase(), ['excited', 'hopeful', 'confident', 'ready', 'motivated'])) {
        positiveCount++;
      }
    });
    return positiveCount;
  }

  private identifyImprovementAreas(tonyRobbins: TonyRobbinsMetrics, icf: ICFMetrics): string[] {
    const areas: string[] = [];
    
    if (tonyRobbins.stateManagement < 60) areas.push("State management and emotional awareness");
    if (tonyRobbins.powerfulQuestions < 70) areas.push("Powerful questioning techniques");
    if (tonyRobbins.breakthroughMoments < 50) areas.push("Creating breakthrough moments");
    if (icf.activeListening < 70) areas.push("Active listening and reflection");
    if (icf.goalSetting < 60) areas.push("Goal setting and outcome focus");
    
    return areas;
  }

  private identifyStrengths(tonyRobbins: TonyRobbinsMetrics, icf: ICFMetrics): string[] {
    const strengths: string[] = [];
    
    if (tonyRobbins.energyAndRapport >= 80) strengths.push("High energy and excellent rapport building");
    if (tonyRobbins.outcomeOrientation >= 75) strengths.push("Strong outcome and results orientation");
    if (tonyRobbins.breakthroughMoments >= 75) strengths.push("Excellent at creating breakthrough moments");
    if (icf.activeListening >= 80) strengths.push("Outstanding active listening skills");
    if (tonyRobbins.powerfulQuestions >= 80) strengths.push("Masterful powerful questioning");
    
    return strengths.length > 0 ? strengths : ["Good foundation in coaching basics"];
  }

  private generateNextSessionRecommendations(persona: PersonaProfile, tonyRobbins: TonyRobbinsMetrics): string[] {
    const recommendations: string[] = [];
    
    // Persona-specific recommendations
    if (persona.id === 'rahul-mumbai-it' && !tonyRobbins.sixNeedsAddressed.includes('Certainty')) {
      recommendations.push("Focus on addressing Rahul's need for financial certainty and career security");
    }
    
    if (persona.id === 'priya-delhi-startup' && !tonyRobbins.sixNeedsAddressed.includes('Significance')) {
      recommendations.push("Explore Priya's need for significance and recognition in her entrepreneurial journey");
    }
    
    if (persona.id === 'arjun-bangalore-pm' && !tonyRobbins.sixNeedsAddressed.includes('Growth')) {
      recommendations.push("Address Arjun's growth needs and confidence building in his career progression");
    }
    
    // General recommendations based on performance
    if (tonyRobbins.beliefSystemWork < 60) {
      recommendations.push("Work on identifying and challenging limiting beliefs in the next session");
    }
    
    return recommendations;
  }

  private generateTonyRobbinsStyleFeedback(tonyRobbins: TonyRobbinsMetrics, overallScore: number): string {
    if (overallScore >= 85) {
      return "Excellent coaching session. You created genuine insights and helped your client see new possibilities. Your questioning and rapport-building were particularly effective.";
    }
    if (overallScore >= 70) {
      return "Strong coaching performance. You demonstrated solid skills and created some powerful moments. Focus on asking more outcome-focused questions to elevate your impact.";
    }
    if (overallScore >= 55) {
      return "Good foundation in coaching basics. You showed good instincts with room to improve. Work on creating more breakthrough moments through powerful questioning.";
    }
    return "This session shows you're learning the fundamentals. Focus on studying proven coaching techniques and practicing active listening to improve your effectiveness.";
  }
}