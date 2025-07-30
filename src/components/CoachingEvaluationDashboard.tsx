import React, { useState, useEffect } from 'react';
import { CoachingSession, PersonaProfile } from '../types';
import { CoachingEvaluationService, DetailedSessionAnalysis, RealTimeEvaluation } from '../evaluation/CoachingEvaluationService';
// import { SixHumanNeeds } from '../evaluation/TonyRobbinsEvaluationFramework';

interface CoachingEvaluationDashboardProps {
  session: CoachingSession;
  persona: PersonaProfile;
  isSessionActive: boolean;
}

export const CoachingEvaluationDashboard: React.FC<CoachingEvaluationDashboardProps> = ({
  session,
  persona,
  isSessionActive
}) => {
  const [analysis, setAnalysis] = useState<DetailedSessionAnalysis | null>(null);
  const [realTimeEval, setRealTimeEval] = useState<RealTimeEvaluation | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'improvement'>('overview');
  
  const evaluationService = CoachingEvaluationService.getInstance();

  useEffect(() => {
    if (isSessionActive && session.messages.length > 0) {
      // Real-time evaluation during session
      const realTime = evaluationService.evaluateRealTime(session.messages, persona);
      setRealTimeEval(realTime);
    } else if (!isSessionActive && session.messages.length > 0) {
      // Comprehensive evaluation after session
      const detailed = evaluationService.evaluateSession(session, persona);
      setAnalysis(detailed);
    }
  }, [session.messages, isSessionActive, persona]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreEmoji = (score: number): string => {
    if (score >= 80) return '🔥';
    if (score >= 60) return '💪';
    return '🎯';
  };

  // Real-time dashboard during active session
  if (isSessionActive && realTimeEval) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            🎯 Real-Time Coaching Assessment
          </h3>
          <div className={`px-4 py-2 rounded-full ${getScoreColor(realTimeEval.currentScore)}`}>
            <span className="font-bold">{getScoreEmoji(realTimeEval.currentScore)} {realTimeEval.currentScore}/100</span>
          </div>
        </div>

        {/* Six Human Needs Status */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Six Human Needs Addressed</h4>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(realTimeEval.sixNeedsStatus).map(([need, addressed]) => (
              <div key={need} className={`p-3 rounded-lg ${addressed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                <div className="font-medium capitalize">
                  {addressed ? '✅' : '⭕'} {need.replace('_', '/')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Suggestions */}
        {realTimeEval.suggestions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-3">🚀 Live Coaching Suggestions</h4>
            <div className="space-y-2">
              {realTimeEval.suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-blue-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Question Recommendation */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-3">💡 Recommended Next Question</h4>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-purple-800 italic">"{realTimeEval.nextQuestionRecommendation}"</p>
          </div>
        </div>

        {/* Breakthrough Alert */}
        {realTimeEval.breakthroughAlert && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-800 font-medium">{realTimeEval.breakthroughAlert}</p>
          </div>
        )}
      </div>
    );
  }

  // Post-session comprehensive analysis
  if (!isSessionActive && analysis) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">🎓 Coaching Session Evaluation</h2>
          <p className="text-blue-100">
            Session with {persona.name} • {session.messages.length} messages exchanged
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'detailed', label: 'Detailed Analysis', icon: '🔍' },
              { id: 'improvement', label: 'Improvement Plan', icon: '🚀' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Tony Robbins Style Feedback */}
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                <h3 className="text-lg font-bold text-orange-800 mb-2">
                  🔥 Breakthrough Coaching Feedback
                </h3>
                <p className="text-orange-700 text-lg leading-relaxed">
                  {analysis.coachingReport.tonyRobbinsStyleFeedback}
                </p>
              </div>

              {/* Core Competencies Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.coachingReport.coachPerformance).map(([key, value]) => {
                  if (key === 'overallEffectiveness') return null;
                  
                  const titles = {
                    activeListening: 'Active Listening',
                    powerfulQuestioning: 'Powerful Questioning',
                    rapportBuilding: 'Rapport Building',
                    goalSetting: 'Goal Setting',
                    breakthroughCreation: 'Breakthrough Creation'
                  };
                  
                  return (
                    <div key={key} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {titles[key as keyof typeof titles]}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(value.score)}`}>
                          {getScoreEmoji(value.score)} {value.score}/100
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{value.feedback}</p>
                    </div>
                  );
                })}
              </div>

              {/* Overall Effectiveness */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Overall Effectiveness</h3>
                  <span className={`px-4 py-2 rounded-full text-lg font-bold ${getScoreColor(analysis.coachingReport.coachPerformance.overallEffectiveness.score)}`}>
                    {getScoreEmoji(analysis.coachingReport.coachPerformance.overallEffectiveness.score)} 
                    {analysis.coachingReport.coachPerformance.overallEffectiveness.score}/100
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  {analysis.coachingReport.coachPerformance.overallEffectiveness.feedback}
                </p>
                
                {/* Strengths and Areas for Improvement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-800 mb-2">💪 Strengths</h4>
                    <ul className="space-y-1">
                      {analysis.coachingReport.strengths.map((strength, index) => (
                        <li key={index} className="text-green-700 text-sm">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">🎯 Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {analysis.coachingReport.areasForImprovement.map((area, index) => (
                        <li key={index} className="text-orange-700 text-sm">• {area}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Analysis Tab */}
          {activeTab === 'detailed' && (
            <div className="space-y-6">
              {/* Session Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysis.sessionMetrics.totalMessages}
                  </div>
                  <div className="text-sm text-blue-800">Total Messages</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analysis.sessionMetrics.breakthroughMoments}
                  </div>
                  <div className="text-sm text-green-800">Breakthroughs</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {analysis.sessionMetrics.questionToStatementRatio.toFixed(1)}
                  </div>
                  <div className="text-sm text-purple-800">Question:Statement</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {analysis.sessionMetrics.emotionalProgressionScore}
                  </div>
                  <div className="text-sm text-orange-800">Emotional Progress</div>
                </div>
              </div>

              {/* Cultural Context Analysis */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">🏮 Cultural Context Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${analysis.culturalContextAnalysis.familyPressureAddressed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className="font-medium">
                      {analysis.culturalContextAnalysis.familyPressureAddressed ? '✅' : '❌'} Family Pressure
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${analysis.culturalContextAnalysis.workLifeBalanceDiscussed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className="font-medium">
                      {analysis.culturalContextAnalysis.workLifeBalanceDiscussed ? '✅' : '❌'} Work-Life Balance
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${analysis.culturalContextAnalysis.financialConcernsAcknowledged ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <div className="font-medium">
                      {analysis.culturalContextAnalysis.financialConcernsAcknowledged ? '✅' : '❌'} Financial Concerns
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Cultural Sensitivity Score</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${analysis.culturalContextAnalysis.culturalSensitivityScore}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {analysis.culturalContextAnalysis.culturalSensitivityScore}/100
                  </div>
                </div>

                {analysis.culturalContextAnalysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Cultural Recommendations</h4>
                    <ul className="space-y-1">
                      {analysis.culturalContextAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-700 text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Session Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">📝 Session Summary</h3>
                <p className="text-gray-700 mb-4">{analysis.coachingReport.sessionSummary}</p>
                
                <h4 className="font-medium mb-2">Client Progression</h4>
                <p className="text-gray-700">{analysis.coachingReport.clientProgression}</p>
              </div>
            </div>
          )}

          {/* Improvement Plan Tab */}
          {activeTab === 'improvement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Immediate Actions */}
                <div className="p-4 border border-red-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">🚨 Immediate Actions</h3>
                  <ul className="space-y-2">
                    {analysis.improvementPlan.immediateActions.map((action, index) => (
                      <li key={index} className="text-red-700 text-sm">• {action}</li>
                    ))}
                  </ul>
                </div>

                {/* Skill Development Areas */}
                <div className="p-4 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">📚 Skill Development</h3>
                  <ul className="space-y-2">
                    {analysis.improvementPlan.skillDevelopmentAreas.map((skill, index) => (
                      <li key={index} className="text-blue-700 text-sm">• {skill}</li>
                    ))}
                  </ul>
                </div>

                {/* Tony Robbins Techniques */}
                <div className="p-4 border border-orange-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">🔥 Advanced Coaching Techniques</h3>
                  <ul className="space-y-2">
                    {analysis.improvementPlan.tonyRobbinsTechniquesToPractice.map((technique, index) => (
                      <li key={index} className="text-orange-700 text-sm">• {technique}</li>
                    ))}
                  </ul>
                </div>

                {/* Next Session Preparation */}
                <div className="p-4 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">🎯 Next Session Prep</h3>
                  <ul className="space-y-2">
                    {analysis.improvementPlan.nextSessionPreparation.map((prep, index) => (
                      <li key={index} className="text-green-700 text-sm">• {prep}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Session Recommendations */}
              {analysis.coachingReport.nextSessionRecommendations.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">💡 Next Session Focus</h3>
                  <ul className="space-y-2">
                    {analysis.coachingReport.nextSessionRecommendations.map((rec, index) => (
                      <li key={index} className="text-purple-700 text-sm">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
};