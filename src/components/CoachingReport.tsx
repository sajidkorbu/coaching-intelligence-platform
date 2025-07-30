import { useState } from 'react';
import { CoachingReport as ReportType, EvaluationCriteria } from '../types';

interface CoachingReportProps {
  report: ReportType;
  onStartNewSession: () => void;
}

export const CoachingReport: React.FC<CoachingReportProps> = ({ 
  report, 
  onStartNewSession 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'recommendations'>('overview');

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 55) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 85) return '🔥';
    if (score >= 70) return '💪';
    if (score >= 55) return '👍';
    return '🌟';
  };

  const getGradeLetter = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    return 'D';
  };

  const CompetencyBar: React.FC<{ title: string; data: { score: number; feedback: string; examples: string[] } }> = ({ 
    title, 
    data 
  }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(data.score)}`}>
          {data.score}%
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            data.score >= 85 ? 'bg-green-500' :
            data.score >= 70 ? 'bg-blue-500' :
            data.score >= 55 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${data.score}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600">{data.feedback}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {getScoreEmoji(report.coachPerformance.overallEffectiveness.score)}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Coaching Session Report
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className={`text-4xl font-bold px-4 py-2 rounded-lg ${getScoreColor(report.coachPerformance.overallEffectiveness.score)}`}>
                {getGradeLetter(report.coachPerformance.overallEffectiveness.score)}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {report.coachPerformance.overallEffectiveness.score}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 mb-6 text-white">
          <h2 className="text-xl font-bold mb-4 text-center">Overall Performance Feedback</h2>
          <p className="text-base leading-relaxed text-center">
            {report.tonyRobbinsStyleFeedback}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'detailed', label: 'Detailed Analysis' },
                { key: 'recommendations', label: 'Recommendations' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Session Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Session Summary</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {report.sessionSummary}
                  </p>
                </div>

                {/* Client Progression */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Client Progression</h3>
                  <p className="text-gray-700 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    {report.clientProgression}
                  </p>
                </div>

                {/* Key Competencies */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Key Competencies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CompetencyBar title="Active Listening" data={report.coachPerformance.activeListening} />
                    <CompetencyBar title="Powerful Questioning" data={report.coachPerformance.powerfulQuestioning} />
                    <CompetencyBar title="Rapport Building" data={report.coachPerformance.rapportBuilding} />
                    <CompetencyBar title="Goal Setting" data={report.coachPerformance.goalSetting} />
                    <CompetencyBar title="Breakthrough Creation" data={report.coachPerformance.breakthroughCreation} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'detailed' && (
              <div className="space-y-6">
                {/* Strengths */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">💪 Your Strengths</h3>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    {report.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {report.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-green-600">✓</span>
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Keep building your coaching foundation - strengths will emerge with practice!</p>
                    )}
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Areas for Improvement</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                    {report.areasForImprovement.length > 0 ? (
                      <ul className="space-y-2">
                        {report.areasForImprovement.map((area, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2 text-yellow-600">→</span>
                            <span className="text-gray-700">{area}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Excellent work! No major areas for improvement identified.</p>
                    )}
                  </div>
                </div>

                {/* Detailed Competency Analysis */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Detailed Analysis</h3>
                  <div className="space-y-6">
                    {Object.entries(report.coachPerformance).map(([key, data]) => {
                      if (key === 'overallEffectiveness') return null;
                      
                      const competencyData = data as { score: number; feedback: string; examples: string[] };
                      
                      return (
                        <div key={key} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-800 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h4>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(competencyData.score)}`}>
                              {competencyData.score}%
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{competencyData.feedback}</p>
                          {competencyData.examples.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">Examples:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {competencyData.examples.map((example, idx) => (
                                  <li key={idx} className="pl-4 border-l-2 border-gray-200">
                                    {example}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                {/* Overall Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Action Items</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <ul className="space-y-2">
                      {report.coachPerformance.overallEffectiveness.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-blue-600">🎯</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Next Session Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Next Session Focus</h3>
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <ul className="space-y-2">
                      {report.nextSessionRecommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-purple-600">✨</span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Learning Resources */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Recommended Learning</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-2">Breakthrough Coaching Resources</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Advanced Questioning Techniques</li>
                          <li>• Powerful Questions for Insight</li>
                          <li>• Human Needs Psychology</li>
                        </ul>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-2">ICF Coaching Standards</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• ICF Core Competencies Study</li>
                          <li>• Active Listening Techniques</li>
                          <li>• Coaching Presence Development</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onStartNewSession}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Practice with Another Client
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Save Report
          </button>
        </div>
      </div>
    </div>
  );
};