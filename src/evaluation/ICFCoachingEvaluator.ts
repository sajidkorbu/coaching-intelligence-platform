import { Message, CoachingSession, EvaluationCriteria, CoachingReport } from '../types';
import { PersonaProfile } from '../types';

export class ICFCoachingEvaluator {
  
  public evaluateSession(
    session: CoachingSession,
    persona: PersonaProfile
  ): CoachingReport {
    const coachMessages = session.messages.filter(msg => msg.role === 'coach');
    const clientMessages = session.messages.filter(msg => msg.role === 'client').slice(1); // Remove welcome message

    console.log('🔍 Evaluating session:', { 
      coachMessages: coachMessages.length, 
      clientMessages: clientMessages.length 
    });

    // Generate narrative-based feedback
    const narrativeFeedback = this.generateNarrativeFeedback(coachMessages, clientMessages, persona);
    const coachingInsights = this.generateExpertInsights(coachMessages, clientMessages, persona);
    const sessionFlow = this.analyzeSessionFlow(coachMessages, clientMessages);

    // Create simplified performance structure for backwards compatibility
    const dummyPerformance = {
      activeListening: { score: 75, feedback: "See narrative feedback", examples: [] },
      powerfulQuestioning: { score: 70, feedback: "See narrative feedback", examples: [] },
      rapportBuilding: { score: 80, feedback: "See narrative feedback", examples: [] },
      goalSetting: { score: 65, feedback: "See narrative feedback", examples: [] },
      breakthroughCreation: { score: 70, feedback: "See narrative feedback", examples: [] },
      overallEffectiveness: { score: 72, feedback: "See narrative feedback", recommendations: [] }
    };

    return {
      sessionId: session.id,
      personaId: session.personaId,
      coachPerformance: dummyPerformance,
      sessionSummary: narrativeFeedback,
      clientProgression: coachingInsights,
      areasForImprovement: [sessionFlow],
      strengths: ["Narrative coaching feedback provided"],
      nextSessionRecommendations: ["Continue exploring the client's journey"],
      tonyRobbinsStyleFeedback: "Focus on the story, not the scores! 🎯",
      bestQuestion: this.findMostImpactfulQuestion(coachMessages, clientMessages),
      clientBreakthroughQuote: this.findBreakthroughMoment(clientMessages),
      keyLearning: this.extractKeyLearning(coachMessages, clientMessages)
    };
  }

  private evaluateActiveListening(coachMessages: Message[], clientMessages: Message[]) {
    if (coachMessages.length === 0) {
      return { score: 0, feedback: "No coaching interactions to evaluate.", examples: [] };
    }

    let score = 60; // Base score - starting higher for realistic evaluation
    let examples: string[] = [];
    let feedback = "";

    // Look for acknowledgment patterns
    const acknowledgmentPatterns = [
      'i hear', 'it sounds like', 'what i understand', 'let me reflect',
      'so you\'re saying', 'i sense', 'that makes sense', 'i can see'
    ];

    let acknowledgmentCount = 0;
    
    coachMessages.forEach((msg, index) => {
      const content = msg.content.toLowerCase();
      
      // Check for acknowledgment
      acknowledgmentPatterns.forEach(pattern => {
        if (content.includes(pattern)) {
          acknowledgmentCount++;
          score += 10;
          examples.push(`"${msg.content}"`);
        }
      });

      // Check if coach built on client's previous response
      if (index > 0 && clientMessages[index - 1]) {
        const prevClientMsg = clientMessages[index - 1].content.toLowerCase();
        const clientWords = prevClientMsg.split(' ').filter(w => w.length > 4);
        const hasReference = clientWords.some(word => content.includes(word));
        
        if (hasReference) {
          score += 5;
        }
      }
    });

    // Cap the score at 100
    score = Math.min(100, score);

    if (score >= 80) {
      feedback = "Excellent active listening! You consistently acknowledged and built upon what the client shared.";
    } else if (score >= 60) {
      feedback = "Good listening skills shown. Consider more paraphrasing and emotional reflection.";
    } else if (score >= 40) {
      feedback = "Moderate listening. Focus more on acknowledging what the client says before asking new questions.";
    } else {
      feedback = "Limited active listening demonstrated. Practice reflecting back what you hear.";
    }

    return { 
      score, 
      feedback, 
      examples: examples.slice(0, 3) 
    };
  }

