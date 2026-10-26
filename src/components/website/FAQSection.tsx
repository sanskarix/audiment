import React from 'react';

export interface FAQItem {
  question?: string;
  q?: string;
  answer?: string;
  a?: string;
}

export interface FAQSectionProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  faqs: FAQItem[];
  id?: string;
  anchorId?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  title = (
    <>
      Frequently asked
      <br />
      questions.
    </>
  ),
  subtitle = (
    <>
      Clear, honest answers
      <br />
      about how Audiment works.
    </>
  ),
  faqs,
  id = 'faq',
  anchorId,
  className = '',
  style,
}) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <>
      {anchorId && (
        <span
          id={anchorId}
          style={{
            position: 'relative',
            top: '-100px',
            display: 'block',
            visibility: 'hidden',
            height: 0,
            margin: 0,
            padding: 0,
          }}
        />
      )}
      <section className={`faq ${className}`.trim()} id={id} style={style}>
        <div className="faq-left">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="accordions">
          {faqs.map((item, i) => {
            const questionText = item.question || item.q || '';
            const answerText = item.answer || item.a || '';
            return (
              <details key={i}>
                <summary>
                  <span>{questionText}</span>
                  <span className="faq-icon">+</span>
                </summary>
                <p>{answerText}</p>
              </details>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default FAQSection;

