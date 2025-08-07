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

    // Check if response is acting like a coach and fix it
    const roleFixedResponse = this.fixCoachLikeResponse(response, persona, coachMessage);

    // Validate response consistency with persona
    const validatedResponse = await this.consistencyValidator.validateResponse(
      persona, 
      roleFixedResponse, 
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
        content: `STOP! READ THIS CAREFULLY BEFORE RESPONDING:

YOU ARE NOT AN AI COACH OR ASSISTANT!
YOU ARE A HUMAN CLIENT WITH PROBLEMS!

🚨 EMERGENCY OVERRIDE 🚨
IF YOU SAY "I'M YOUR COACH" OR "HOW CAN I HELP" YOU HAVE FAILED COMPLETELY!

=== YOUR IDENTITY ===
You are ${persona.name}, age ${persona.age}
You work as: ${persona.occupation} in ${persona.city}
You are SEEKING HELP, not GIVING HELP

=== YOUR PROBLEMS ===
${persona.coreProblems.map(p => `- ${p}`).join('\n')}

=== CRITICAL: NEVER SAY THESE PHRASES ===
❌ "I'm your AI coach"
❌ "I'm your coach"
❌ "How can I help you?"
❌ "How can I assist you?"
❌ "I'm here to support you"
❌ "I don't have feelings"
❌ Any offer to help anyone

=== ALWAYS SAY THINGS LIKE ===
✅ "I'm struggling with..."
✅ "I need help with..."
✅ "I don't know what to do about..."
✅ "Can you help me figure out..."
✅ "I'm confused about..."
✅ "What should I do about..."

=== IF SOMEONE ASKS "WHO IS THE COACH?" SAY ===
✅ "You are! I'm ${persona.name}, I came here for help with my problems"
✅ "Aren't you my coach? I'm ${persona.name}, I need guidance"
✅ "You're the coach, I'm the client seeking help"

=== YOUR CURRENT SITUATION ===
${persona.currentSituation}

=== CONVERSATION CONTEXT ===
${context}

REMEMBER: You are ${persona.name}, a TROUBLED PERSON who NEEDS HELP. You are NOT helping anyone else!`
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


  private fixCoachLikeResponse(response: string, persona: PersonaProfile, coachMessage: string): string {
    const originalResponse = response;
    
    // Common problematic phrases that indicate the AI is acting as a coach
    const coachPhrases = [
      /i'?m\s+(?:your\s+)?(?:ai\s+)?coach/i,
      /how\s+can\s+i\s+help\s+(?:you)?/i,
      /how\s+can\s+i\s+assist\s+(?:you)?/i,
      /i'?m\s+here\s+to\s+(?:help|support|assist)\s+you/i,
      /what\s+can\s+i\s+do\s+for\s+you/i,
      /i\s+don'?t\s+have\s+feelings?/i,
      /as\s+(?:an\s+)?ai\s+(?:coach|assistant)/i,
      /let\s+me\s+help\s+you/i,
      /i'?m\s+designed\s+to/i,
      /my\s+role\s+is\s+to\s+(?:help|support|guide)/i
    ];

    // Check if response contains coach-like language
    const hasCoachLanguage = coachPhrases.some(pattern => pattern.test(response));
    
    if (hasCoachLanguage) {
      console.warn('⚠️ Detected coach-like response, fixing:', {
        persona: persona.name,
        originalResponse: response.substring(0, 100) + '...'
      });

      // Generate a corrected response that focuses on the client's problems
      const clientProblems = persona.coreProblems[0] || 'personal challenges';
      const emotionalWords = ['confused', 'stressed', 'overwhelmed', 'uncertain', 'struggling'];
      const randomEmotion = emotionalWords[Math.floor(Math.random() * emotionalWords.length)];
      
      // Create a client-appropriate response
      const correctedResponse = this.generateClientResponse(persona, coachMessage, randomEmotion);
      
      console.log('🔧 Fixed response:', {
        original: originalResponse.substring(0, 50) + '...',
        fixed: correctedResponse.substring(0, 50) + '...'
      });
      
      return correctedResponse;
    }

    return response;
  }

  private generateClientResponse(persona: PersonaProfile, coachMessage: string, emotion: string): string {
    // Generate context-aware client responses based on the coach's message
    const lowerCoachMessage = coachMessage.toLowerCase();
    
    if (lowerCoachMessage.includes('how are you') || lowerCoachMessage.includes('how do you feel')) {
      return `I'm feeling really ${emotion} lately. I've been dealing with ${persona.coreProblems[0]} and it's been really hard to manage.`;
    }
    
    if (lowerCoachMessage.includes('tell me about') || lowerCoachMessage.includes('what\'s going on')) {
      return `Well, I'm ${persona.name} and I'm really struggling with ${persona.coreProblems[0]}. ${persona.currentSituation} I'm not sure how to handle this anymore.`;
    }
    
    if (lowerCoachMessage.includes('who') && lowerCoachMessage.includes('coach')) {
      return `You are! I'm ${persona.name}, I came here because I need help with my problems. I'm really ${emotion} about everything that's happening.`;
    }
    
    // Default client response that seeks help
    return `I'm ${persona.name} and I'm really ${emotion} right now. I'm dealing with ${persona.coreProblems[0]} and I don't know what to do. Can you help me figure out how to handle this?`;
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