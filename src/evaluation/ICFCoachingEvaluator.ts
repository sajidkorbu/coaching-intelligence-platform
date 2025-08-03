import { Message, CoachingSession, EvaluationCriteria, CoachingReport } from '../types';
import { PersonaProfile } from '../types';

export class ICFCoachingEvaluator {
  
  public evaluateSession(
    session: CoachingSession,
    persona: PersonaProfile
  ): CoachingReport {
    const coachMessages = session.messages.filter(msg => msg.role === 'coach');
    const clientMessages = session.messages.filter(msg => msg.role === 'client');

    console.log('🔍 Evaluating session:', { 
      coachMessages: coachMessages.length, 
      clientMessages: clientMessages.length 
    });

    // ICF Core Competencies Evaluation
    const activeListening = this.evaluateActiveListening(coachMessages, clientMessages);
    const powerfulQuestioning = this.evaluatePowerfulQuestioning(coachMessages);
    const rapportBuilding = this.evaluateRapportBuilding(coachMessages, clientMessages);
    const goalSetting = this.evaluateGoalSetting(coachMessages);
    const breakthroughCreation = this.evaluateBreakthroughCreation(clientMessages);

    console.log('📊 Individual Scores:', {
      activeListening: activeListening.score,
      powerfulQuestioning: powerfulQuestioning.score,
      rapportBuilding: rapportBuilding.score,
      goalSetting: goalSetting.score,
      breakthroughCreation: breakthroughCreation.score
    });

    // Calculate overall effectiveness
    const overallScore = Math.round(
      (activeListening.score + powerfulQuestioning.score + rapportBuilding.score + 
       goalSetting.score + breakthroughCreation.score) / 5
    );

    console.log('🎯 Overall Score:', overallScore);

    // Extract session highlights
    const sessionHighlights = this.extractSessionHighlights(coachMessages, clientMessages);

    return {
      sessionId: session.id,
      personaId: session.personaId,
      coachPerformance: {
        activeListening,
        powerfulQuestioning,
        rapportBuilding,
        goalSetting,
        breakthroughCreation,
        overallEffectiveness: {
          score: overallScore,
          feedback: this.generateOverallFeedback(overallScore),
          recommendations: this.generateOverallRecommendations(overallScore)
        }
      },
      sessionSummary: this.generateSessionSummary(coachMessages.length, clientMessages.length),
      clientProgression: this.analyzeClientProgression(clientMessages),
      areasForImprovement: this.identifyImprovementAreas(activeListening, powerfulQuestioning, rapportBuilding, goalSetting, breakthroughCreation),
      strengths: this.identifyStrengths(activeListening, powerfulQuestioning, rapportBuilding, goalSetting, breakthroughCreation),
      nextSessionRecommendations: this.generateNextSessionRecommendations(persona),
      tonyRobbinsStyleFeedback: this.generateMotivationalFeedback(overallScore),
      // Add session highlights for display
      bestQuestion: sessionHighlights.bestQuestion,
      clientBreakthroughQuote: sessionHighlights.breakthroughQuote,
      keyLearning: sessionHighlights.keyLearning
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
}
