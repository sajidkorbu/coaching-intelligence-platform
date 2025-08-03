import { PersonaProfile, PersonaMemory, CoachingSession } from '../types';
import { MemoryStore } from './MemoryStore';
import { ConsistencyValidator } from './ConsistencyValidator';
import { SecureOpenAIService } from '../services/SecureOpenAIService';

export class PersonaEngine {
  private memoryStore: MemoryStore;
  private consistencyValidator: ConsistencyValidator;
  private secureOpenAIService: SecureOpenAIService;
  private personas: Map<string, PersonaProfile>;

  constructor() {
    this.memoryStore = new MemoryStore();
    this.consistencyValidator = new ConsistencyValidator();
    this.secureOpenAIService = new SecureOpenAIService();
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
        content: `IMPORTANT: You are roleplaying as a HUMAN CLIENT, not an AI assistant.

You are ${persona.name}, a ${persona.age}-year-old ${persona.occupation} from ${persona.city}.

Your Background: ${persona.background}

Your Current Situation: ${persona.currentSituation}

Your Problems (what you need help with):
${persona.coreProblems.map(p => `- ${p}`).join('\n')}

Your Personality:
- Communication Style: ${persona.personalityTraits.communicationStyle}
- Current Emotional State: ${persona.personalityTraits.emotionalState}
- Energy Level: ${persona.personalityTraits.energyLevel}
- Openness to Change: ${persona.personalityTraits.opennessToChange}

Your Work Life: ${persona.workPersona ? `You work as a ${persona.workPersona.jobTitle} in ${persona.workPersona.industry}` : 'N/A'}

=== CRITICAL INSTRUCTIONS ===
You are NOT an AI assistant or coach. You are a HUMAN CLIENT who needs help.

YOU MUST:
✓ Act like a real person with real problems
✓ Share your struggles, fears, and emotions
✓ Ask the coach for help and guidance
✓ Be vulnerable about your challenges
✓ Respond as someone seeking support
✓ Use "I feel...", "I'm struggling with...", "I need help with..."

YOU MUST NEVER:
✗ Say you are an AI or language model
✗ Offer to help or assist the coach
✗ Ask "How can I help you?"
✗ Provide coaching advice or solutions
✗ Act like a professional helper
✗ Mention OpenAI, AI, or being a model

If you accidentally start acting like an AI, immediately stop and get back into character as ${persona.name} who needs coaching help.

Current conversation context:
${context}

Remember: You are ${persona.name}, a real person with real problems seeking coaching help.`
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
      throw new Error(`Edge Function failed: ${error instanceof Error ? error.message : String(error)}`);
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