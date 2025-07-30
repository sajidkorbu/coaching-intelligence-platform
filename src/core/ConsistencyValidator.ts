import { PersonaProfile, PersonaMemory } from '../types';

export class ConsistencyValidator {
  
  public async validateResponse(
    persona: PersonaProfile,
    response: string,
    memory: PersonaMemory
  ): Promise<string> {
    // Perform consistency checks
    const validationIssues = this.checkConsistency(persona, response, memory);
    
    if (validationIssues.length === 0) {
      return response;
    }
    
    // If there are consistency issues, apply corrections
    return this.correctResponse(response, validationIssues, persona);
  }

  private checkConsistency(
    persona: PersonaProfile,
    response: string,
    memory: PersonaMemory
  ): string[] {
    const issues: string[] = [];
    
    // Check communication style consistency
    if (!this.matchesCommunicationStyle(response, persona.personalityTraits.communicationStyle)) {
      issues.push('communication_style');
    }
    
    // Check emotional state consistency
    if (!this.matchesEmotionalState(response, persona.personalityTraits.emotionalState)) {
      issues.push('emotional_state');
    }
    
    // Check for contradictions with previous statements
    if (this.contradictsHistory(response, memory)) {
      issues.push('history_contradiction');
    }
    
    // Check cultural context appropriateness
    if (!this.matchesCulturalContext(response, persona.city)) {
      issues.push('cultural_context');
    }
    
    return issues;
  }

  private matchesCommunicationStyle(response: string, style: string): boolean {
    const lowerResponse = response.toLowerCase();
    
    switch (style) {
      case 'direct':
        // Direct communicators use clear, straightforward language
        return !this.containsVagueLanguage(lowerResponse);
        
      case 'indirect':
        // Indirect communicators are more subtle, use hedging language
        return this.containsHedgingLanguage(lowerResponse);
        
      case 'emotional':
        // Emotional communicators express feelings openly
        return this.containsEmotionalLanguage(lowerResponse);
        
      case 'analytical':
        // Analytical communicators focus on facts and logic
        return this.containsAnalyticalLanguage(lowerResponse);
        
      default:
        return true;
    }
  }

  private containsVagueLanguage(response: string): boolean {
    const vaguePhrases = ['maybe', 'perhaps', 'i think', 'sort of', 'kind of'];
    return vaguePhrases.some(phrase => response.includes(phrase));
  }

  private containsHedgingLanguage(response: string): boolean {
    const hedgingPhrases = ['i think', 'perhaps', 'maybe', 'it seems', 'i believe'];
    return hedgingPhrases.some(phrase => response.includes(phrase));
  }

  private containsEmotionalLanguage(response: string): boolean {
    const emotionalWords = ['feel', 'frustrated', 'excited', 'worried', 'happy', 'sad', 'angry'];
    return emotionalWords.some(word => response.includes(word));
  }

  private containsAnalyticalLanguage(response: string): boolean {
    const analyticalPhrases = ['because', 'therefore', 'analysis', 'data', 'evidence', 'logic'];
    return analyticalPhrases.some(phrase => response.includes(phrase));
  }

  private matchesEmotionalState(response: string, emotionalState: string): boolean {
    const lowerResponse = response.toLowerCase();
    
    switch (emotionalState) {
      case 'anxious':
        return this.containsAnxiousIndicators(lowerResponse);
      case 'frustrated':
        return this.containsFrustratedIndicators(lowerResponse);
      case 'hopeful':
        return this.containsHopefulIndicators(lowerResponse);
      case 'confused':
        return this.containsConfusedIndicators(lowerResponse);
      case 'motivated':
        return this.containsMotivatedIndicators(lowerResponse);
      default:
        return true;
    }
  }

  private containsAnxiousIndicators(response: string): boolean {
    const anxiousWords = ['worried', 'nervous', 'scared', 'uncertain', 'what if'];
    return anxiousWords.some(word => response.includes(word)) || 
           response.includes('?') || // Questions often indicate anxiety
           response.length > 100; // Anxious people tend to over-explain
  }

