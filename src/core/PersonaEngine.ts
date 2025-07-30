import { PersonaProfile, PersonaMemory, CoachingSession } from '../types';
import { MemoryStore } from './MemoryStore';
import { ConsistencyValidator } from './ConsistencyValidator';
import { SecureOpenAIService } from '../services/SecureOpenAIService';
import { OpenAIService } from '../services/OpenAIService';

export class PersonaEngine {
  private memoryStore: MemoryStore;
  private consistencyValidator: ConsistencyValidator;
  private secureOpenAIService: SecureOpenAIService;
  private fallbackOpenAIService: OpenAIService;
  private personas: Map<string, PersonaProfile>;

  constructor() {
    this.memoryStore = new MemoryStore();
    this.consistencyValidator = new ConsistencyValidator();
    this.secureOpenAIService = new SecureOpenAIService();
    this.fallbackOpenAIService = new OpenAIService();
    this.personas = new Map();
    this.initializePersonas();
  }

  private initializePersonas() {
    // Load persona profiles synchronously
    import('../data/personas').then(({ personas }) => {
      personas.forEach(persona => {
        this.personas.set(persona.id, persona);
      });
    });
  }

  public async waitForPersonasToLoad(): Promise<void> {
    // Wait for personas to be loaded
    let attempts = 0;
    while (this.personas.size === 0 && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
  }

  public getPersona(personaId: string): PersonaProfile | undefined {
    return this.personas.get(personaId);
  }

  public getAllPersonas(): PersonaProfile[] {
    return Array.from(this.personas.values());
  }

  public async generateResponse(
    personaId: string, 
    coachMessage: string, 
    sessionId: string
  ): Promise<string> {
    const persona = this.personas.get(personaId);
    if (!persona) {
      throw new Error(`Persona ${personaId} not found`);
    }

    // Get conversation memory and context
    const memory = this.memoryStore.getPersonaMemory(personaId);
    const conversationContext = this.buildConversationContext(memory, coachMessage);

    // Generate response using OpenAI with persona context
    const response = await this.callOpenAI(persona, conversationContext, coachMessage);

    // Validate response consistency with persona
    const validatedResponse = await this.consistencyValidator.validateResponse(
      persona, 
      response, 
      memory
    );

    // Update memory with new interaction
    this.updatePersonaMemory(personaId, coachMessage, validatedResponse, sessionId);

    return validatedResponse;
  }

  private buildConversationContext(memory: PersonaMemory, currentMessage: string): string {
    // Build context string for OpenAI including:
    // - Recent conversation history
    // - Emotional state progression
    // - Key memories and insights
    // - Current persona state
    
    const recentHistory = memory.conversationHistory
      .slice(-10) // Last 10 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const emotionalContext = memory.emotionalJourney
      .slice(-3) // Last 3 emotional states
      .map(emotion => `${emotion.emotion} (${emotion.trigger})`)
      .join(', ');

    return `
Conversation History:
${recentHistory}

Current Emotional State: ${emotionalContext}
Context Summary: ${memory.contextSummary}
Current Coach Message: ${currentMessage}
    `;
  }

  private async callOpenAI(
    persona: PersonaProfile, 
    context: string, 
    coachMessage: string
  ): Promise<string> {
    // Build conversation history for the secure service
    const memory = this.memoryStore.getPersonaMemory(persona.id);
    
    const conversationHistory = [
      {
        role: 'system' as const,
        content: `You are ${persona.name}, a ${persona.age}-year-old ${persona.occupation} from ${persona.city}. 

Background: ${persona.background}
Current Situation: ${persona.currentSituation}
Core Problems: ${persona.coreProblems.map(p => `- ${p}`).join('\n')}

Personality Traits:
- Communication Style: ${persona.personalityTraits.communicationStyle}
- Emotional State: ${persona.personalityTraits.emotionalState}
- Energy Level: ${persona.personalityTraits.energyLevel}
- Openness to Change: ${persona.personalityTraits.opennessToChange}

Work Profile: ${persona.workPersona ? `${persona.workPersona.jobTitle} - ${persona.workPersona.industry}` : 'N/A'}
Personal Context: General personal challenges related to ${persona.city} metro lifestyle

Important: Stay consistent with your personality, background, and current emotional state. Respond naturally as a real person would, showing authentic emotions and reactions. Remember previous conversations and maintain continuity.

${context}`
      },
      ...memory.conversationHistory.slice(-8).map(msg => ({
        role: msg.role === 'coach' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: coachMessage
      }
    ];

    try {
      console.log('🔄 Trying Edge Function first...');
      console.log('📋 PersonaEngine conversation history:', {
        length: conversationHistory?.length,
        first: conversationHistory?.[0],
        last: conversationHistory?.[conversationHistory.length - 1]
      });
      
      const result = await this.secureOpenAIService.generatePersonaResponse(
        persona.id,
        coachMessage,
        conversationHistory
      );
      console.log('✅ Edge Function worked!');
      return result;
    } catch (error) {
      console.error('❌ Edge Function failed:', error);
      console.log('🔄 Falling back to direct OpenAI...');
      
      try {
        const fallbackResult = await this.fallbackOpenAIService.generatePersonaResponse(
          persona,
          context,
          coachMessage
        );
        console.log('✅ Fallback OpenAI worked!');
        return fallbackResult;
      } catch (fallbackError) {
        console.error('❌ Fallback OpenAI also failed:', fallbackError);
        throw new Error(`Both services failed. Edge Function: ${error instanceof Error ? error.message : String(error)}. OpenAI: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
      }
    }
  }


  private updatePersonaMemory(
    personaId: string, 
    coachMessage: string, 
    personaResponse: string, 
    sessionId: string
  ) {
    // Add messages to memory
    this.memoryStore.addMessage(personaId, {
      id: Date.now().toString() + '_coach',
      role: 'coach',
      content: coachMessage,
      timestamp: new Date()
    });

    this.memoryStore.addMessage(personaId, {
      id: Date.now().toString() + '_client',
      role: 'client',
      content: personaResponse,
      timestamp: new Date()
    });

    // Update emotional state and context
    this.memoryStore.updateEmotionalState(personaId, sessionId);
  }

  public startNewSession(personaId: string): string {
    const sessionId = Date.now().toString();
    this.memoryStore.createSession(personaId, sessionId);
    return sessionId;
  }

  public endSession(sessionId: string): CoachingSession | undefined {
    return this.memoryStore.endSession(sessionId);
  }

  public getSessionHistory(personaId: string): CoachingSession[] {
    return this.memoryStore.getSessionHistory(personaId);
  }
}