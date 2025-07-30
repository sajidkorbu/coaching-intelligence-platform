import { PersonaMemory, Message, CoachingSession } from '../types';

export class MemoryStore {
  private personaMemories: Map<string, PersonaMemory>;
  private sessions: Map<string, CoachingSession>;
  private storageKey = 'coaching_app_memory';

  constructor() {
    this.personaMemories = new Map();
    this.sessions = new Map();
    this.loadFromStorage();
  }

  public getPersonaMemory(personaId: string): PersonaMemory {
    if (!this.personaMemories.has(personaId)) {
      this.initializePersonaMemory(personaId);
    }
    return this.personaMemories.get(personaId)!;
  }

  private initializePersonaMemory(personaId: string): void {
    const memory: PersonaMemory = {
      personaId,
      conversationHistory: [],
      emotionalJourney: [],
      keyMemories: [],
      coachingProgress: {
        insightsGained: [],
        behaviorChanges: [],
        goalsSet: [],
        goalsAchieved: []
      },
      contextSummary: 'New coaching relationship beginning.'
    };
    
    this.personaMemories.set(personaId, memory);
    this.saveToStorage();
  }

  public addMessage(personaId: string, message: Message): void {
    const memory = this.getPersonaMemory(personaId);
    memory.conversationHistory.push(message);
    
    // Keep only last 50 messages to manage memory
    if (memory.conversationHistory.length > 50) {
      memory.conversationHistory = memory.conversationHistory.slice(-50);
    }
    
    this.saveToStorage();
  }

  public updateEmotionalState(personaId: string, sessionId: string): void {
    const memory = this.getPersonaMemory(personaId);
    const session = this.sessions.get(sessionId);
    
    if (!session) return;

    // Analyze recent messages to determine emotional progression
    const recentMessages = memory.conversationHistory.slice(-4);
    const emotionalCues = this.detectEmotionalCues(recentMessages);
    
    if (emotionalCues.length > 0) {
      memory.emotionalJourney.push({
        timestamp: new Date(),
        emotion: emotionalCues[0].emotion,
        trigger: emotionalCues[0].trigger
      });

      // Keep only last 20 emotional states
      if (memory.emotionalJourney.length > 20) {
        memory.emotionalJourney = memory.emotionalJourney.slice(-20);
      }
    }

    this.updateContextSummary(personaId);
    this.saveToStorage();
  }

  private detectEmotionalCues(messages: Message[]): Array<{emotion: string, trigger: string}> {
    // Simple emotion detection based on message content
    // In a full implementation, this could use sentiment analysis
    const cues: Array<{emotion: string, trigger: string}> = [];
    
    for (const message of messages) {
      const content = message.content.toLowerCase();
      
      if (content.includes('frustrated') || content.includes('angry')) {
        cues.push({ emotion: 'frustrated', trigger: 'work situation' });
      } else if (content.includes('excited') || content.includes('hopeful')) {
        cues.push({ emotion: 'hopeful', trigger: 'breakthrough moment' });
      } else if (content.includes('confused') || content.includes('unclear')) {
        cues.push({ emotion: 'confused', trigger: 'complex situation' });
      } else if (content.includes('motivated') || content.includes('ready')) {
        cues.push({ emotion: 'motivated', trigger: 'action planning' });
      }
    }
    
    return cues;
  }

  private updateContextSummary(personaId: string): void {
    const memory = this.getPersonaMemory(personaId);
    
    // Generate summary based on recent conversations and emotional journey
    const recentEmotions = memory.emotionalJourney.slice(-3).map(e => e.emotion);
    const messageCount = memory.conversationHistory.length;
    const hasBreakthroughs = memory.coachingProgress.insightsGained.length > 0;
    
    let summary = `${messageCount} messages exchanged. `;
    
    if (recentEmotions.length > 0) {
      summary += `Recent emotional progression: ${recentEmotions.join(' → ')}. `;
    }
    
    if (hasBreakthroughs) {
      summary += `${memory.coachingProgress.insightsGained.length} insights gained. `;
    }
    
    summary += 'Coaching relationship developing.';
    
    memory.contextSummary = summary;
  }

  public createSession(personaId: string, sessionId: string): void {
    const session: CoachingSession = {
      id: sessionId,
      personaId,
      startTime: new Date(),
      messages: [],
      sessionGoals: [],
      keyInsights: [],
      breakthroughMoments: [],
      personaEmotionalState: {
        initial: 'neutral',
        current: 'neutral',
        progression: []
      }
    };
    
    this.sessions.set(sessionId, session);
    this.saveToStorage();
  }

  public endSession(sessionId: string): CoachingSession | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = new Date();
      this.saveToStorage();
    }
    return session;
  }

  public getSessionHistory(personaId: string): CoachingSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.personaId === personaId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  public addKeyInsight(personaId: string, insight: string): void {
    const memory = this.getPersonaMemory(personaId);
    memory.coachingProgress.insightsGained.push(insight);
    
    memory.keyMemories.push({
      timestamp: new Date(),
      content: insight,
      importance: 'high'
    });
    
    this.saveToStorage();
  }

  public setGoal(personaId: string, goal: string): void {
    const memory = this.getPersonaMemory(personaId);
    memory.coachingProgress.goalsSet.push(goal);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    try {
      const data = {
        memories: Array.from(this.personaMemories.entries()),
        sessions: Array.from(this.sessions.entries())
      };
      
      sessionStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        this.personaMemories = new Map(data.memories || []);
        this.sessions = new Map(data.sessions || []);
        
        // Convert date strings back to Date objects
        this.sessions.forEach(session => {
          session.startTime = new Date(session.startTime);
          if (session.endTime) {
            session.endTime = new Date(session.endTime);
          }
        });
        
        this.personaMemories.forEach(memory => {
          memory.conversationHistory.forEach(msg => {
            msg.timestamp = new Date(msg.timestamp);
          });
          memory.emotionalJourney.forEach(emotion => {
            emotion.timestamp = new Date(emotion.timestamp);
          });
          memory.keyMemories.forEach(memory => {
            memory.timestamp = new Date(memory.timestamp);
          });
        });
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }

  public clearMemory(personaId?: string): void {
    if (personaId) {
      this.personaMemories.delete(personaId);
      // Remove sessions for this persona
      for (const [sessionId, session] of this.sessions.entries()) {
        if (session.personaId === personaId) {
          this.sessions.delete(sessionId);
        }
      }
    } else {
      this.personaMemories.clear();
      this.sessions.clear();
    }
    
    this.saveToStorage();
  }
}