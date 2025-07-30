import { useState, useEffect } from 'react';
import { DatabaseService } from '../services/DatabaseService';

interface DashboardProps {
  onBackToSelection: () => void;
  onLogout?: () => void;
  currentUser?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onBackToSelection, onLogout, currentUser = 'anonymous' }) => {
  const [stats, setStats] = useState<any>(null);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const databaseService = new DatabaseService();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Test connection first
      const connectionTest = await databaseService.testConnection();
      if (!connectionTest.success) {
        throw new Error('Unable to connect to database');
      }

      // Load user stats and recent sessions
      const [userStats, sessions] = await Promise.all([
        databaseService.getOverallUserStats(currentUser),
        databaseService.getUserSessions(currentUser, 5)
      ]);

      setStats(userStats);
      setRecentSessions(sessions);
      setError(null);
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError('Unable to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your coaching dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-4"
          >
            Retry
          </button>
          <button
            onClick={onBackToSelection}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Coaching Dashboard</h1>
            <p className="text-gray-600">Track your progress and improvement over time</p>
            {currentUser && currentUser !== 'anonymous' && (
              <p className="text-sm text-gray-500 mt-1">User: <span className="capitalize font-medium">{currentUser}</span></p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToSelection}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Session
            </button>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-blue-600 text-3xl mr-4">🎯</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalSessions || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-green-600 text-3xl mr-4">📈</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Improvement</p>
                <p className={`text-2xl font-bold ${stats?.improvementTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats?.improvementTrend > 0 ? '+' : ''}{stats?.improvementTrend || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-purple-600 text-3xl mr-4">💪</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Strongest Skill</p>
                <p className="text-sm font-bold text-gray-800 capitalize">
                  {stats?.strongestCompetency?.replace(/([A-Z])/g, ' $1').trim() || 'None yet'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-orange-600 text-3xl mr-4">🎯</div>
              <div>
                <p className="text-sm font-medium text-gray-600">Focus Area</p>
                <p className="text-sm font-bold text-gray-800 capitalize">
                  {stats?.weakestCompetency?.replace(/([A-Z])/g, ' $1').trim() || 'None yet'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Coaching Sessions</h2>
          
          {recentSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-600 mb-4">No coaching sessions yet</p>
              <button
                onClick={onBackToSelection}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Your First Session
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Session with {session.persona_id.split('-').map((word: string) => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(session.completed_at).toLocaleDateString()} • {session.session_duration} exchanges
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        {session.evaluation_report?.coachPerformance?.overallEffectiveness?.score || 0}%
                      </div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Database Connection Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-700">Connected to Supabase Database</span>
          </div>
        </div>
      </div>
    </div>
  );
};