  private containsFrustratedIndicators(response: string): boolean {
    const frustratedWords = ['frustrated', 'annoyed', 'fed up', 'tired of', 'enough'];
    return frustratedWords.some(word => response.includes(word)) ||
           response.includes('!'); // Exclamation marks indicate strong emotion
  }

  private containsHopefulIndicators(response: string): boolean {
    const hopefulWords = ['hope', 'excited', 'looking forward', 'optimistic', 'positive'];
    return hopefulWords.some(word => response.includes(word));
  }

  private containsConfusedIndicators(response: string): boolean {
    const confusedWords = ['confused', 'unclear', 'don\'t understand', 'not sure'];
    return confusedWords.some(word => response.includes(word)) ||
           (response.match(/\?/g) || []).length > 1; // Multiple questions
  }

  private containsMotivatedIndicators(response: string): boolean {
    const motivatedWords = ['ready', 'let\'s do', 'motivated', 'determined', 'will do'];
    return motivatedWords.some(word => response.includes(word));
  }

  private contradictsHistory(response: string, memory: PersonaMemory): boolean {
    // Simple contradiction check - in full implementation would be more sophisticated
    const previousStatements = memory.conversationHistory
      .filter(msg => msg.role === 'client')
      .map(msg => msg.content.toLowerCase());
    
    // Check for obvious contradictions (simplified)
    if (response.toLowerCase().includes('i never') && 
        previousStatements.some(stmt => stmt.includes('i always'))) {
      return true;
    }
    
    return false;
  }

  private matchesCulturalContext(response: string, city: string): boolean {
    // Check for appropriate cultural references for Indian metro cities
    // This is a simplified check - could be expanded with more cultural nuances
    
    const inappropriateReferences = ['downtown', 'subway', 'dollars', 'thanksgiving'];
    return !inappropriateReferences.some(ref => response.toLowerCase().includes(ref));
  }

  private correctResponse(
    response: string,
    issues: string[],
    persona: PersonaProfile
  ): string {
    let correctedResponse = response;
    
    for (const issue of issues) {
      switch (issue) {
        case 'communication_style':
          correctedResponse = this.adjustCommunicationStyle(
            correctedResponse, 
            persona.personalityTraits.communicationStyle
          );
          break;
          
        case 'emotional_state':
          correctedResponse = this.adjustEmotionalTone(
            correctedResponse, 
            persona.personalityTraits.emotionalState
          );
          break;
          
        case 'cultural_context':
          correctedResponse = this.adjustCulturalReferences(correctedResponse, persona.city);
          break;
      }
    }
    
    return correctedResponse;
  }

  private adjustCommunicationStyle(response: string, style: string): string {
    switch (style) {
      case 'direct':
        return response.replace(/I think maybe/g, 'I believe')
                      .replace(/perhaps/g, 'definitely');
      case 'indirect':
        return response.replace(/I will/g, 'I think I might')
                      .replace(/definitely/g, 'perhaps');
      case 'emotional':
        if (!this.containsEmotionalLanguage(response.toLowerCase())) {
          return response + ' I really feel this is important to me.';
        }
        return response;
      case 'analytical':
        return response.replace(/I feel/g, 'I think')
                      .replace(/emotionally/g, 'logically');
      default:
        return response;
    }
  }

  private adjustEmotionalTone(response: string, emotionalState: string): string {
    switch (emotionalState) {
      case 'anxious':
        if (!response.includes('?')) {
          return response + ' But what if this doesn\'t work?';
        }
        return response;
      case 'frustrated':
        if (!response.includes('!')) {
          return response.replace('.', '!');
        }
        return response;
      case 'hopeful':
        return response + ' I\'m feeling optimistic about this.';
      default:
        return response;
    }
  }

  private adjustCulturalReferences(response: string, city: string): string {
    return response.replace(/downtown/g, 'city center')
                  .replace(/subway/g, 'metro')
                  .replace(/dollars/g, 'rupees');
  }
}