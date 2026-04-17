# Audit Scoring Model

## Objective

Define a mathematically consistent audit scoring system for Audiment that works across all supported question and severity combinations.

Supported dimensions:
- Question types: `yes_no`, `rating_10`
- Severity levels: `low`, `medium`, `critical`
- All combinations are valid in templates

The model must produce:
- A final weighted percentage score
- A grade
- A critical-failure flag
- A critical-failure count
- Per-question explainability

## Core Principles

1. Every question must be normalized to the same scale before weighting.
2. Severity must affect importance, not question type behavior.
3. Critical failures must be handled separately from the percentage score.
4. The same formula must be used everywhere: submission, storage, reporting, exports, and dashboards.
5. The scoring trace must be auditable at the question level.

## Normalization

Each question is first converted into a normalized score between 0 and 1.

### Yes/No questions
- `Yes` = full score
- `No` = zero score

Formula:

$$
\text{normalizedScore} =
\begin{cases}
1 & \text{if answer = Yes} \\
0 & \text{if answer = No}
\end{cases}
$$

### Rating out of 10 questions
- Rating value must be an integer from 0 to 10
- The normalized score is the selected rating divided by 10

Formula:

$$
\text{normalizedScore} = \frac{\text{rating}}{10}
$$

## Severity Weights

Use the following fixed severity weights:

| Severity | Weight |
|---|---:|
| Low | 1 |
| Medium | 2 |
| Critical | 5 |

Rationale:
- Low questions contribute baseline influence.
- Medium questions matter meaningfully more than low.
- Critical questions must have strong leverage so they cannot be washed out by many easy low-severity passes.

## Weighted Score Formula

For each question:

$$
\text{weightedContribution}_i = \text{normalizedScore}_i \times \text{severityWeight}_i
$$

Final percentage:

$$
\text{finalPercentage} =
\frac{\sum \text{weightedContribution}_i}{\sum \text{severityWeight}_i}
\times 100
$$

This formula works for any number of questions and for all combinations of question type and severity.

## Critical Failure Logic

Critical failure must be tracked independently from the weighted percentage.

A question is considered a critical failure if:
- Severity = `critical` and question type = `yes_no` and answer = `No`
- Severity = `critical` and question type = `rating_10` and rating `< 6`

This threshold reflects the latest product decision: critical rating becomes alarming below 6.

Formula:

$$
\text{isCriticalFailure} =
\begin{cases}
\text{true} & \text{if severity = critical and yes/no = No} \\
\text{true} & \text{if severity = critical and rating < 6} \\
\text{false} & \text{otherwise}
\end{cases}
$$

## Final Output Fields

Every scored audit should produce and persist these fields:

| Field | Type | Meaning |
|---|---|---|
| `finalScore` | number | Weighted percentage rounded to nearest whole number |
| `grade` | string | `excellent`, `good`, `needs_improvement`, `fail`, or `critical_fail` |
| `hasCriticalFailure` | boolean | Whether any critical failure occurred |
| `criticalFailureCount` | number | Count of critical-failure questions |
| `scoringVersion` | string | Version tag such as `v2-weighted-critical-threshold-6` |

## Grade Logic

Grades should be derived after the percentage is calculated.

### If there is any critical failure
- Grade = `critical_fail`

### Otherwise use thresholds

| Percentage | Grade |
|---|---|
| 90 to 100 | `excellent` |
| 75 to 89 | `good` |
| 60 to 74 | `needs_improvement` |
| 0 to 59 | `fail` |

Important:
- `critical_fail` overrides all percentage-based grades.
- A score like 82 can still be `critical_fail` if at least one critical-failure rule is triggered.

## Per-Question Trace Model

For debugging and explainability, every scoring pass should be able to emit this per-question structure:

| Field | Example |
|---|---|
| `questionId` | `q_1` |
| `questionText` | `Food stored at safe temperature?` |
| `questionType` | `yes_no` |
| `severity` | `critical` |
| `rawAnswer` | `No` |
| `normalizedScore` | `0` |
| `weight` | `5` |
| `weightedContribution` | `0` |
| `isCriticalFailure` | `true` |

This makes score audits transparent and debuggable.

## Worked Scenarios

### Scenario A
- Q1 = Critical Yes/No = No
- Q2 = Critical Yes/No = No
- Q3 = Medium Rating = 10/10

Calculation:
- Q1: normalized = 0, weight = 5, contribution = 0
- Q2: normalized = 0, weight = 5, contribution = 0
- Q3: normalized = 1, weight = 2, contribution = 2
- Total weighted contribution = 2
- Total weight = 12
- Final score = 2 / 12 × 100 = 16.7% → 17%
- Critical failures = 2
- Grade = `critical_fail`

### Scenario B
- Q1 = Low Yes/No = Yes
- Q2 = Medium Rating = 7/10
- Q3 = Critical Rating = 8/10

Calculation:
- Q1: 1 × 1 = 1
- Q2: 0.7 × 2 = 1.4
- Q3: 0.8 × 5 = 4
- Total = 6.4
- Max weight = 8
- Final score = 6.4 / 8 × 100 = 80%
- Critical failures = 0 because 8 is not below 6
- Grade = `good`

### Scenario C
- Q1 = Critical Rating = 5/10
- Q2 = Critical Yes/No = Yes
- Q3 = Low Rating = 10/10

Calculation:
- Q1: 0.5 × 5 = 2.5 and critical failure = true
- Q2: 1 × 5 = 5
- Q3: 1 × 1 = 1
- Total = 8.5
- Max weight = 11
- Final score = 77%
- Grade = `critical_fail` because Q1 is below 6

This shows why critical-failure state must remain separate from percentage.

## Implementation Rules

1. Do not maintain separate scoring formulas for report pages, submission handlers, and dashboard cards.
2. Centralize all scoring in one file, for example `src/lib/scoring.ts`.
3. Submission code must call the central scorer and store its output.
4. Report pages must prefer stored score fields from the latest scoring version.
5. If stored fields are absent, report pages may recalculate using the same central scorer as a fallback.
6. Store `scoringVersion` to support future migrations.

## Required Function Contract

Suggested contract:

```ts
export type QuestionType = 'yes_no' | 'rating_10';
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
  finalScore: number;
  grade: 'excellent' | 'good' | 'needs_improvement' | 'fail' | 'critical_fail';
  hasCriticalFailure: boolean;
  criticalFailureCount: number;
  scoringVersion: string;
  trace: ScoreTraceItem[];
}

export function calculateAuditScore(
  questions: ScoreInputQuestion[]
): AuditScoreResult;
```

## Validation Rules

The scorer must reject or safely handle:
- Missing severity
- Missing question type
- Rating values outside 0 to 10
- Null answers
- Unknown answer shapes

Recommended behavior:
- Null or invalid answers should score 0
- Invalid rating values should be clamped or rejected explicitly
- Unknown severity should default to low only if the product team explicitly approves that fallback

## UI Recommendations

The report page should show:
- Final weighted score
- Grade badge
- Critical failure banner if applicable
- Per-question critical-fail markers
- Optional expandable “How this score was calculated” panel using trace data

## Migration Recommendation

For historical audits:
- Do not silently overwrite old scores
- Either preserve legacy scores with their old `scoringVersion`, or run a one-time migration explicitly
- Make the scoring version visible internally for debugging/admin use

## Non-Negotiable Requirement

For any single audit instance, the following must all come from the same scoring pass:
- Banner state
- Grade badge
- Final percentage
- Stored Firestore fields
- Export/PDF values

If any one of these is computed from a different formula or stale field, the UI will become mathematically inconsistent.