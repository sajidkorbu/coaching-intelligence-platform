import { PersonaProfile } from '../types';

interface PersonaCardProps {
  persona: PersonaProfile;
  onSelect: (personaId: string) => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onSelect }) => {
  const getEmotionalStateColor = (state: string) => {
    const colors = {
      anxious: 'bg-yellow-100 text-yellow-800',
      frustrated: 'bg-red-100 text-red-800',
      hopeful: 'bg-green-100 text-green-800',
      confused: 'bg-purple-100 text-purple-800',
      motivated: 'bg-blue-100 text-blue-800'
    };
    return colors[state as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCityIcon = (city: string) => {
    const icons = {
      Mumbai: '🏙️',
      Delhi: '🕌',
      Bangalore: '🌆'
    };
    return icons[city as keyof typeof icons] || '🌃';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={() => onSelect(persona.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{persona.name}</h3>
          <p className="text-gray-600">{persona.age} years old</p>
        </div>
        <div className="text-2xl">{getCityIcon(persona.city)}</div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">{persona.occupation}</p>
        <p className="text-sm text-gray-600">{persona.city}, India</p>
      </div>

      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEmotionalStateColor(persona.personalityTraits.emotionalState)}`}>
          {persona.personalityTraits.emotionalState}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-3">{persona.currentSituation}</p>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-gray-600">
          <span className="font-medium">Key Problems:</span>
        </div>
        <ul className="text-xs text-gray-600 space-y-1">
          {persona.coreProblems.slice(0, 2).map((problem, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span className="line-clamp-2">{problem}</span>
            </li>
          ))}
          {persona.coreProblems.length > 2 && (
            <li className="text-gray-500 italic">
              +{persona.coreProblems.length - 2} more challenges...
            </li>
          )}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Communication: {persona.personalityTraits.communicationStyle}</span>
          <span>Energy: {persona.personalityTraits.energyLevel}</span>
        </div>
      </div>

      <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
        Start Coaching Session
      </button>
    </div>
  );
};