  private evaluatePowerfulQuestioning(coachMessages: Message[]) {
    if (coachMessages.length === 0) {
      return { score: 0, feedback: "No questions to evaluate.", examples: [] };
    }

    let score = 50; // Base score - starting higher for realistic evaluation
    let examples: string[] = [];
    let totalQuestions = 0;
    let powerfulQuestions = 0;

    const powerfulPatterns = [
      'what do you want', 'what would success look like', 'what\'s most important',
      'how would you feel if', 'what would happen if', 'what\'s stopping you',
      'what resources do you have', 'what would you do if', 'what does this mean to you',
      'what are you learning', 'what\'s possible here', 'how else could you'
    ];

    coachMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      const questionCount = (content.match(/\?/g) || []).length;
      totalQuestions += questionCount;

      powerfulPatterns.forEach(pattern => {
        if (content.includes(pattern) && content.includes('?')) {
          powerfulQuestions++;
          score += 15;
          examples.push(`"${msg.content}"`);
        }
      });
    });

    score = Math.min(100, score);

    let feedback = "";
    if (score >= 80) {
      feedback = "Outstanding questioning! You used powerful, insight-generating questions effectively.";
    } else if (score >= 60) {
      feedback = "Good questioning technique. Try more 'what' and 'how' questions for deeper exploration.";
    } else if (score >= 40) {
      feedback = "Moderate questioning. Focus on open-ended questions that create insights.";
    } else {
      feedback = "Limited powerful questioning. Study advanced questioning techniques.";
    }

    return { 
      score, 
      feedback, 
      examples: examples.slice(0, 3) 
    };
  }

  private evaluateRapportBuilding(coachMessages: Message[], clientMessages: Message[]) {
    if (coachMessages.length === 0) {
      return { score: 0, feedback: "No interactions to evaluate rapport.", examples: [] };
    }

    let score = 55; // Base score - starting higher for realistic evaluation
    let examples: string[] = [];

    const rapportIndicators = [
      'i understand', 'that makes sense', 'i can see why', 'that\'s completely normal',
      'many people feel', 'i appreciate', 'you\'re not alone', 'i hear you',
      'that sounds challenging', 'i can imagine', 'you\'re being brave'
    ];

    coachMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      rapportIndicators.forEach(indicator => {
        if (content.includes(indicator)) {
          score += 12;
          examples.push(`"${msg.content}"`);
        }
      });
    });

    score = Math.min(100, score);

    let feedback = "";
    if (score >= 80) {
      feedback = "Excellent rapport building! You created a safe, supportive environment.";
    } else if (score >= 60) {
      feedback = "Good rapport established. Continue building trust and understanding.";
    } else {
      feedback = "Focus on building stronger rapport through validation and empathy.";
    }

    return { 
      score, 
      feedback, 
      examples: examples.slice(0, 3) 
    };
  }

  private evaluateGoalSetting(coachMessages: Message[]) {
    if (coachMessages.length === 0) {
      return { score: 0, feedback: "No goal-setting interactions to evaluate.", examples: [] };
    }

    let score = 50; // Base score - starting higher for realistic evaluation
    let examples: string[] = [];

    const goalPatterns = [
      'what do you want to achieve', 'what\'s your goal', 'what would success look like',
      'what outcome are you seeking', 'what would you like to see happen',
      'what\'s your next step', 'what will you do', 'when will you', 'how will you measure'
    ];

    coachMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      goalPatterns.forEach(pattern => {
        if (content.includes(pattern)) {
          score += 18;
          examples.push(`"${msg.content}"`);
        }
      });
    });

    score = Math.min(100, score);

    let feedback = "";
    if (score >= 80) {
      feedback = "Excellent goal-setting approach! Clear outcomes and actions identified.";
    } else if (score >= 60) {
      feedback = "Good goal orientation. Be more specific about desired outcomes.";
    } else {
      feedback = "Improve goal-setting by focusing on specific, measurable outcomes.";
    }

    return { 
      score, 
      feedback, 
      examples: examples.slice(0, 3) 
    };
  }

  private evaluateBreakthroughCreation(clientMessages: Message[]) {
    if (clientMessages.length === 0) {
      return { score: 0, feedback: "No client responses to evaluate breakthroughs.", examples: [] };
    }

    let score = 45; // Base score - starting higher for realistic evaluation
    let examples: string[] = [];

    const breakthroughPatterns = [
      'i never thought', 'that\'s a different perspective', 'i see now', 'that makes sense',
      'i understand now', 'i feel clearer', 'i realize', 'aha', 'wow',
      'i\'m ready to', 'i can see', 'that changes things', 'i get it now'
    ];

    clientMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      breakthroughPatterns.forEach(pattern => {
        if (content.includes(pattern)) {
          score += 20;
          examples.push(`"${msg.content}"`);
        }
      });
    });

    score = Math.min(100, score);

    let feedback = "";
    if (score >= 70) {
      feedback = "Amazing! You created breakthrough moments that shifted the client's perspective.";
    } else if (score >= 50) {
      feedback = "Good insights generated. Focus on creating more 'aha' moments.";
    } else {
      feedback = "Work on creating breakthrough moments through powerful questions and reframing.";
    }

    return { 
      score, 
      feedback, 
      examples: examples.slice(0, 3) 
    };
  }

  private extractSessionHighlights(coachMessages: Message[], clientMessages: Message[]) {
    // Find best question
    const questionsWithPatterns = coachMessages.filter(msg => 
      msg.content.includes('?') && (
        msg.content.toLowerCase().includes('what do you') ||
        msg.content.toLowerCase().includes('how would you') ||
        msg.content.toLowerCase().includes('what would happen')
      )
    );
    
    const bestQuestion = questionsWithPatterns.length > 0 
      ? questionsWithPatterns[0].content 
      : coachMessages.find(msg => msg.content.includes('?'))?.content || "Ask more powerful questions!";

    // Find breakthrough quote
    const breakthroughQuote = clientMessages.find(msg => {
      const content = msg.content.toLowerCase();
      return content.includes('i realize') || content.includes('i see') || 
             content.includes('that makes sense') || content.includes('i understand');
    })?.content || "Client showed engagement throughout the session";

    // Find learning moment
    const keyLearning = clientMessages.find(msg => {
      const content = msg.content.toLowerCase();
      return content.includes('learned') || content.includes('helpful') || 
             content.includes('insight') || content.includes('clearer');
    })?.content || "Continue building coaching skills";

    return {
      bestQuestion,
      breakthroughQuote,
      keyLearning
    };
  }

  private generateOverallFeedback(score: number): string {
    if (score >= 85) {
      return "Outstanding coaching session! You demonstrated excellent ICF competencies and created meaningful client insights.";
    } else if (score >= 70) {
      return "Strong coaching performance! Good application of ICF principles with room for enhancement.";
    } else if (score >= 55) {
      return "Solid coaching foundation. Focus on more powerful questioning and deeper listening.";
    } else {
      return "Good learning opportunity. Practice ICF core competencies and powerful coaching techniques.";
    }
  }

  private generateOverallRecommendations(score: number): string[] {
    const recommendations: string[] = [];
    
    if (score < 70) {
      recommendations.push("Practice more powerful questioning techniques");
      recommendations.push("Focus on active listening and reflection");
      recommendations.push("Work on building stronger rapport");
    }
    
    if (score < 55) {
      recommendations.push("Study ICF core competencies");
      recommendations.push("Practice goal-setting conversations");
    }
    
    return recommendations;
  }

  private generateSessionSummary(coachMessages: number, clientMessages: number): string {
    const exchanges = Math.min(coachMessages, clientMessages);
    return `Session included ${exchanges} coaching exchanges. Key focus areas: goal exploration, insight creation, and action planning.`;
  }

  private analyzeClientProgression(clientMessages: Message[]): string {
    if (clientMessages.length < 2) {
      return "Session too brief for progression analysis.";
    }

    const finalMessage = clientMessages[clientMessages.length - 1].content.toLowerCase();
    const progressIndicators = ['ready', 'will', 'can', 'understand', 'clear', 'helpful'];
    
    const hasProgress = progressIndicators.some(indicator => finalMessage.includes(indicator));
    
    return hasProgress 
      ? "Client showed positive progression with increased clarity and commitment."
      : "Client remained engaged. Consider more breakthrough-focused techniques.";
  }

  private identifyImprovementAreas(activeListening: any, powerfulQuestioning: any, rapportBuilding: any, goalSetting: any, breakthroughCreation: any): string[] {
    const areas: string[] = [];
    
    if (activeListening.score < 70) areas.push("Active listening and reflection");
    if (powerfulQuestioning.score < 70) areas.push("Powerful questioning techniques");
    if (rapportBuilding.score < 70) areas.push("Rapport building and trust");
    if (goalSetting.score < 70) areas.push("Goal setting and outcome focus");
    if (breakthroughCreation.score < 70) areas.push("Creating breakthrough moments");
    
    return areas.length > 0 ? areas : ["Continue developing coaching mastery"];
  }

  private identifyStrengths(activeListening: any, powerfulQuestioning: any, rapportBuilding: any, goalSetting: any, breakthroughCreation: any): string[] {
    const strengths: string[] = [];
    
    if (activeListening.score >= 70) strengths.push("Strong active listening skills");
    if (powerfulQuestioning.score >= 70) strengths.push("Effective questioning technique");
    if (rapportBuilding.score >= 70) strengths.push("Excellent rapport building");
    if (goalSetting.score >= 70) strengths.push("Clear goal-setting approach");
    if (breakthroughCreation.score >= 70) strengths.push("Creates meaningful insights");
    
    return strengths.length > 0 ? strengths : ["Building solid coaching foundation"];
  }

  private generateNextSessionRecommendations(persona: PersonaProfile): string[] {
    const recommendations = [
      `Continue exploring ${persona.name}'s core challenges`,
      "Focus on creating more breakthrough moments",
      "Deepen the coaching relationship through trust-building"
    ];
    
    // Add persona-specific recommendations
    if (persona.city === 'Mumbai') {
      recommendations.push("Address work-life balance and financial planning");
    } else if (persona.city === 'Delhi') {
      recommendations.push("Explore family expectations and career aspirations");
    } else if (persona.city === 'Bangalore') {
      recommendations.push("Focus on tech career growth and lifestyle management");
    }
    
    return recommendations;
  }

  private generateMotivationalFeedback(score: number): string {
    if (score >= 85) {
      return "🔥 INCREDIBLE! You're coaching at a professional level! Your client experienced real transformation. Keep this energy!";
    } else if (score >= 70) {
      return "💪 EXCELLENT WORK! You're developing strong coaching skills. Focus on creating more breakthrough moments!";
    } else if (score >= 55) {
      return "🎯 GOOD PROGRESS! You're building solid foundations. Practice powerful questioning for even better results!";
    } else {
      return "🌟 KEEP LEARNING! Every great coach started here. Focus on ICF competencies and you'll see amazing improvement!";
    }
  }

  /**
   * Generate narrative feedback focusing on what actually happened in the session
   */
  private generateNarrativeFeedback(coachMessages: Message[], clientMessages: Message[], persona: PersonaProfile): string {
    const clientName = persona.name;
    const exchanges = Math.min(coachMessages.length, clientMessages.length);
    
    if (exchanges === 0) {
      return `This session with ${clientName} was too brief to analyze meaningfully. Consider allowing more time for the client to open up and share their challenges.`;
    }

    let narrative = `**The Story of Your Session with ${clientName}**\n\n`;
    
    // Opening analysis
    if (clientMessages.length > 0) {
      const firstClientMessage = clientMessages[0].content;
      const clientTone = this.analyzeTone(firstClientMessage);
      narrative += `${clientName} came into the session ${clientTone}. `;
      
      const mainThemes = this.extractMainThemes(clientMessages);
      if (mainThemes.length > 0) {
        narrative += `The conversation revealed they are primarily concerned with ${mainThemes.join(' and ')}. `;
      }
    }

    // Coach's approach analysis
    const coachingStyle = this.analyzeCoachingStyle(coachMessages);
    narrative += `\n\nYour coaching approach was ${coachingStyle}. `;
    
    // Key moments
    const keyMoments = this.identifyKeyMoments(coachMessages, clientMessages);
    if (keyMoments.length > 0) {
      narrative += `\n\n**Key Moments:**\n`;
      keyMoments.forEach((moment, index) => {
        narrative += `${index + 1}. ${moment}\n`;
      });
    }

    // Client's evolution
    const clientEvolution = this.analyzeClientEvolution(clientMessages);
    narrative += `\n\n**Client's Journey:** ${clientEvolution}`;

    // What happened vs what could have happened
    const missedOpportunities = this.identifyMissedOpportunities(coachMessages, clientMessages);
    if (missedOpportunities.length > 0) {
      narrative += `\n\n**Opportunities to Explore Further:** ${missedOpportunities.join(' ')}`;
    }

    return narrative;
  }

  /**
   * Generate expert insights that a novice coach might miss
   */
  private generateExpertInsights(coachMessages: Message[], clientMessages: Message[], persona: PersonaProfile): string {
    let insights = `**Expert-Level Insights**\n\n`;
    
    // Emotional undercurrents
    const emotionalPattern = this.detectEmotionalPatterns(clientMessages);
    if (emotionalPattern) {
      insights += `**Emotional Undercurrent:** ${emotionalPattern}\n\n`;
    }

    // Resistance patterns
    const resistancePattern = this.detectResistancePatterns(clientMessages);
    if (resistancePattern) {
      insights += `**Subtle Resistance:** ${resistancePattern}\n\n`;
    }

    // Language patterns
    const languageInsight = this.analyzeLanguagePatterns(clientMessages);
    if (languageInsight) {
      insights += `**Language Patterns:** ${languageInsight}\n\n`;
    }

    // Cultural/contextual factors
    const culturalContext = this.analyzeCulturalContext(clientMessages, persona);
    if (culturalContext) {
      insights += `**Cultural Context:** ${culturalContext}\n\n`;
    }

    // Energy shifts
    const energyAnalysis = this.analyzeEnergyShifts(clientMessages);
    if (energyAnalysis) {
      insights += `**Energy Dynamics:** ${energyAnalysis}`;
    }

    return insights;
  }

  /**
   * Analyze the flow of the session
   */
  private analyzeSessionFlow(coachMessages: Message[], clientMessages: Message[]): string {
    const flow = [];
    
    if (coachMessages.length > 0 && clientMessages.length > 0) {
      const openingStyle = this.getOpeningStyle(coachMessages[0]);
      flow.push(`Started ${openingStyle}`);
      
      const midSessionDynamics = this.getMidSessionDynamics(coachMessages, clientMessages);
      if (midSessionDynamics) {
        flow.push(midSessionDynamics);
      }
      
      const closingApproach = this.getClosingApproach(coachMessages[coachMessages.length - 1]);
      flow.push(`Concluded ${closingApproach}`);
    }
    
    return flow.join('. ') + '.';
  }

  // Helper methods for narrative analysis
  private analyzeTone(message: string): string {
    const content = message.toLowerCase();
    if (content.includes('confused') || content.includes('lost') || content.includes('don\'t know')) {
      return 'feeling confused and seeking direction';
    }
    if (content.includes('stressed') || content.includes('overwhelmed') || content.includes('pressure')) {
      return 'under significant stress and pressure';
    }
    if (content.includes('excited') || content.includes('ready') || content.includes('looking forward')) {
      return 'with positive energy and readiness for change';
    }
    return 'with a mix of concerns and cautious optimism';
  }

  private extractMainThemes(messages: Message[]): string[] {
    const themes: string[] = [];
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    
    if (content.includes('work') || content.includes('job') || content.includes('career')) {
      themes.push('career challenges');
    }
    if (content.includes('family') || content.includes('relationship') || content.includes('marriage')) {
      themes.push('relationship dynamics');
    }
    if (content.includes('decision') || content.includes('choice') || content.includes('future')) {
      themes.push('life direction decisions');
    }
    if (content.includes('time') || content.includes('balance') || content.includes('manage')) {
      themes.push('work-life balance');
    }
    
    return themes;
  }

  private analyzeCoachingStyle(messages: Message[]): string {
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    const questionCount = (content.match(/\?/g) || []).length;
    const statementCount = messages.length - questionCount;
    
    if (questionCount > statementCount * 2) {
      return 'primarily question-focused, encouraging deep self-reflection';
    }
    if (content.includes('i understand') || content.includes('that makes sense')) {
      return 'empathetic and validating, creating psychological safety';
    }
    if (content.includes('what if') || content.includes('imagine')) {
      return 'exploratory and possibility-oriented';
    }
    return 'balanced between inquiry and support';
  }

  private identifyKeyMoments(coachMessages: Message[], clientMessages: Message[]): string[] {
    const moments: string[] = [];
    
    // Look for powerful questions that led to insights
    for (let i = 0; i < Math.min(coachMessages.length, clientMessages.length - 1); i++) {
      const coachMsg = coachMessages[i].content;
      const clientResponse = clientMessages[i + 1]?.content.toLowerCase() || '';
      
      if (coachMsg.includes('?') && (clientResponse.includes('never thought') || clientResponse.includes('realize') || clientResponse.includes('that makes sense'))) {
        moments.push(`When you asked "${coachMsg}", it seemed to create a shift in ${this.getPersonaName(clientMessages)} thinking`);
      }
    }
    
    return moments;
  }

  private analyzeClientEvolution(messages: Message[]): string {
    if (messages.length < 2) return 'The session was too brief to observe client evolution.';
    
    const firstMsg = messages[0].content.toLowerCase();
    const lastMsg = messages[messages.length - 1].content.toLowerCase();
    
    const startState = this.getEmotionalState(firstMsg);
    const endState = this.getEmotionalState(lastMsg);
    
    if (endState === startState) {
      return `The client maintained a ${startState} state throughout, suggesting the need for more breakthrough-oriented interventions.`;
    }
    
    return `The client evolved from ${startState} to ${endState}, indicating meaningful progress in the session.`;
  }

  private getEmotionalState(content: string): string {
    if (content.includes('confused') || content.includes('lost')) return 'confused';
    if (content.includes('clear') || content.includes('understand')) return 'clearer';
    if (content.includes('ready') || content.includes('will')) return 'determined';
    if (content.includes('stressed') || content.includes('overwhelmed')) return 'stressed';
    return 'reflective';
  }

  private identifyMissedOpportunities(coachMessages: Message[], clientMessages: Message[]): string[] {
    const opportunities: string[] = [];
    
    // Look for emotional words that weren't explored
    clientMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      if (content.includes('afraid') || content.includes('scared')) {
        opportunities.push('The fear mentioned could have been explored more deeply.');
      }
      if (content.includes('angry') || content.includes('frustrated')) {
        opportunities.push('The frustration expressed deserved more attention.');
      }
      if (content.includes('dream') || content.includes('wish')) {
        opportunities.push('The aspirations mentioned could be developed into concrete goals.');
      }
    });
    
    return [...new Set(opportunities)]; // Remove duplicates
  }

  // Additional helper methods
  private detectEmotionalPatterns(messages: Message[]): string | null {
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    
    if (content.includes('should') && content.includes('expected')) {
      return 'The client shows signs of external pressure and \'should\' thinking, indicating possible people-pleasing patterns.';
    }
    if (content.includes('always') || content.includes('never')) {
      return 'The client uses absolute language, suggesting black-and-white thinking that could be gently challenged.';
    }
    
    return null;
  }

  private detectResistancePatterns(messages: Message[]): string | null {
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    
    if (content.includes('but') || content.includes('however')) {
      const butCount = (content.match(/but/g) || []).length;
      if (butCount > 2) {
        return `The client used 'but' ${butCount} times, potentially indicating internal resistance to change.`;
      }
    }
    
    return null;
  }

  private analyzeLanguagePatterns(messages: Message[]): string | null {
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    
    if (content.includes('i can\'t') || content.includes('impossible')) {
      return 'The client uses limiting language that could be reframed into possibility-focused alternatives.';
    }
    if (content.includes('i have to') || content.includes('i must')) {
      return 'The client expresses obligation-based language, suggesting exploration of choices and autonomy could be valuable.';
    }
    
    return null;
  }

  private analyzeCulturalContext(messages: Message[], persona: PersonaProfile): string | null {
    const content = messages.map(m => m.content.toLowerCase()).join(' ');
    
    if (persona.city === 'Mumbai' || persona.city === 'Delhi' || persona.city === 'Bangalore') {
      if (content.includes('family') && content.includes('expectations')) {
        return 'The client navigates traditional family expectations common in Indian culture, requiring sensitive exploration of individual vs. collective values.';
      }
    }
    
    return null;
  }

  private analyzeEnergyShifts(messages: Message[]): string | null {
    if (messages.length < 3) return null;
    
    const firstThird = messages.slice(0, Math.ceil(messages.length / 3));
    const lastThird = messages.slice(-Math.ceil(messages.length / 3));
    
    const startEnergy = this.getEnergyLevel(firstThird.map(m => m.content).join(' '));
    const endEnergy = this.getEnergyLevel(lastThird.map(m => m.content).join(' '));
    
    if (endEnergy > startEnergy) {
      return 'The client\'s energy increased throughout the session, indicating engagement and hope.';
    } else if (endEnergy < startEnergy) {
      return 'The client\'s energy decreased, possibly indicating fatigue or discouragement that warrants attention.';
    }
    
    return 'The client maintained consistent energy levels throughout the session.';
  }

  private getEnergyLevel(content: string): number {
    const positiveWords = ['excited', 'ready', 'can', 'will', 'possible', 'hope'];
    const negativeWords = ['tired', 'exhausted', 'can\'t', 'impossible', 'give up'];
    
    const contentLower = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length;
    
    return positiveCount - negativeCount;
  }

  // Additional methods for session flow analysis
  private getOpeningStyle(firstMessage: Message): string {
    const content = firstMessage.content.toLowerCase();
    if (content.includes('?')) {
      return 'with an inquiry to establish the session focus';
    }
    if (content.includes('tell me') || content.includes('share')) {
      return 'with an invitation to share';
    }
    return 'with a supportive opening';
  }

  private getMidSessionDynamics(coachMessages: Message[], clientMessages: Message[]): string | null {
    const midPoint = Math.floor(coachMessages.length / 2);
    if (midPoint > 0 && midPoint < coachMessages.length - 1) {
      const midMessage = coachMessages[midPoint].content.toLowerCase();
      if (midMessage.includes('what') && midMessage.includes('?')) {
        return 'maintained curiosity and exploration in the middle phase';
      }
    }
    return null;
  }

  private getClosingApproach(lastMessage: Message): string {
    const content = lastMessage.content.toLowerCase();
    if (content.includes('next') || content.includes('action')) {
      return 'with action-oriented planning';
    }
    if (content.includes('feel') || content.includes('think')) {
      return 'with reflection and integration';
    }
    return 'with supportive closure';
  }

  private getPersonaName(messages: Message[]): string {
    // Extract name from messages or return generic term
    return 'the client';
  }

  // Methods for finding impactful moments
  private findMostImpactfulQuestion(coachMessages: Message[], clientMessages: Message[]): string {
    // Find coach questions that led to the longest or most insightful client responses
    let mostImpactfulQuestion = "Continue asking deeper questions";
    let maxResponseLength = 0;
    
    for (let i = 0; i < Math.min(coachMessages.length, clientMessages.length - 1); i++) {
      const coachMsg = coachMessages[i];
      const clientResponse = clientMessages[i + 1];
      
      if (coachMsg.content.includes('?') && clientResponse.content.length > maxResponseLength) {
        maxResponseLength = clientResponse.content.length;
        mostImpactfulQuestion = coachMsg.content;
      }
    }
    
    return mostImpactfulQuestion;
  }

  private findBreakthroughMoment(clientMessages: Message[]): string {
    const breakthroughPatterns = ['realize', 'understand', 'see now', 'makes sense', 'clear now', 'aha'];
    
    for (const message of clientMessages.reverse()) {
      const content = message.content.toLowerCase();
      if (breakthroughPatterns.some(pattern => content.includes(pattern))) {
        return message.content;
      }
    }
    
    return "Look for more breakthrough moments in future sessions";
  }

  private extractKeyLearning(coachMessages: Message[], clientMessages: Message[]): string {
    const learningPatterns = ['learned', 'insight', 'helpful', 'understand', 'clearer'];
    
    // Look for client expressions of learning
    for (const message of clientMessages.reverse()) {
      const content = message.content.toLowerCase();
      if (learningPatterns.some(pattern => content.includes(pattern))) {
        return `Key learning: ${message.content}`;
      }
    }
    
    return "Focus on creating more learning moments through powerful questions";
  }
}
