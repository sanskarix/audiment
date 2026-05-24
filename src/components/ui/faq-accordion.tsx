"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is audit management software?",
    a: "Software that replaces paper checklists with digital audits. You create templates, assign them to locations, and track results – with photo evidence, scoring, and automatic follow-up tasks.",
  },
  {
    q: "Do my auditors need to download an app?",
    a: "No. Audiment runs in the browser – open the link, log in, start auditing. Works on any phone.",
  },
  {
    q: "What happens if the auditor doesn't have internet?",
    a: "Audits keep running offline. Everything syncs automatically when the connection is back.",
  },
  {
    q: "Can managers see surprise audits before the auditor arrives?",
    a: "No. Surprise audits stay hidden on the manager’s dashboard until the auditor starts the inspection.",
  },
  {
    q: "How does Audiment verify that the auditor was on-site?",
    a: "The auditor records a short geo-tagged video and selfie at the location. If they’re outside the registered GPS range, the system flags it.",
  },
  {
    q: "Can I customise the audit templates?",
    a: "Yes. Build your own templates from scratch – questions, severity levels, photo requirements, and how often they repeat.",
  },
  {
    q: "Does Audiment support FSSAI compliance?",
    a: "Yes. You can load a pre-built FSSAI template and start auditing immediately. All records, including photos, GPS data, timestamps, and corrective actions, are stored for regulatory review.",
  },
  {
    q: "How is Audiment different from iAuditor?",
    a: "iAuditor is a general-purpose inspection tool. Audiment is built specifically for multi-location businesses where accountability is critical. We ensure photo evidence is mandatory, auditor presence is GPS-verified, and corrective actions are automatically generated with deadlines.",
  },
  {
    q: "Who can see what?",
    a: "Admins see all locations. Managers see only their assigned branches, and auditors see only their assigned audits. Access controls are enforced at the server level.",
  },
  {
    q: "What happens when an audit score is low?",
    a: "Critical failures trigger corrective action tasks immediately. If a location’s score keeps dropping across consecutive audits, alerts escalate to regional management and then leadership.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: open ? "#fafafa" : "#fff" }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-lg font-semibold text-neutral-900">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-neutral-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-neutral-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FAQAccordion() {
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <FAQItem key={i} q={faq.q} a={faq.a} />
      ))}
    </div>
  );
}
