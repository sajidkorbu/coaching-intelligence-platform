import { useState, useEffect } from 'react';
import { PersonaSelection } from './components/PersonaSelection';
import { CoachingSession } from './components/CoachingSession';
import { CoachingReport } from './components/CoachingReport';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { CoachingReport as ReportType } from './types';

type AppState = 'login' | 'selection' | 'coaching' | 'report' | 'dashboard';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('');
  const [coachingReport, setCoachingReport] = useState<ReportType | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('coachapp_user');
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentState('selection');
    }
  }, []);

  const handleLogin = (userId: string) => {
    setCurrentUser(userId);
    setCurrentState('selection');
  };

  const handleLogout = () => {
    localStorage.removeItem('coachapp_user');
    setCurrentUser(null);
    setCurrentState('login');
    setSelectedPersonaId('');
    setCoachingReport(null);
  };

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setCurrentState('coaching');
  };

  const handleEndSession = (report: ReportType) => {
    setCoachingReport(report);
    setCurrentState('report');
  };

  const handleBackToSelection = () => {
    setCurrentState('selection');
    setSelectedPersonaId('');
    setCoachingReport(null);
  };

  const handleGoToDashboard = () => {
    setCurrentState('dashboard');
  };

  return (
    <div className="min-h-screen">
      {currentState === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      
      {currentState === 'selection' && currentUser && (
        <PersonaSelection 
          onPersonaSelect={handlePersonaSelect}
          onGoToDashboard={handleGoToDashboard}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
      
      {currentState === 'coaching' && selectedPersonaId && currentUser && (
        <CoachingSession 
          personaId={selectedPersonaId}
          onEndSession={handleEndSession}
          currentUser={currentUser}
        />
      )}
      
      {currentState === 'report' && coachingReport && (
        <CoachingReport 
          report={coachingReport}
          onStartNewSession={handleBackToSelection}
        />
      )}

      {currentState === 'dashboard' && currentUser && (
        <Dashboard 
          onBackToSelection={handleBackToSelection}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;