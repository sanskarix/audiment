import React from "react";
import Script from "next/script";
import { Metadata } from "next";
import AudimentLandingClient from "@/components/home/AudimentLandingClient";

export const metadata: Metadata = {
  title: { absolute: 'Multi-Location Audit & Inspection Software | Audiment' },
  description: 'Run audits across every location with proof, tracking, and corrective actions. Audiment is audit management software built for multi-location businesses.',
  keywords: ['audit and inspection software', 'multi-location audit software', 'proof-based audits', 'quality consistency', 'operational consistency', 'corrective action tracking', 'FSSAI audit software', 'field audit app India'],
  alternates: { canonical: 'https://audiment.in' },
  openGraph: {
    title: 'Multi-Location Audit & Inspection Software | Audiment',
    description: 'Run audits across every location with proof, tracking, and corrective actions. Audiment is audit management software built for multi-location businesses.',
    url: 'https://audiment.in',
    siteName: 'Audiment',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multi-Location Audit & Inspection Software | Audiment',
    description: 'Run audits across every location with proof, tracking, and corrective actions. Audiment is audit management software built for multi-location businesses.',
  },
};

function StructuredData() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://audiment.in/#software",
        "name": "Audiment",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Mobile",
        "description": "Audiment is audit management software for multi-location businesses. Run proof-based audits across locations with photo evidence, corrective action tracking, and accountability.",
        "keywords": "multi-location audit software, inspection software, proof-based audits, quality consistency, operational consistency, corrective action tracking",
        "publisher": {
          "@id": "https://audiment.in/#organization"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://audiment.in/#faq",
        "isPartOf": {
          "@id": "https://audiment.in/#website"
        },
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is audit management software?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Software that replaces paper checklists with digital audits. You create templates, assign them to locations, and track results with photo evidence, scoring, and automatic follow-up tasks."
            }
          },
          {
            "@type": "Question",
            "name": "Do my auditors need to download an app?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Audiment runs in the browser. Open the link, log in, start auditing. Works on any phone."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if the auditor doesn't have internet?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Audits keep running offline. Everything syncs automatically when the connection is back."
            }
          },
          {
            "@type": "Question",
            "name": "Can managers see surprise audits before the auditor arrives?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Surprise audits stay hidden on the manager’s dashboard until the auditor starts the inspection."
            }
          },
          {
            "@type": "Question",
            "name": "How does Audiment verify that the auditor was on-site?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The auditor records a short geo-tagged video and selfie at the location. If they’re outside the registered GPS range, the system flags it."
            }
          },
          {
            "@type": "Question",
            "name": "Can I customise the audit templates?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Build your own templates from scratch – questions, severity levels, photo requirements, and how often they repeat."
            }
          },
          {
            "@type": "Question",
            "name": "Does Audiment support FSSAI compliance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Load a pre-built FSSAI template and start auditing immediately. All records – photos, GPS data, timestamps, corrective actions – are stored for regulatory review."
            }
          },
          {
            "@type": "Question",
            "name": "How is Audiment different from iAuditor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "iAuditor is a general-purpose inspection tool. Audiment is built for multi-location businesses where accountability matters. Photo evidence is mandatory, auditor presence is GPS-verified, corrective actions auto-generate with deadlines, and declining trends are flagged automatically."
            }
          },
          {
            "@type": "Question",
            "name": "Who can see what?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Admins see all locations. Managers see only their assigned branches, and auditors see only their assigned audits. Access controls are enforced at the server level."
            }
          },
          {
            "@type": "Question",
            "name": "What happens when an audit score is low?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Critical failures trigger corrective action tasks immediately. If a location’s score keeps dropping across consecutive audits, alerts escalate to regional management and then leadership."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "@id": "https://audiment.in/#howto",
        "name": "How to digitize and manage audits with Audiment",
        "description": "How Audiment handles an audit from start to finish – scheduling, on-site execution, evidence capture, issue detection, corrective actions, and reporting.",
        "isPartOf": {
          "@id": "https://audiment.in/#website"
        },
        "publisher": {
          "@id": "https://audiment.in/#organization"
        },
        "step": [
          {
            "@type": "HowToStep",
            "name": "Schedule & assign",
            "text": "HQ pushes a checklist to any location. Branch managers get notified instantly.",
            "url": "https://audiment.in#how-it-works"
          },
          {
            "@type": "HowToStep",
            "name": "Audit on-site",
            "text": "The auditor walks the floor and completes the checklist on their phone – even offline.",
            "url": "https://audiment.in#how-it-works"
          },
          {
            "@type": "HowToStep",
            "name": "Capture proof",
            "text": "Critical questions require photos taken on-site, geo-tagged and timestamped automatically.",
            "url": "https://audiment.in#how-it-works"
          },
          {
            "@type": "HowToStep",
            "name": "Flag issues",
            "text": "When a standard fails – like a missed temperature log – the system flags it immediately.",
            "url": "https://audiment.in#how-it-works"
          },
          {
            "@type": "HowToStep",
            "name": "Assign the fix",
            "text": "A corrective action task is auto-created with a deadline and assigned to the branch manager.",
            "url": "https://audiment.in#how-it-works"
          },
          {
            "@type": "HowToStep",
            "name": "Resolve & report",
            "text": "The manager uploads proof of the fix. HQ sees resolution times and trends across every region.",
            "url": "https://audiment.in#how-it-works"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "Audiment Platform"
          }
        ]
      }
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <AudimentLandingClient />
    </>
  );
}
