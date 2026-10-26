import React from 'react';

interface WorkflowStep {
  stepNumber: string;
  title: string;
  details: string[];
}

export function parseWorkflowText(rawText: string): { title: string; steps: WorkflowStep[] } {
  const lines = rawText.trim().split('\n');
  const steps: WorkflowStep[] = [];
  let currentStep: { title: string; details: string[]; isBracketed?: boolean } | null = null;
  let seenTransition = false;
  let diagramTitle = 'Workflow Architecture';

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // Check if line contains no alphanumeric characters (pure connector/arrow/box border)
    if (!/[A-Za-z0-9]/.test(line)) {
      if (/[▼v><]|-->|->/.test(line)) {
        seenTransition = true;
      }
      continue;
    }

    // Check if branch sub-item (e.g. ├── Real-Time ... or - item)
    const isSub = /^[\s│|]*(?:[├└]─+|[•\-\*])\s*/.test(raw);

    // Strip box characters and leading/trailing pipes/dashes
    const clean = line
      .replace(/^[│|┌└├┐┘─\-+*#\s▼v^><]+/, '')
      .replace(/[│|┌└├┐┘─\-+*#\s▼v^><]+$/, '')
      .trim();

    if (!clean) continue;

    // Check for diagram title at top
    if (steps.length === 0 && !currentStep) {
      if (
        clean.endsWith(':') ||
        clean.startsWith('#') ||
        ['Architecture', 'Flow', 'Cycle', 'Pipeline', 'Framework', 'Drift'].some((k) =>
          clean.endsWith(' ' + k)
        )
      ) {
        diagramTitle = clean.replace(/[:#]/g, '').trim();
        continue;
      }
    }

    const isBracketed = /^\[.+\]$/.test(clean);
    const isStage =
      isBracketed ||
      /^\[?(?:Stage|Gate|Step|Phase|Cycle|Level|Audit|Module)\s*[\d\w]+/i.test(clean);

    if (isStage || seenTransition || !currentStep) {
      if (currentStep) {
        steps.push({
          stepNumber: String(steps.length + 1).padStart(2, '0'),
          title: currentStep.title,
          details: currentStep.details,
        });
      }
      currentStep = {
        title: clean.replace(/^\[|\]$/g, '').trim(),
        details: [],
        isBracketed: isBracketed || isStage,
      };
      seenTransition = false;
    } else if (isSub) {
      currentStep.details.push(clean.replace(/^[-*•]\s*/, ''));
    } else {
      if (currentStep.isBracketed && currentStep.details.length === 0) {
        currentStep.details.push(clean.replace(/^[-*•]\s*/, ''));
      } else {
        steps.push({
          stepNumber: String(steps.length + 1).padStart(2, '0'),
          title: currentStep.title,
          details: currentStep.details,
        });
        currentStep = {
          title: clean.replace(/^\[|\]$/g, '').trim(),
          details: [],
          isBracketed: false,
        };
      }
    }
  }

  if (currentStep) {
    steps.push({
      stepNumber: String(steps.length + 1).padStart(2, '0'),
      title: currentStep.title,
      details: currentStep.details,
    });
  }

  return { title: diagramTitle, steps };
}

export const WorkflowIllustration: React.FC<{ rawText: string }> = ({ rawText }) => {
  const { title, steps } = parseWorkflowText(rawText);

  if (steps.length === 0) {
    return (
      <div className="aud-illustration-card not-prose">
        <div className="aud-illustration-header">
          <div className="aud-illustration-badge-wrap">
            <span className="aud-illustration-dot" />
            <span className="aud-illustration-badge">Workflow Architecture</span>
          </div>
        </div>
        <div className="aud-illustration-body">
          <p className="aud-workflow-fallback">{rawText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aud-workflow-card not-prose" role="region" aria-label={title}>
      <div className="aud-workflow-header">
        <div className="aud-workflow-header-left">
          <span className="aud-workflow-dot" />
          <span className="aud-workflow-badge">Workflow Architecture</span>
        </div>
        <span className="aud-workflow-title">{title}</span>
      </div>

      <div className="aud-workflow-body">
        <ol className="aud-workflow-step-list">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <li key={idx} className="aud-workflow-step-item">
                <div className="aud-workflow-node-row">
                  <div className="aud-workflow-step-num" aria-hidden="true">
                    {step.stepNumber}
                  </div>
                  <div className="aud-workflow-node-card">
                    <div className="aud-workflow-step-title">{step.title}</div>
                    {step.details.length > 0 && (
                      <ul className="aud-workflow-details-list">
                        {step.details.map((detail, dIdx) => (
                          <li key={dIdx} className="aud-workflow-detail-item">
                            <span className="aud-workflow-detail-bullet" aria-hidden="true" />
                            <span className="aud-workflow-detail-text">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div className="aud-workflow-connector-wrap" aria-hidden="true">
                    <div className="aud-workflow-connector-line" />
                    <svg
                      className="aud-workflow-connector-arrow"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
