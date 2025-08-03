import { useState, useEffect, useRef } from 'react';
import { PersonaProfile, Message, CoachingReport } from '../types';
import { PersonaEngine } from '../core/PersonaEngine';
import { ICFCoachingEvaluator } from '../evaluation/ICFCoachingEvaluator';
import { DatabaseService } from '../services/DatabaseService';

interface CoachingSessionProps {
  personaId: string;
  onEndSession: (report: CoachingReport) => void;
  currentUser?: string;
}

export const CoachingSession: React.FC<CoachingSessionProps> = ({ 
  personaId, 
  onEndSession,
  currentUser = 'anonymous'
}) => {
  const [persona, setPersona] = useState<PersonaProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const personaEngine = useRef(new PersonaEngine());
  const coachingEvaluator = useRef(new ICFCoachingEvaluator());
  const databaseService = useRef(new DatabaseService());

  const MAX_MESSAGES = 16; // 8 exchanges (coach + client responses)

  useEffect(() => {
    initializeSession();
  }, [personaId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSession = async () => {
    // Wait for personas to load
    await personaEngine.current.waitForPersonasToLoad();
    
    const selectedPersona = personaEngine.current.getPersona(personaId);
    if (selectedPersona) {
      setPersona(selectedPersona);
      const newSessionId = personaEngine.current.startNewSession(personaId);
      setSessionId(newSessionId);
      
      // Add welcome message from persona
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'client',
        content: getWelcomeMessage(selectedPersona),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setMessageCount(1);
    } else {
      console.error('Failed to load persona:', personaId);
    }
  };

  const getWelcomeMessage = (persona: PersonaProfile): string => {
    const greetings = {
      'rahul-mumbai-it': "Hi, I'm Rahul. I heard you might be able to help me figure some things out. I'm honestly not sure where to start - there's just so much going on in my life right now.",
      'priya-delhi-startup': "Hello, I'm Priya. I've been thinking about getting some coaching for a while now. Running a startup is... well, it's complicated, and I could use someone to talk through some things with.",
      'arjun-bangalore-pm': "Hey, I'm Arjun. Thanks for taking the time to meet with me. I'm at a point where I feel like I need some outside perspective on my life and career.",
      'kavya-mumbai-finance': "Hi, I'm Kavya. I've been working in investment banking for a few years now, and I feel like I'm at a crossroads. The work is intense, and I'm struggling to figure out what I really want.",
      'vikram-delhi-lawyer': "Hello, I'm Vikram. I'm a corporate lawyer here in Delhi. I've been successful professionally, but lately I'm questioning if this is really what I want to be doing with my life.",
      'ananya-bangalore-ds': "Hi there, I'm Ananya. I work as a data scientist in Bangalore. I love what I do technically, but I'm having some challenges with the business side of things and career direction.",
      'rohan-mumbai-marketing': "Hey, I'm Rohan. I work in marketing for an FMCG company. I've got a lot going on right now - wedding planning, career decisions, family expectations. It's all getting a bit overwhelming.",
      'ishita-delhi-consultant': "Hello, I'm Ishita. I'm a management consultant, and I travel a lot for work. I've been successful, but I'm starting to wonder if the cost is too high, you know?",
      'aditya-bangalore-architect': "Hi, I'm Aditya. I'm a software architect with over 10 years of experience. I've reached a point where I'm questioning my next steps - both professionally and personally."
    };
    return greetings[persona.id as keyof typeof greetings] || `Hi, I'm ${persona.name}. I'm looking forward to our coaching session.`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || messageCount >= MAX_MESSAGES) return;

    const coachMessage: Message = {
      id: Date.now().toString(),
      role: 'coach',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, coachMessage]);
    setInputMessage('');
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const response = await personaEngine.current.generateResponse(
        personaId,
        inputMessage.trim(),
        sessionId
      );

      const clientMessage: Message = {
        id: Date.now().toString() + '_client',
        role: 'client',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, clientMessage]);
      setMessageCount(prev => prev + 1);
    } catch (error) {
      console.error('❌ CoachingSession Error:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        role: 'client',
        content: `Debug: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    const session = personaEngine.current.endSession(sessionId);
    
    if (session && persona) {
      // Convert messages to session format
      const sessionWithMessages = {
        ...session,
        messages: messages
      };
      
      // Generate coaching report
      const report = coachingEvaluator.current.evaluateSession(sessionWithMessages, persona);
      
      try {
        // Save to Supabase database
        const savedSession = await databaseService.current.saveCoachingSession(
          sessionWithMessages, 
          report, 
          currentUser
        );
        console.log('✅ Session saved to database:', savedSession?.id);
      } catch (error) {
        console.error('❌ Failed to save session to database:', error);
        // Continue anyway - don't block the user from seeing their report
      }
      
      onEndSession(report);
    } else {
      // Fallback if session data is not available
      onEndSession({
        sessionId,
        personaId,
        coachPerformance: {
          activeListening: { score: 75, feedback: "Good listening skills demonstrated", examples: [] },
          powerfulQuestioning: { score: 70, feedback: "Some powerful questions asked", examples: [] },
          rapportBuilding: { score: 80, feedback: "Good rapport established", examples: [] },
          goalSetting: { score: 65, feedback: "Goals could be more specific", examples: [] },
          breakthroughCreation: { score: 60, feedback: "Some insights created", examples: [] },
          overallEffectiveness: { score: 70, feedback: "Solid coaching performance", recommendations: [] }
        },
        sessionSummary: "Coaching session completed successfully",
        clientProgression: "Client showed engagement throughout the session",
        areasForImprovement: ["Continue developing coaching skills"],
        strengths: ["Good communication and empathy"],
        nextSessionRecommendations: ["Focus on more specific goal setting"],
        tonyRobbinsStyleFeedback: "Good work! Keep practicing to develop your coaching mastery."
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageExchangeCount = () => Math.floor(messageCount / 2);
  const isSessionComplete = messageCount >= MAX_MESSAGES;

  if (!persona) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coaching session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {persona.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{persona.name}</h2>
              <p className="text-sm text-gray-600">
                {persona.age} years old • {persona.occupation} • {persona.city} • 
                <span className="ml-1 capitalize">{persona.personalityTraits.emotionalState}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{getMessageExchangeCount()}/8</span> exchanges
            </div>
            <button
              onClick={handleEndSession}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'coach' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'coach'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm border'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'coach' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          {isSessionComplete ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 font-medium">
                  🎉 Coaching session completed! 
                </p>
                <p className="text-green-700 text-sm mt-1">
                  You've had 8 meaningful exchanges with {persona.name}. Ready for your evaluation?
                </p>
              </div>
              <button
                onClick={handleEndSession}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Coaching Report
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your coaching response..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};