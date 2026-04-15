export type QuestionType = 'yes_no' | 'rating_10' | 'rating';
export type Severity = 'low' | 'medium' | 'critical';

export interface ScoreInputQuestion {
  questionId: string;
  questionText?: string;
  questionType: QuestionType;
  severity: Severity;
  answer: 'Yes' | 'No' | number | null;
}

export interface ScoreTraceItem {
  questionId: string;
  questionText?: string;
  questionType: QuestionType;
  severity: Severity;
  rawAnswer: 'Yes' | 'No' | number | null;
  normalizedScore: number;
  weight: number;
  weightedContribution: number;
  isCriticalFailure: boolean;
}

export interface AuditScoreResult {
  finalScore: number; // Rounded percentage
  grade: 'excellent' | 'good' | 'needs_improvement' | 'fail' | 'critical_fail';
  hasCriticalFailure: boolean;
  criticalFailureCount: number;
  scoringVersion: string;
  trace: ScoreTraceItem[];
  weightedEarned: number; // Sum of contributions
  weightedMax: number;    // Sum of weights
}

export const SCORING_VERSION = 'v2-weighted-critical-threshold-6';

export const SEVERITY_WEIGHTS: Record<Severity, number> = {
  low: 1,
  medium: 2,
  critical: 5,
};

export function calculateAuditScore(
  questions: ScoreInputQuestion[]
): AuditScoreResult {
  if (!questions.length) {
    return {
      finalScore: 0,
      grade: 'fail',
      hasCriticalFailure: false,
      criticalFailureCount: 0,
      scoringVersion: SCORING_VERSION,
      trace: [],
      weightedEarned: 0,
      weightedMax: 0,
    };
  }

  const trace: ScoreTraceItem[] = [];
  let totalWeightedContribution = 0;
  let totalWeight = 0;
  let criticalFailureCount = 0;

  for (const q of questions) {
    let normalizedScore = 0;
    let isCriticalFailure = false;

    const weight = SEVERITY_WEIGHTS[q.severity] ?? 1;

    // Normalization logic
    if (q.questionType === 'yes_no') {
      if (q.answer === 'Yes') {
        normalizedScore = 1;
      } else if (q.answer === 'No') {
        normalizedScore = 0;
        if (q.severity === 'critical') isCriticalFailure = true;
      } else {
        // Null or invalid
        normalizedScore = 0;
        if (q.severity === 'critical') isCriticalFailure = true;
      }
    } else if (q.questionType === 'rating_10' || q.questionType === 'rating') {
      const rating = typeof q.answer === 'number' ? q.answer : 0;
      // Clamp or handle invalid? Document says safely handle.
      const validRating = Math.max(0, Math.min(10, rating));
      normalizedScore = validRating / 10;
      
      if (q.severity === 'critical' && validRating < 6) {
        isCriticalFailure = true;
      }
    }

    const weightedContribution = normalizedScore * weight;
    
    totalWeightedContribution += weightedContribution;
    totalWeight += weight;
    if (isCriticalFailure) criticalFailureCount++;

    trace.push({
      questionId: q.questionId,
      questionText: q.questionText,
      questionType: q.questionType,
      severity: q.severity,
      rawAnswer: q.answer,
      normalizedScore,
      weight,
      weightedContribution,
      isCriticalFailure,
    });
  }

  const finalPercentage = totalWeight > 0 
    ? (totalWeightedContribution / totalWeight) * 100 
    : 0;
  
  const roundedScore = Math.round(finalPercentage);
  const hasCriticalFailure = criticalFailureCount > 0;

  let grade: AuditScoreResult['grade'];
  if (hasCriticalFailure) {
    grade = 'critical_fail';
  } else if (roundedScore >= 90) {
    grade = 'excellent';
  } else if (roundedScore >= 75) {
    grade = 'good';
  } else if (roundedScore >= 60) {
    grade = 'needs_improvement';
  } else {
    grade = 'fail';
  }

  return {
    finalScore: roundedScore,
    grade,
    hasCriticalFailure,
    criticalFailureCount,
    scoringVersion: SCORING_VERSION,
    trace,
    weightedEarned: totalWeightedContribution,
    weightedMax: totalWeight,
  };
}
