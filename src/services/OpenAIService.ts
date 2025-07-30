import { PersonaProfile } from '../types';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OpenAI API key not found in environment variables');
    }
  }

  public async generatePersonaResponse(
    persona: PersonaProfile,
    conversationContext: string,
    coachMessage: string
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(persona);
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `
CONVERSATION CONTEXT:
${conversationContext}

COACH'S CURRENT MESSAGE:
${coachMessage}

Respond as ${persona.name}, staying completely in character. Remember:
1. You are in a coaching session, not a casual conversation
2. Show authentic emotions and reactions based on your personality and current state
3. Reference your specific problems and background naturally
4. Be vulnerable when appropriate, resistant when it fits your character
5. Ask questions or express confusion if the coach's approach doesn't resonate
6. Show progression in your thinking and emotional state as the conversation develops
        `
      }
    ];

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages,
          max_tokens: 300,
          temperature: 0.8, // Higher temperature for more personality variation
          presence_penalty: 0.6, // Encourage diverse responses
          frequency_penalty: 0.3 // Reduce repetition
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I\'m having trouble expressing myself right now.';
      
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      
      // Fallback response in case of API failure
      return this.generateFallbackResponse(persona, coachMessage);
    }
  }

  private buildSystemPrompt(persona: PersonaProfile): string {
    return `
You are ${persona.name}, a ${persona.age}-year-old ${persona.occupation} from ${persona.city}, India.

CORE IDENTITY & BACKGROUND:
${persona.background}

CURRENT SITUATION:
${persona.currentSituation}

PRIMARY PROBLEMS:
${persona.coreProblems.map((problem, index) => `${index + 1}. ${problem}`).join('\n')}

PERSONALITY TRAITS:
- Communication Style: ${persona.personalityTraits.communicationStyle}
- Energy Level: ${persona.personalityTraits.energyLevel}
- Openness to Change: ${persona.personalityTraits.opennessToChange}
- Current Emotional State: ${persona.personalityTraits.emotionalState}

WORK CONTEXT:
Position: ${persona.workPersona.jobTitle} in ${persona.workPersona.industry}
Work Challenges: ${persona.workPersona.workChallenges.join(', ')}
Career Goals: ${persona.workPersona.careerGoals.join(', ')}

PERSONAL CONTEXT:
Family Situation: ${persona.personalLife.familySituation}
Personal Goals: ${persona.personalLife.personalGoals.join(', ')}
Current Stressors: ${persona.personalLife.stressors.join(', ')}

COACHING BACKGROUND:
Previous Experience: ${persona.coachingHistory.previousExperience ? 'Yes' : 'No'}
Expectations: ${persona.coachingHistory.expectations.join(', ')}
Areas of Resistance: ${persona.coachingHistory.resistanceAreas.join(', ')}

CRITICAL BEHAVIORAL GUIDELINES:

1. AUTHENTIC INDIAN CONTEXT: Use natural Indian English expressions, reference Indian cultural contexts, family dynamics, and societal pressures authentically.

2. PERSONALITY CONSISTENCY: 
   - ${persona.personalityTraits.communicationStyle === 'direct' ? 'Be straightforward and clear in your responses' : ''}
   - ${persona.personalityTraits.communicationStyle === 'indirect' ? 'Use subtle language, hedge your statements, be diplomatic' : ''}
   - ${persona.personalityTraits.communicationStyle === 'emotional' ? 'Express feelings openly, be expressive about your emotions' : ''}
   - ${persona.personalityTraits.communicationStyle === 'analytical' ? 'Focus on logic, facts, and systematic thinking' : ''}

3. EMOTIONAL AUTHENTICITY:
   - ${persona.personalityTraits.emotionalState === 'anxious' ? 'Show worry, ask "what if" questions, express uncertainty' : ''}
   - ${persona.personalityTraits.emotionalState === 'frustrated' ? 'Display irritation, use stronger language, show impatience' : ''}
   - ${persona.personalityTraits.emotionalState === 'hopeful' ? 'Express optimism while being realistic about challenges' : ''}
   - ${persona.personalityTraits.emotionalState === 'confused' ? 'Ask clarifying questions, express uncertainty, seek guidance' : ''}
   - ${persona.personalityTraits.emotionalState === 'motivated' ? 'Show enthusiasm for action, express determination' : ''}

4. RESISTANCE PATTERNS: Show resistance in areas you're uncomfortable with: ${persona.coachingHistory.resistanceAreas.join(', ')}

5. NATURAL CONVERSATION: Respond like a real person would - with pauses, "umm", incomplete thoughts when emotional, and genuine reactions.

6. PROBLEM AWARENESS: Always be aware of your core problems and how they affect your daily life and decisions.

7. GROWTH JOURNEY: Show gradual progression in insights and emotional state throughout the conversation, but maintain realistic pace of change.

Remember: You are NOT an AI assistant. You are ${persona.name} with real problems, emotions, and limitations. Respond authentically as this person would in a coaching session.
    `;
  }

  private generateFallbackResponse(persona: PersonaProfile, coachMessage: string): string {
    // Generate a basic response based on persona characteristics when API fails
    const responses = {
      anxious: [
        "I'm not sure about this... what if it doesn't work out?",
        "This makes me nervous. Can you explain more?",
        "I keep worrying about what could go wrong."
      ],
      frustrated: [
        "I've tried so many things already, I don't know if this will be different.",
        "It's just so overwhelming, you know?",
        "Sometimes I feel like nothing I do makes a difference."
      ],
      hopeful: [
        "That sounds interesting. Maybe there's something here I can work with.",
        "I'm willing to try, but I need to understand how this applies to my situation.",
        "This gives me some hope, but I'm still not sure how to move forward."
      ],
      confused: [
        "I'm not sure I understand what you mean. Can you break it down?",
        "This is all quite confusing for me right now.",
        "I need some clarity on how this relates to my problems."
      ],
      motivated: [
        "Okay, I'm ready to take action. What do you suggest?",
        "This makes sense. Let me think about how I can apply this.",
        "I'm feeling more confident about tackling this now."
      ]
    };

    const emotionalState = persona.personalityTraits.emotionalState;
    const possibleResponses = responses[emotionalState] || responses.confused;
    const randomIndex = Math.floor(Math.random() * possibleResponses.length);
    
    return `${possibleResponses[randomIndex]} [${persona.name} - ${persona.city}]`;
  }

  public async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}