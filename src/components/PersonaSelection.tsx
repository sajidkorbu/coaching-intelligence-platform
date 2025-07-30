import { useState, useEffect } from 'react';
import { PersonaProfile } from '../types';
import { PersonaCard } from './PersonaCard';
import { personas } from '../data/personas';

interface PersonaSelectionProps {
  onPersonaSelect: (personaId: string) => void;
  onGoToDashboard?: () => void;
  onLogout?: () => void;
  currentUser?: string;
}

export const PersonaSelection: React.FC<PersonaSelectionProps> = ({ onPersonaSelect, onGoToDashboard, onLogout, currentUser }) => {
  const [selectedPersonas, setSelectedPersonas] = useState<PersonaProfile[]>([]);

  useEffect(() => {
    // Load personas
    setSelectedPersonas(personas);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="text-left">
                  <p className="text-sm text-gray-600">Welcome back,</p>
                  <p className="font-semibold text-gray-800 capitalize">{currentUser}</p>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Coaching Intelligence Platform
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Practice your coaching skills with AI-powered client personas
              </p>
              <p className="text-sm text-gray-500">
                Choose a client to begin your coaching session
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onGoToDashboard && (
                <button
                  onClick={onGoToDashboard}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  📊 Dashboard
                </button>
              )}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedPersonas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onSelect={onPersonaSelect}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              How it works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p><strong>Choose a Client</strong><br />Select from realistic personas with authentic Indian metro problems</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💬</div>
                <p><strong>Coach Session</strong><br />Have 8-10 message conversation using proven coaching techniques</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <p><strong>Get Feedback</strong><br />Receive detailed evaluation based on coaching best practices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};