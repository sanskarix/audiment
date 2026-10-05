# Mathematical Scoring Engine Specification

> **Implementation Module:** `src/lib/scoring.ts`

This document defines the mathematical scoring rules used across Audiment to compute weighted percentages, grade thresholds, critical failure logic, and per-question trace diagnostics.

---

## 🧮 1. Normalization Step

Each question response $N_i$ is converted into a normalized score bounded between $0.0$ and $1.0$:

### Yes/No Questions (`yes_no`)
$$N_i = \begin{cases} 1.0 & \text{if answer = "Yes"} \\ 0.0 & \text{if answer = "No"} \end{cases}$$

### Rating Questions (`rating_10`)
$$N_i = \frac{\text{Rating Value}}{10}$$

---

## ⚖️ 2. Fixed Severity Weights

Question weights $W_i$ reflect operational impact:

| Severity Level | Weight ($W_i$) | Rationale |
| :--- | :---: | :--- |
| `low` | **1** | Baseline operational criteria (minor presentation, routine logs). |
| `medium` | **2** | Moderate operational standards (cleaning routines, stock rotation). |
| `critical` | **5** | High leverage criteria (food temperature, hygiene licensing, safety breaches). |

---

## 📊 3. Final Weighted Percentage Score

The total percentage score $S \in [0, 100]$ is calculated as:

$$S = \left( \frac{\sum_{i=1}^{n} (N_i \times W_i)}{\sum_{i=1}^{n} W_i} \right) \times 100$$

---

## 🚨 4. Critical Failure Logic

Independent of the percentage score $S$, every response is evaluated for critical failure state $C_i \in \{\text{true}, \text{false}\}$:

$$C_i = \begin{cases} \text{true} & \text{if severity = "critical" AND questionType = "yes_no" AND answer = "No"} \\ \text{true} & \text{if severity = "critical" AND questionType = "rating_10" AND rating } < 6 \\ \text{false} & \text{otherwise} \end{cases}$$

If any question yields $C_i = \text{true}$, the entire audit receives:
* `hasCriticalFailure = true`
* `criticalFailureCount = count(C_i == true)`

---

## 🏷️ 5. Grade Determination

Grades are assigned based on score $S$ and critical failure presence:

$$\text{Grade} = \begin{cases} 
\text{critical\_fail} & \text{if } \text{hasCriticalFailure} = \text{true} \\
\text{excellent} & \text{if } S \ge 90 \\
\text{good} & \text{if } 75 \le S < 90 \\
\text{needs\_improvement} & \text{if } 60 \le S < 75 \\
\text{fail} & \text{if } S < 60
\end{cases}$$

> **Important Rule:** `critical_fail` **always overrides** percentage-based grades. An audit scoring 92% overall will receive a `critical_fail` grade if a single critical food safety question fails.

---

## 🔬 6. TypeScript Function Contract (`src/lib/scoring.ts`)

```typescript
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
  finalScore: number;            // Rounded percentage integer
  grade: 'excellent' | 'good' | 'needs_improvement' | 'fail' | 'critical_fail';
  hasCriticalFailure: boolean;
  criticalFailureCount: number;
  scoringVersion: string;        // e.g. "v2-weighted-critical-threshold-6"
  trace: ScoreTraceItem[];
}

export function calculateAuditScore(questions: ScoreInputQuestion[]): AuditScoreResult;
```
