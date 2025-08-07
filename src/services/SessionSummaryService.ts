import { Message, PersonaProfile } from '../types';

export interface SessionSummary {
  summaryText: string; // Detailed multi-line summary with key issues and context
}

export class SessionSummaryService {
  
  /**
   * Generate a detailed summary focusing on client's main issues, context, and emotional state
   */
  public generateSummary(
    messages: Message[], 
    persona: PersonaProfile,
    exchangeCount: number
  ): SessionSummary {
    // Filter to only client messages (excluding welcome message)
    const clientMessages = messages
      .filter(msg => msg.role === 'client')
      .slice(1); // Remove welcome message
    
    if (clientMessages.length === 0) {
      return {
        summaryText: `${persona.name} has just begun the coaching session and is preparing to share their situation. They appear ready to discuss their challenges and seek guidance on their current circumstances.`
      };
    }

    // Extract comprehensive information from client messages
    const clientContent = clientMessages.map(msg => msg.content).join(' ');
    const issues = this.extractDetailedIssues(clientContent, persona);
    const emotionalState = this.extractEmotionalState(clientContent);
    const context = this.extractSituationalContext(clientContent, persona);
    
    // Generate detailed summary text
    const summaryText = this.generateDetailedSummary(persona, issues, emotionalState, context, exchangeCount);
    
    return { summaryText };
  }

  /**
   * Extract main issues from client content - simplified version
   */
  private extractMainIssues(content: string, persona: PersonaProfile): string[] {
    const issues: string[] = [];
    const contentLower = content.toLowerCase();

    // Work/career issues
    if (this.containsKeywords(contentLower, ['work', 'job', 'career', 'office', 'professional'])) {
      issues.push('work challenges');
    }

    // Family/relationship issues
    if (this.containsKeywords(contentLower, ['family', 'marriage', 'parents', 'relationship'])) {
      issues.push('family/relationship issues');
    }

    // Financial concerns
    if (this.containsKeywords(contentLower, ['money', 'financial', 'salary', 'rent', 'expenses'])) {
      issues.push('financial concerns');
    }

    // Stress/overwhelm
    if (this.containsKeywords(contentLower, ['stressed', 'overwhelmed', 'burnout', 'tired', 'exhausted'])) {
      issues.push('stress/overwhelm');
    }

    // Direction/goals
    if (this.containsKeywords(contentLower, ['future', 'direction', 'goals', 'purpose', 'confused'])) {
      issues.push('life direction concerns');
    }

    // Social pressure
    if (this.containsKeywords(contentLower, ['pressure', 'expectations', 'society', 'tradition'])) {
      issues.push('social/cultural pressure');
    }

    // If no issues detected, use persona's main problems
    if (issues.length === 0) {
      // Extract simplified version of persona's main issues
      const firstProblem = persona.coreProblems[0]?.toLowerCase() || '';
      if (firstProblem.includes('work') || firstProblem.includes('career')) {
        issues.push('career challenges');
      }
      if (firstProblem.includes('family') || firstProblem.includes('marriage')) {
        issues.push('family issues');
      }
      if (issues.length === 0) {
        issues.push('life challenges');
      }
    }

    return issues.slice(0, 2); // Only top 2 issues
  }

  /**
   * Generate simple summary text in format: "[Name] is facing [issue] and is also stressed with [issue]"
   */
  private generateSimpleSummary(name: string, issues: string[]): string {
    if (issues.length === 0) {
      return `${name} is beginning to explore their situation`;
    }
    
    if (issues.length === 1) {
      return `${name} is facing ${issues[0]}`;
    }
    
    // Two issues - use the format requested
    return `${name} is facing ${issues[0]} and is also stressed with ${issues[1]}`;
  }

