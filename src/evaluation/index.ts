/**
 * Coaching Evaluation Framework - Index
 * 
 * A comprehensive Tony Robbins-inspired coaching evaluation system
 * combined with ICF standards for text-based coaching assessment
 * 
 * Designed specifically for Indian metro professional personas
 */

// Core Framework
export {
  TonyRobbinsEvaluationFramework,
  TonyRobbinsUtils,
  SixHumanNeeds,
  TonyRobbinsCoachingPrinciples,
  ICFCompetencies,
  TonyRobbinsTechniques,
  QuestionCategories
} from './TonyRobbinsEvaluationFramework';

// Evaluation Service
export {
  CoachingEvaluationService
} from './CoachingEvaluationService';

// Configuration
export {
  getEvaluationConfig,
  getCulturalContextForPersona,
  EVALUATION_WEIGHTS,
  CULTURAL_CONTEXTS,
  QUESTION_QUALITY_CRITERIA,
  BREAKTHROUGH_CRITERIA,
  PERFORMANCE_THRESHOLDS
} from './EvaluationConfig';

// Types
export type {
  RealTimeEvaluation,
  DetailedSessionAnalysis,
  SessionMetrics,
  CulturalContextAnalysis,
  ImprovementPlan
} from './CoachingEvaluationService';

export type {
  TextCoachingMarkers,
  StateIndicators,
  BreakthroughMoment,
  IndianContextFactors
} from './TonyRobbinsEvaluationFramework';

/**
 * Quick Start Guide:
 * 
 * 1. Real-time Evaluation:
 *    ```typescript
 *    const service = CoachingEvaluationService.getInstance();
 *    const realTimeEval = service.evaluateRealTime(messages, persona);
 *    ```
 * 
 * 2. Post-session Analysis:
 *    ```typescript
 *    const analysis = service.evaluateSession(session, persona);
 *    ```
 * 
 * 3. Question Quality Check:
 *    ```typescript
 *    const category = TonyRobbinsUtils.assessQuestionQuality(question);
 *    ```
 * 
 * 4. Breakthrough Detection:
 *    ```typescript
 *    const breakthrough = TonyRobbinsUtils.detectBreakthrough(clientResponse);
 *    ```
 */