"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is audit management software?",
    a: "Software for creating, running, and tracking audits across locations. It replaces paper checklists with digital workflows that collect evidence, score results, trigger follow-up tasks, and generate reports.",
  },
  {
    q: "Do my auditors need to download an app?",
    a: "No. Audiment runs in the browser. Open the link, log in, start auditing. Works on any phone.",
  },
  {
    q: "What happens if the auditor doesn't have internet?",
    a: "Audits continue offline and sync automatically once the device reconnects.",
  },
  {
    q: "Can managers see surprise audits before the auditor arrives?",
    a: "No. Surprise audits stay hidden on the manager's dashboard until the auditor begins the inspection.",
  },
  {
    q: "How does Audiment verify that the auditor was on-site?",
    a: "A short geo-tagged video and selfie are captured at the location. If the auditor is outside the registered location's GPS range, the system flags it.",
  },
  {
    q: "Can I customise the audit templates?",
    a: "Yes. Build templates from scratch – set your own questions, severity levels, photo requirements, and recurrence schedules.",
  },
  {
    q: "Does Audiment support FSSAI compliance?",
    a: "Yes. Pre-built FSSAI templates can be loaded instantly. All records – photos, GPS data, timestamps, corrective action history – are stored for regulatory review.",
  },
  {
    q: "How is Audiment different from iAuditor?",
    a: "Audiment is built specifically for multi-location operations where accountability matters. Photo evidence is required (not optional), auditor presence is verified, corrective actions auto-generate with deadlines, and the system flags declining trends across locations.",
  },
  {
    q: "Who can see what?",
    a: "Admins see all locations. Managers see only their assigned branches. Auditors see only their assigned audits. Access is enforced at the server level.",
  },
  {
    q: "What happens when an audit score is low?",
    a: "Critical failures create corrective action tasks immediately. If a location's score drops across consecutive audits, alerts escalate to regional management and then leadership.",
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
