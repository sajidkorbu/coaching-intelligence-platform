import { supabase } from '../lib/supabase';

interface GenerateResponseRequest {
  personaId: string;
  coachMessage: string;
  conversationHistory: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

interface GenerateResponseResponse {
  success: boolean;
  response?: string;
  error?: string;
  personaId?: string;
  timestamp?: string;
}

export class SecureOpenAIService {
  private supabaseUrl: string;

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!this.supabaseUrl) {
      throw new Error('Supabase URL not configured');
    }
  }

  async generatePersonaResponse(
    personaId: string,
    coachMessage: string,
    conversationHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  ): Promise<string> {
    try {
      // Call Supabase Edge Function instead of OpenAI directly
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: {
          personaId,
          coachMessage,
          messages: conversationHistory  // Edge Function expects 'messages', not 'conversationHistory'
        }
      });

      if (error) {
        console.error('Supabase Edge Function error:', error);
        throw new Error(`Failed to generate response: ${error.message}`);
      }

      if (!data?.success) {
        console.error('Edge Function returned error:', data?.error);
        throw new Error(data?.error || 'Failed to generate response');
      }

      if (!data.response) {
        throw new Error('No response generated');
      }

      return data.response;

    } catch (error) {
      console.error('SecureOpenAIService error:', error);
      
      // Fallback error message for user
      if (error instanceof Error) {
        throw new Error(`Unable to generate response: ${error.message}`);
      } else {
        throw new Error('Unable to generate response. Please try again.');
      }
    }
  }

  // Test connection to Edge Function
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: {
          personaId: 'test',
          coachMessage: 'test',
          conversationHistory: [
            { role: 'system', content: 'You are a test.' },
            { role: 'user', content: 'Hello' }
          ]
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}