  /**
   * Extract detailed issues with more context
   */
  private extractDetailedIssues(content: string, persona: PersonaProfile): string[] {
    const issues: string[] = [];
    const contentLower = content.toLowerCase();

    // Work/career issues with context
    if (this.containsKeywords(contentLower, ['work', 'job', 'career', 'office', 'professional', 'manager', 'team'])) {
      if (this.containsKeywords(contentLower, ['promotion', 'growth', 'stuck', 'stagnant'])) {
        issues.push('career advancement and growth concerns');
      } else if (this.containsKeywords(contentLower, ['workload', 'hours', 'overtime', 'busy'])) {
        issues.push('work-life balance and workload management');
      } else {
        issues.push('professional challenges and workplace dynamics');
      }
    }

    // Relationship/family issues with context
    if (this.containsKeywords(contentLower, ['family', 'marriage', 'parents', 'relationship', 'partner', 'spouse'])) {
      if (this.containsKeywords(contentLower, ['expectations', 'pressure', 'traditional'])) {
        issues.push('family expectations and cultural pressures');
      } else if (this.containsKeywords(contentLower, ['communication', 'conflict', 'understand'])) {
        issues.push('relationship communication and interpersonal conflicts');
      } else {
        issues.push('family dynamics and personal relationships');
      }
    }

    // Financial concerns with context
    if (this.containsKeywords(contentLower, ['money', 'financial', 'salary', 'rent', 'expenses', 'budget'])) {
      issues.push('financial planning and economic pressures');
    }

    // Direction/goals with context
    if (this.containsKeywords(contentLower, ['future', 'direction', 'goals', 'purpose', 'confused', 'lost'])) {
      issues.push('life direction and personal goal clarity');
    }

    // If no specific issues detected, use persona's core problems
    if (issues.length === 0) {
      issues.push(...persona.coreProblems.slice(0, 2));
    }

    return issues.slice(0, 3); // Top 3 detailed issues
  }

  /**
   * Extract emotional state indicators
   */
  private extractEmotionalState(content: string): string {
    const contentLower = content.toLowerCase();
    
    if (this.containsKeywords(contentLower, ['overwhelmed', 'stressed', 'exhausted', 'burnout'])) {
      return 'feeling overwhelmed and stressed';
    }
    if (this.containsKeywords(contentLower, ['confused', 'lost', 'uncertain', 'unsure'])) {
      return 'experiencing confusion and uncertainty';
    }
    if (this.containsKeywords(contentLower, ['frustrated', 'stuck', 'trapped'])) {
      return 'feeling frustrated and stuck';
    }
    if (this.containsKeywords(contentLower, ['anxious', 'worried', 'concerned'])) {
      return 'experiencing anxiety and worry';
    }
    if (this.containsKeywords(contentLower, ['hopeful', 'optimistic', 'ready'])) {
      return 'showing readiness for change and growth';
    }
    
    return 'seeking clarity and direction';
  }

  /**
   * Extract situational context
   */
  private extractSituationalContext(content: string, persona: PersonaProfile): string {
    const contentLower = content.toLowerCase();
    const contexts: string[] = [];
    
    if (this.containsKeywords(contentLower, ['transition', 'change', 'new', 'different'])) {
      contexts.push('navigating significant life transitions');
    }
    if (this.containsKeywords(contentLower, ['decision', 'choose', 'options'])) {
      contexts.push('facing important decisions');
    }
    if (this.containsKeywords(contentLower, ['time', 'balance', 'manage'])) {
      contexts.push('struggling with time management and priorities');
    }
    
    if (contexts.length === 0) {
      contexts.push(`working as a ${persona.occupation} in ${persona.city}`);
    }
    
    return contexts[0];
  }

  /**
   * Generate comprehensive detailed summary
   */
  private generateDetailedSummary(
    persona: PersonaProfile, 
    issues: string[], 
    emotionalState: string, 
    context: string, 
    exchangeCount: number
  ): string {
    const name = persona.name;
    const age = persona.age;
    const occupation = persona.occupation;
    
    let summary = `${name} (${age}, ${occupation}) is currently ${emotionalState} while ${context}. `;
    
    if (issues.length >= 2) {
      summary += `The primary concerns emerging from our ${exchangeCount} exchanges center around ${issues[0]} and ${issues[1]}. `;
      if (issues.length >= 3) {
        summary += `Additionally, ${issues[2]} is contributing to their overall stress. `;
      }
    } else if (issues.length === 1) {
      summary += `The main issue that has emerged is ${issues[0]}. `;
    }
    
    summary += `${name} appears motivated to address these challenges and is actively seeking guidance to move forward constructively.`;
    
    return summary;
  }

  private containsKeywords(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }
}
