"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is audit management software?",
    a: "Audit management software is a platform for creating, executing, tracking, and analysing audits across locations. It replaces paper checklists and Excel sheets with digital workflows that enforce evidence collection, auto-calculate weighted scores, trigger corrective actions, and generate ready-to-share reports.",
  },
  {
    q: "Do my auditors need to download an app?",
    a: "No. Audiment is a web app optimised for mobile browsers. Open the link, log in, and start auditing. No app store needed.",
  },
  {
    q: "What happens if the auditor doesn't have internet during an audit?",
    a: "They can complete the entire audit offline. All data – including photos and videos – syncs automatically once they're back online.",
  },
  {
    q: "Can managers see surprise audits before the auditor arrives?",
    a: "No. Surprise audits are invisible on the manager's dashboard until the auditor begins the inspection. Managers cannot prepare in advance.",
  },
  {
    q: "How does Audiment ensure auditors actually visit the location?",
    a: "Audiment uses Flash Verification – a mandatory 20-second live video recorded inside the app – combined with GPS geo-tagging. If the auditor is more than 50 metres from the registered branch location, the audit is flagged with a Location Mismatch warning. A selfie is also captured simultaneously to prevent proxy auditing.",
  },
  {
    q: "Can I customise the audit templates?",
    a: "Yes. Admins create templates from scratch using the Blueprint builder. Set your own questions, choose severity levels (Low, Medium, Critical), require photos or videos on specific questions, and set recurrence schedules.",
  },
  {
    q: "Does Audiment support FSSAI compliance?",
    a: "Yes. Audiment includes FSSAI-ready audit templates that can be loaded instantly. All audit records – with photos, GPS, timestamps, and corrective action history – are stored permanently for regulatory review.",
  },
  {
    q: "How is Audiment different from iAuditor or generic tools?",
    a: "Unlike generic tools, Audiment enforces mandatory photo evidence per question (not optional), includes Flash Verification with live geo-tagged video to confirm auditor presence, automatically creates corrective actions with a 48-hour SLA, detects declining trends across the last 3 audits and escalates, and ships with FSSAI-ready templates out of the box.",
  },
  {
    q: "Who can see what?",
    a: "Admins see all locations and all data. Managers see only their assigned locations. Auditors see only the audits assigned to them. Access is enforced at the server level – not just the UI.",
  },
  {
    q: "What happens when an audit score is low?",
    a: "Critical failures auto-escalate immediately and corrective actions are created. The system also monitors trends – if a location's score drops 10% or more across the last 3 consecutive audits, a tiered alert is sent to the branch manager, then the regional manager, then directly to the owner.",
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
