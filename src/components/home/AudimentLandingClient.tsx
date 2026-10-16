'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Footer } from '@/components/website/Footer';
import { Header } from '@/components/website/Header';
import { IconHover3D } from '@/components/website/icon-3d-hover';
import { LogosSection } from '@/components/website/LogosSection';
import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';
import { initCalEmbed, getCalAttributes } from '@/lib/cal';

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const SVG: React.FC<{ d: string | string[]; size?: number; className?: string }> = ({ d, size = 18, className }) => {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
};

const I = {
  mapPin: ['M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0', 'M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
  fileText: ['M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z', 'M14 2v5a1 1 0 0 0 1 1h5', 'M10 9H8', 'M16 13H8', 'M16 17H8'],
  shield: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
  camera: ['M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z', 'M12 13m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
  refreshCw: ['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16', 'M8 16H3v5'],
  crown: ['M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z', 'M5 21h14'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M16 3.128a4 4 0 0 1 0 7.744', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0'],
  clipboardList: ['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M8 2h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z', 'M12 11h4', 'M12 16h4', 'M8 11h.01', 'M8 16h.01'],
  smartphone: ['M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M12 18h.01'],
  wifi: ['M12 20h.01', 'M2 8.82a15 15 0 0 1 20 0', 'M5 12.859a10 10 0 0 1 14 0', 'M8.5 16.429a5 5 0 0 1 7 0'],
  zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  arrowRight: ['M5 12h14', 'M12 5l7 7-7 7'],
  check: 'M20 6 9 17l-5-5',
  x: ['M18 6 6 18', 'm6 6 12 12'],
  alertTriangle: ['m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3', 'M12 9v4', 'M12 17h.01'],
  eye: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z', 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
  video: ['M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.894L15 14', 'M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z'],
  layoutTemplate: ['M3 3h18v7H3z', 'M3 14h8v7H3z', 'M15 14h6v7h-6z'],
  fileCheck2: ['M4 2v20l8-4 8 4V2', 'M12 2v10', 'm8 9 4 4 4-4'],
  trendingDown: ['M22 17L13.5 8.5 8.5 13.5 2 7', 'M16 17h6v-6'],
  utensils: ['m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8', 'M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15zm0 0 7 7', 'm2.1 21.8 6.4-6.3', 'm19 5-7 7'],
  shoppingBag: ['M16 10a4 4 0 0 1-8 0', 'M3.103 6.034h17.794', 'M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z'],
  building2: ['M10 12h4', 'M10 8h4', 'M14 21v-3a2 2 0 0 0-4 0v3', 'M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0-2-2h-2', 'M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16'],
  settings: ['M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915', 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'],
  heart: 'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5',
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z',
  star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
};

// ─── Animation helpers ─────────────────────────────────────────────────────────

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
  },
};

const stagger = (delay = 0.08): any => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay } },
});

const InView: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  amount?: number;
  immediate?: boolean;
  variants?: object;
}> = ({ children, className, style, amount = 0.08, immediate = false, variants }) => (
  <motion.div
    initial="hidden"
    animate={immediate ? 'visible' : undefined}
    whileInView={immediate ? undefined : 'visible'}
    viewport={{ once: true, amount }}
    variants={variants ?? fadeUp}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

// ─── Dot-border button (Global Asellus system) ───────────────────────────────

const DotBtn: React.FC<{
  label: React.ReactNode;
  variant?: 'default' | 'orange' | 'dark';
  href?: string;
  calAttrs?: Record<string, string>;
  id?: string;
}> = ({ label, variant = 'default', href, calAttrs, id }) => {
  const wrapClass = `btn-wrapper${variant === 'orange' ? ' btn-wrapper--orange' : variant === 'dark' ? ' btn-wrapper--dark' : ''}`;
  const btnClass = `button${variant === 'orange' ? ' button--orange' : ''}`;
  const inner = (
    <>
      <span className="dot top left" />
      <span className="dot top right" />
      <span className="dot bottom left" />
      <span className="dot bottom right" />
      <span className="line horizontal top" />
      <span className="line horizontal bottom" />
      <span className="line vertical left" />
      <span className="line vertical right" />
    </>
  );
  if (calAttrs) {
    return (
      <div className={wrapClass}>
        {inner}
        <a className={btnClass} href="javascript:void(0);" id={id} {...calAttrs}>{label}</a>
      </div>
    );
  }
  return (
    <div className={wrapClass}>
      {inner}
      <a className={btnClass} href={href ?? '#'} id={id}>{label}</a>
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Schedule & assign',
    question: 'HQ pushes a checklist to any location. Branch managers get notified instantly.',
    solution: 'Set recurring inspection blueprints or trigger unannounced surprise audits. Instant alerts notify branch staff when a new checklist goes live.',
    features: ['Instant Dispatch', 'Recurring Schedules', 'Surprise Audits'],
  },
  {
    num: '02',
    title: 'Audit on-site',
    question: 'The auditor walks the floor and completes the checklist on their phone – even offline.',
    solution: 'Auditors open the link in any mobile browser without downloading an app. Responses save locally and automatically sync once back online.',
    features: ['Works Offline', 'No App Download', 'Mobile Web App'],
  },
  {
    num: '03',
    title: 'Capture proof',
    question: 'Critical questions require photos taken on-site, geo-tagged and timestamped automatically.',
    solution: 'Mandatory photo and video proof prevent pencil-whipping. Built-in GPS checks confirm the auditor was physically present at the branch.',
    features: ['GPS-Verified', 'Auto Timestamps', 'Mandatory Photos'],
  },
  {
    num: '04',
    title: 'Flag issues',
    question: 'When a standard fails – like a missed temperature log – the system flags it immediately.',
    solution: 'Failed items instantly calculate weighted inspection scores and trigger low-threshold alerts directly to regional leadership.',
    features: ['Instant Alerts', 'Scoring Weights', 'Trend Detection'],
  },
  {
    num: '05',
    title: 'Assign the fix',
    question: 'A corrective action task is auto-created with a deadline and assigned to the branch manager.',
    solution: 'Critical failures convert directly into trackable resolution tickets with strict 48-hour SLAs assigned to the location manager.',
    features: ['Auto Tasks', '48-hour SLAs', 'Branch Ownership'],
  },
  {
    num: '06',
    title: 'Resolve & report',
    question: 'The manager uploads proof of the fix. HQ sees resolution times and trends across every region.',
    solution: 'Managers submit photographic evidence of the fix before tasks can close. HQ exports comprehensive PDF compliance reports in one click.',
    features: ['Photo Proof of Fix', 'Audit Trail', 'One-Click PDFs'],
  },
];

const features = [
  {
    iconKey: 'camera' as const,
    category: 'Evidence',
    title: 'Photo and video evidence on every audit',
    heading: 'Evidence that shows real conditions.',
    description: 'Mark any audit question as evidence-required. Auditors capture live photos or video on-site before they can move on. You see exactly what your branches look like – not what someone says they look like.',
    imageUrl: '/images/photoevidence.jpeg',
  },
  {
    iconKey: 'alertTriangle' as const,
    category: 'Corrective Actions',
    title: 'Automated corrective action tracking',
    heading: 'Failed items become assigned tasks – instantly.',
    description: 'Critical failures automatically generate assigned resolution tasks with 48-hour SLAs, mandatory notes, and photo proof of resolution.',
    imageUrl: '/images/action.jpeg',
  },
  {
    iconKey: 'trendingDown' as const,
    category: 'Alerts',
    title: 'Instant low-score and trend alerts',
    heading: 'Catch declining branches before they become a problem.',
    description: 'Automatic alerts when a branch scores below threshold. Trend detection flags locations that score poorly on three consecutive audits.',
    imageUrl: '/images/lowscore.jpeg',
  },
  {
    iconKey: 'video' as const,
    category: 'Verification',
    title: 'Verified auditor presence',
    heading: 'Verified presence at every audit.',
    description: 'Auditors record a short geo-tagged video and selfie from the location. This confirms they were on-site when the audit was completed.',
    imageUrl: '/images/flash.jpeg',
  },
  {
    iconKey: 'layoutTemplate' as const,
    category: 'Templates',
    title: 'Standardized audit blueprints',
    heading: 'Build once. Deploy to every location.',
    description: 'Build reusable audit templates with custom questions, scoring weights, and severity levels. Share blueprints across your entire organization.',
    imageUrl: '/images/templates.jpeg',
  },
  {
    iconKey: 'fileCheck2' as const,
    category: 'Compliance',
    title: 'FSSAI-ready compliance templates',
    heading: 'Pass your next inspection on the first attempt.',
    description: 'Pre-built FSSAI hygiene and safety audit templates load with one click. Purpose-built for food businesses under Indian compliance standards.',
    imageUrl: '/images/compliance.jpeg',
  },
  {
    iconKey: 'fileText' as const,
    category: 'Reporting',
    title: 'One-click compliance reports',
    heading: 'Reports that tell you what actually happened.',
    description: 'Export inspection records with photo evidence, scores, and corrective action histories. Audit trails are permanently stored and ready for regulators.',
    imageUrl: '/images/reports.jpeg',
  },
];

const useCases = [
  { iconKey: 'utensils' as const, title: 'QSR & Restaurant Chains', desc: 'Daily hygiene and food safety line-checks across every outlet. Consistent standards whether you operate 5 or 50 branches.', linkText: 'Explore QSR workflows', href: '/use-cases/multi-location-compliance' },
  { iconKey: 'shoppingBag' as const, title: 'Retail Chains', desc: 'Merchandising, display, and store presentation audits. Area managers see which branches fall behind.', linkText: 'Explore retail compliance', href: '/use-cases/multi-location-compliance' },
  { iconKey: 'building2' as const, title: 'Hotels & Hospitality', desc: 'Housekeeping, F&B safety, and guest experience inspections. Maintenance issues turn into automatic fix tasks.', linkText: 'Explore hospitality audits', href: '/use-cases/multi-location-compliance' },
  { iconKey: 'settings' as const, title: 'Facility Management', desc: 'Managed property audits with photo evidence at every step. Track maintenance from discovery to sign-off.', linkText: 'Explore facility checks', href: '/use-cases/multi-location-compliance' },
  { iconKey: 'heart' as const, title: 'Healthcare Clinics', desc: 'Hygiene and infection control checklists. Stored, timestamped records ready whenever regulators visit.', linkText: 'Explore clinic compliance', href: '/use-cases/multi-location-compliance' },
  { iconKey: 'wrench' as const, title: 'Manufacturing & Plants', desc: 'Safety walks, equipment checks, and quality inspections. Verified proof that every standard was met on every shift.', linkText: 'Explore plant safety', href: '/use-cases/multi-location-compliance' },
];

const comparisonRows = [
  {
    capability: 'Mandatory photo evidence',
    paper: { sym: '—', label: 'None', red: true },
    generic: { sym: '⚠️', label: 'Optional', amber: true },
    audiment: { sym: '✓', label: 'Required per question' },
  },
  {
    capability: 'Geo-tagged verification',
    paper: { sym: '—', label: 'None', red: true },
    generic: { sym: '—', label: 'None', red: true },
    audiment: { sym: '✓', label: 'GPS-verified' },
  },
  {
    capability: 'Auto corrective actions',
    paper: { sym: '—', label: 'None', red: true },
    generic: { sym: '—', label: 'None', red: true },
    audiment: { sym: '✓', label: '48-hour SLA' },
  },
  {
    capability: 'Trend detection & alerts',
    paper: { sym: '—', label: 'None', red: true },
    generic: { sym: '—', label: 'None', red: true },
    audiment: { sym: '✓', label: '3-audit pattern alerts' },
  },
  {
    capability: 'FSSAI-ready templates',
    paper: { sym: '—', label: 'None', red: true },
    generic: { sym: '—', label: 'None', red: true },
    audiment: { sym: '✓', label: 'One-click load' },
  },
  {
    capability: 'PDF compliance reports',
    paper: { sym: '—', label: 'None', red: true },
    generic: { sym: '⚠️', label: 'Basic export', amber: true },
    audiment: { sym: '✓', label: 'High-fidelity export' },
  },
];

const testimonials = [
  {
    text: "Before Audiment, audits took two weeks to reach my desk. Now I see results before the auditor leaves the branch.",
    name: 'Rajesh S.',
    role: 'Head of Operations, Chai Point',
  },
  {
    text: 'The mandatory photo evidence stopped people from pencil-whipping checklists. Our audit quality went from 60% to 95% in the first quarter.',
    name: 'Meera R.',
    role: 'Quality & Compliance Lead, Blue Tokai',
  },
  {
    text: 'When FSSAI comes in, we used to scramble for binders. Now we pull up six months of timestamped records in thirty seconds.',
    name: 'Anil P.',
    role: 'Fleet Operations Head, VRL Logistics',
  },
  {
    text: "We rolled out Audiment to all our franchise locations in under a month. It's given us verified visibility into food safety and cleanliness, ensuring a consistent customer experience across the network.",
    name: 'Sneha K.',
    role: 'VP of Operations, Tom & Chee',
  },
  {
    text: 'Housekeeping and maintenance audits are no longer just a checkbox exercise. We can see real-time conditions of our rooms and facilities right from the dashboard.',
    name: 'Pooja V.',
    role: 'Operations Manager, Best Western Plus',
  },
  {
    text: "The offline capability is a lifesaver. Our auditors can inspect remote villas where Wi-Fi is spotty, and everything syncs up perfectly once they're back in range.",
    name: 'Priya N.',
    role: 'Quality Assurance Lead, Ayatana Resorts',
  },
  {
    text: 'The 48-hour SLA for critical issues changed everything. If a warehouse fails a safety inspection, the facility manager has to fix it and upload photo proof.',
    name: 'Vivek D.',
    role: 'Supply Chain Director, VRL Logistics',
  },
  {
    text: 'No more guesswork. The mandatory photo evidence ensures our teams are actually verifying temperatures and prep stations, not just signing off from memory.',
    name: 'Aditya M.',
    role: 'Food Safety Manager, Tom & Chee',
  },
  {
    text: 'Standardized audit scoring stopped subjective interpretations across regions. Now our executives see true benchmarked operational performance.',
    name: 'Vikram R.',
    role: 'COO, Nexus Retail Group',
  },
];

const scenarios = [
  { industry: 'QSR chain – 30 outlets', headline: 'Issue resolution went from 5 days to 48 hours', story: 'Corrective actions used to live in WhatsApp groups. Nobody owned the fix, so most took 3–5 days. With auto-assigned tasks and SLA deadlines, critical issues now close within 48 hours.' },
  { industry: 'Retail chain – 45 stores', headline: 'No more skipped or backdated audits', story: 'Paper audits were routinely skipped or filled in hours late. With digital scheduling and required photo evidence, area managers see exactly which stores completed their checks. Audit completion went from inconsistent to reliable.' },
  { industry: 'Hotel group – 6 properties', headline: 'Health inspector arrived. Records ready in under a minute.', story: 'Daily FSSAI checklists replaced the old monthly paper audit. When an inspector visited, the team pulled up 90 days of timestamped, photo-backed records in under a minute. No scrambling, no missing documents.' },
];

const audProblemCards = [
  {
    id: 'whatsapp',
    heading: 'Reports lost in WhatsApp',
    text: 'Audit photos scattered across group chats. No way to verify when or where they were taken.',
    linkLabel: 'Explore photo evidence',
    link: '#features',
  },
  {
    id: 'managers',
    heading: 'Managers hide the real picture',
    text: 'Area managers score generously or skip over problems. You find out through customer complaints, not your own data.',
    linkLabel: 'Explore verified presence',
    link: '#features',
  },
  {
    id: 'resolution',
    heading: 'Issues found, never fixed',
    text: "Someone spots the problem. Without a system to track the fix, it's forgotten by the next shift.",
    linkLabel: 'Explore corrective actions',
    link: '#features',
  },
];

const AudProblemCard: React.FC<{ card: typeof audProblemCards[0] }> = ({ card }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      className="three-areas-card-wrapper"
      href={card.link}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
        },
      }}
    >
      <IconHover3D
        heading={card.heading}
        text={card.text}
        variant={isHovered ? 'Hover' : 'Default'}
        width="100%"
        height="100%"
      />
      <span className="service-link three-areas-link">
        {card.linkLabel}
      </span>
    </motion.a>
  );
};

const faqs = [
  { q: 'What is audit management software?', a: 'Software that replaces paper checklists with digital audits. You create templates, assign them to locations, and track results – with photo evidence, scoring, and automatic follow-up tasks.' },
  { q: 'Do my auditors need to download an app?', a: 'No. Audiment runs in the browser – open the link, log in, start auditing. Works on any phone.' },
  { q: "What happens if the auditor doesn't have internet?", a: 'Audits keep running offline. Everything syncs automatically when the connection is back.' },
  { q: 'Can managers see surprise audits before the auditor arrives?', a: "No. Surprise audits stay hidden on the manager's dashboard until the auditor starts the inspection." },
  { q: 'How does Audiment verify that the auditor was on-site?', a: "The auditor records a short geo-tagged video and selfie at the location. If they're outside the registered GPS range, the system flags it." },
  { q: 'Can I customise the audit templates?', a: 'Yes. Build your own templates from scratch – questions, severity levels, photo requirements, and how often they repeat.' },
  { q: 'Does Audiment support FSSAI compliance?', a: 'Yes. You can load a pre-built FSSAI template and start auditing immediately. All records, including photos, GPS data, timestamps, and corrective actions, are stored for regulatory review.' },
  { q: 'How is Audiment different from iAuditor?', a: 'iAuditor is a general-purpose inspection tool. Audiment is built specifically for multi-location businesses where accountability is critical. We ensure photo evidence is mandatory, auditor presence is GPS-verified, and corrective actions are automatically generated with deadlines.' },
  { q: 'Who can see what?', a: 'Admins see all locations. Managers see only their assigned branches, and auditors see only their assigned audits. Access controls are enforced at the server level.' },
  { q: 'What happens when an audit score is low?', a: "Critical failures trigger corrective action tasks immediately. If a location's score keeps dropping across consecutive audits, alerts escalate to regional management and then leadership." },
];

// ─── Sticky Features Section ("Everything you need to enforce standards") ──────

const STICKY_OFFSET = 88;
const STICKY_GAP = 10;
const getStickyTop = (i: number) => STICKY_OFFSET + i * STICKY_GAP;

const StickyFeaturesSection: React.FC = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stackDepths, setStackDepths] = useState<number[]>(new Array(features.length).fill(0));

  useEffect(() => {
    const handleScroll = () => {
      const isSticky = cardRefs.current.map((el, i) =>
        el ? el.getBoundingClientRect().top <= getStickyTop(i) + 4 : false
      );
      setStackDepths(features.map((_, i) => isSticky.slice(i + 1).filter(Boolean).length));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="features" className="aud-features-section">
      <div className="aud-inner">
        <InView>
          <div className="aud-head--center">
            <h2>
              Everything you need to<br />
              <span className="muted">enforce standards</span>
            </h2>
            <p style={{ marginTop: 14 }}>
              Built specifically for multi-branch businesses, every feature addresses a real gap
              in how inspections and accountability work today.
            </p>
          </div>
        </InView>

        <div className="aud-features-cards">
          {features.map((feature, index) => {
            const depth = stackDepths[index];
            const scale = Math.max(1 - depth * 0.015, 0.93);
            const shadowOpacity = Math.min(depth * 0.08, 0.18);

            return (
              <div
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="aud-feature-card"
                style={{
                  position: 'sticky',
                  top: getStickyTop(index),
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  boxShadow: depth > 0
                    ? `0 -8px 30px -8px rgba(0,0,0,${shadowOpacity.toFixed(3)}), 0 12px 32px -8px rgba(0,0,0,0.06)`
                    : '0 8px 28px -6px rgba(0,0,0,0.04)',
                  zIndex: index + 1,
                }}
              >
                <div className="aud-feature-card-copy">
                  <span className="aud-feature-category">{feature.category}</span>
                  <h3>{feature.title}</h3>
                  <p className="aud-feature-subhead">{feature.heading}</p>
                  <p className="aud-feature-desc">{feature.description}</p>
                </div>

                <div className="aud-feature-card-visual">
                  <div className="aud-feature-card-img-wrap">
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Operational Problems Showcase ─────────────────────────────────────────────

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as any,
    },
  },
};

const audProblemBlueprints: Record<string, {
  label: string;
  desc: string;
  steps: { num: string; title: string; desc: string }[];
  modules: string[];
}> = {
  foodSafety: {
    label: 'Food Safety & Hygiene',
    desc: 'Prevent line-check falsification, temperature breaches, and hygiene violations with verified digital audits.',
    steps: [
      {
        num: '01',
        title: 'Temperature Logs Skipped',
        desc: 'Placeholder readings entered from memory, hiding chiller failures until stock spoils.',
      },
      {
        num: '02',
        title: 'Thawing & Prep Lapses',
        desc: 'Unmonitored prep and defrost cycles introduce critical cross-contamination risks.',
      },
      {
        num: '03',
        title: 'Delayed Opening Checks',
        desc: 'Line checks delayed until closing, leaving sanitation issues unaddressed all day.',
      },
      {
        num: '04',
        title: 'Unresolved Hygiene Flags',
        desc: 'Infractions cleared verbally without mandatory photo evidence of ground-level fixes.',
      },
    ],
    modules: [
      'Bluetooth Temperature Probe Sync',
      'Threshold Breach & Expiry Alerts',
      'Mandatory Photo Verification',
      'Automated CAPA Corrective Action',
    ],
  },
  dailySops: {
    label: 'Store Operations & SOPs',
    desc: 'Enforce operational discipline with time-locked digital checklists that eliminate backdating.',
    steps: [
      {
        num: '01',
        title: 'Backdated Checklists',
        desc: 'Morning safety and line checks batch-signed at night just to satisfy binders.',
      },
      {
        num: '02',
        title: 'Unverified Shift Turnover',
        desc: 'Shift turnovers happen without physical verification of stations and cash drawers.',
      },
      {
        num: '03',
        title: 'Outdated Merchandising',
        desc: 'Expired marketing collateral and displays linger on retail floors past campaign dates.',
      },
      {
        num: '04',
        title: 'Superficial Closing Audits',
        desc: 'Lockups, seals, and alarms ticked off without confirmed supervisor presence.',
      },
    ],
    modules: [
      'Time-Window Checklist Locks',
      'GPS Geo-Fenced Submissions',
      'Visual Merchandising Photo Feed',
      'Escalations to Area Managers',
    ],
  },
  multiLocation: {
    label: 'Multi-Location Standards',
    desc: 'Aggregate store inspection data across all branches into real-time executive dashboards.',
    steps: [
      {
        num: '01',
        title: 'Recurring Store Infractions',
        desc: 'The same issues flagged across visits with zero permanent resolution between branches.',
      },
      {
        num: '02',
        title: 'Paper Binder Data Silos',
        desc: 'HQ compliance visibility delayed by weeks waiting for paper logs and spreadsheets.',
      },
      {
        num: '03',
        title: 'Subjective Auditor Scoring',
        desc: 'Field auditors grade identical conditions inconsistently, distorting branch benchmarks.',
      },
      {
        num: '04',
        title: 'Remote Ghost Inspections',
        desc: 'Audits signed off remotely without verified on-site presence or GPS check-in.',
      },
    ],
    modules: [
      'Cross-Branch Compliance Benchmarking',
      'Recurring Failure Trend Detection',
      'Auditor GPS & Selfie Verification',
      'Automated Regional Executive Rollups',
    ],
  },
  maintenance: {
    label: 'Maintenance & Repairs',
    desc: 'Turn audit infractions into tracked work orders with mandatory photo verification.',
    steps: [
      {
        num: '01',
        title: 'Fixes Closed Without Proof',
        desc: 'Repairs closed remotely upon invoice receipt rather than physical inspection.',
      },
      {
        num: '02',
        title: 'Untracked Equipment Failures',
        desc: 'HVAC, chillers, and kitchen assets fail repeatedly without service history.',
      },
      {
        num: '03',
        title: 'Deferred Safety Hazards',
        desc: 'Damaged flooring, wiring, and grease traps deferred across shifts until incidents occur.',
      },
      {
        num: '04',
        title: 'Unmonitored Vendor SLAs',
        desc: 'Work requests sent over informal chats, causing days of downtime without SLA accountability.',
      },
    ],
    modules: [
      'Automated Work Order Generation',
      'Before & After Photo Resolution Gate',
      'Vendor SLA & Turnaround Tracking',
      'Asset Lifetime Maintenance History',
    ],
  },
};

const AudimentProblemsSection: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState('foodSafety');
  const sectorContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: sectorScrollProgress } = useScroll({
    target: sectorContainerRef,
    offset: ["start 70px", "end end"],
  });

  useMotionValueEvent(sectorScrollProgress, "change", (latest) => {
    const keys = Object.keys(audProblemBlueprints);
    const index = Math.min(keys.length - 1, Math.floor(latest * keys.length));
    if (keys[index] && keys[index] !== selectedSector) {
      setSelectedSector(keys[index]);
    }
  });

  const handleSectorClick = (key: string, index: number) => {
    setSelectedSector(key);
    const keys = Object.keys(audProblemBlueprints);
    if (sectorContainerRef.current) {
      const rect = sectorContainerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable > 0) {
        const targetY = scrollTop + (index / keys.length) * totalScrollable;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  const sector = audProblemBlueprints[selectedSector] || audProblemBlueprints.foodSafety;

  return (
    <>
      <section className="aud-section aud-section--paper" id="problems-solved" style={{ padding: '140px 32px 56px', borderBottom: 'none' }}>
        <div className="aud-inner">
          <motion.div
            className="aud-head--center"
            style={{ marginBottom: 0 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeUpVariants}
          >
            <h2>The problems Audiment<br />is built to <span className="aud-text-orange">solve.</span></h2>
            <p style={{ maxWidth: '680px', margin: '18px auto 0' }}>
              On paper, every branch reports complete compliance. In reality, these ground-level operational blind spots happen every day before switching from manual checklists.
            </p>
          </motion.div>
        </div>
      </section>

      <div ref={sectorContainerRef} className="sector-scroll-container">
        <div className="sector-sticky-wrapper">
          <div className="sector-nav-outer">
            <div className="sector-nav-wrap">
              {Object.keys(audProblemBlueprints).map((key, index) => (
                <button
                  key={key}
                  type="button"
                  className={`sector-nav-btn ${selectedSector === key ? 'active' : ''}`}
                  onClick={() => handleSectorClick(key, index)}
                >
                  <span className="sector-nav-dot" />
                  <span>{audProblemBlueprints[key].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="problem-grid-wrap">
            <motion.div
              className="sector-showcase-grid"
              key={selectedSector}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1] as any }}
            >
              <div className="sector-steps-column">
                {sector.steps.map((step) => (
                  <div key={step.num} className="sector-step-row">
                    <span className="sector-step-num">{step.num}</span>
                    <div className="sector-step-body">
                      <h5>{step.title}</h5>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sector-summary-column">
                <div className="sector-summary-header">
                  <span className="sector-summary-tag">WORKFLOW BLUEPRINT</span>
                  <p>{sector.desc}</p>
                </div>
                <div className="sector-modules-block">
                  <span>Included Connected Modules</span>
                  <ul className="sector-modules-list">
                    {sector.modules.map((mod, i) => (
                      <li key={i}>{mod}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

const TestimonialsColumn: React.FC<{
  testimonials: { text: string; name: string; role: string }[];
  duration?: number;
  className?: string;
}> = ({ testimonials, duration = 22, className }) => {
  return (
    <div className={`aud-testimonials-col ${className || ''}`}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {[...testimonials, ...testimonials].map((t, idx) => (
          <motion.li
            key={idx}
            className="aud-testimonial-card-v2"
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
          >
            <blockquote>
              <p>“{t.text}”</p>
              <footer>
                <cite>{t.name}</cite>
                <span className="role">{t.role}</span>
              </footer>
            </blockquote>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

// ─── Main Audiment Landing Client Component ───────────────────────────────────

export default function AudimentLandingClient() {
  const cal = getCalAttributes('general');

  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [timelineHeight, setTimelineHeight] = useState(0);

  useEffect(() => {
    // Setup GSAP & Lenis smooth scrolling
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    let refreshTimer: ReturnType<typeof setTimeout> | undefined;

    // Defer non-critical micro-interactions and DOM observers to idle time
    // so the main thread is unblocked during critical hero paint and LCP
    const initDeferredInteractions = () => {
      observeDotBorderButtons();
      observeAnimations();
      initCalEmbed();

      refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
        if (timelineRef.current) {
          setTimelineHeight(timelineRef.current.getBoundingClientRect().height);
        }
      }, 300);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initDeferredInteractions, { timeout: 1000 });
    } else {
      setTimeout(initDeferredInteractions, 300);
    }

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: timelineContainerRef,
    offset: ['start 80px', 'end 50%'],
  });

  const timelineHeightTransform = useTransform(scrollYProgress, [0, 1], [0, timelineHeight]);
  const timelineOpacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <>
      {/* ── Fixed vertical guide lines matching Asellus Design Language ── */}
      <div className="page-lines" />

      {/* ── Global Header ── */}
      <Header />

      <main id="top">
        {/* ── §1 Hero Section (verbatim text + dashboard mockup) ── */}
        <section className="aud-hero">
          <div>
            <h1>
              Audit management software<br />
              <span className="muted">for multi-location businesses</span>
            </h1>
            <p>
              You can&apos;t be at every branch. Enforce operational consistency across your locations,
              run proof-based audits, track issues to resolution, and know what&apos;s actually happening on the ground.
            </p>
            <div className="actions">
              <DotBtn id="aud-hero-primary" label="Book a call" variant="orange" calAttrs={cal} />
              <DotBtn id="aud-hero-secondary" label="See it in action" calAttrs={cal} />
            </div>

            {/* Dashboard Mockup Image Preview */}
            <div className="aud-hero-mockup-wrap">
              <div className="aud-hero-mockup-frame">
                <Image
                  src="/landing/mockup.webp"
                  alt="Audiment Dashboard Overview"
                  width={1920}
                  height={1080}
                  className="aud-hero-mockup-img"
                  sizes="(max-width: 640px) calc(100vw - 74px), (max-width: 1200px) min(calc(100vw - 64px), 1140px), 1140px"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── §2 Problem Section (Home Page Three Areas style) ── */}
        <section className="intro" id="problem">
          <div>
            <h2>
              Why multi-location<br />
              audits <span className="aud-text-orange">break down.</span>
            </h2>
            <p>
              When you had one location, you saw everything.<br />
              Now you rely on managers to tell you the truth.
            </p>
          </div>
        </section>

        <section className="steps patterned">
          <motion.div
            className="three-areas-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {audProblemCards.map((card) => (
              <AudProblemCard key={card.id} card={card} />
            ))}
          </motion.div>
        </section>

        {/* ── § Client Logos Runner ── */}
        <LogosSection />

        {/* ── § Solution Section ── */}
        <section id="solution" className="aud-solution-section">
          <div className="aud-inner">
            <div className="aud-solution-header">
              <h2>
                Know what&apos;s actually happening<br />
                at every <span className="aud-text-orange">branch.</span>
              </h2>
              <p>
                Every audit collects proof. Every issue becomes a tracked task.<br />
                Every fix requires evidence – not just a checkbox.
              </p>
            </div>

            <motion.div
              className="aud-solution-cards"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger()}
            >
              {[
                {
                  iconKey: 'camera' as const,
                  title: 'Same standards, every location',
                  desc: 'Your checklists run the same way at every branch. Quality stops depending on which manager is on shift.',
                },
                {
                  iconKey: 'mapPin' as const,
                  title: 'See which branches are failing',
                  desc: 'Know which locations keep scoring low and where issues recur. No waiting for the monthly area visit.',
                },
                {
                  iconKey: 'refreshCw' as const,
                  title: 'Track the fix, not just the finding',
                  desc: "When an audit flags an issue, it becomes a task with a deadline. The fix requires photo proof before it's closed.",
                },
              ].map((c) => (
                <motion.div key={c.title} className="aud-solution-card" variants={fadeUp}>
                  <div className="aud-solution-icon">
                    <SVG d={I[c.iconKey]} size={20} />
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── § Concept Chain ── */}
        <section className="aud-chain">
          {[
            { label: 'Proof-based audits', sub: 'Every audit backed by evidence' },
            { label: 'Pattern detection', sub: 'Issues caught earlier' },
            { label: 'Corrective actions', sub: 'Accountability enforced' },
            { label: 'Consistent standards', sub: 'Same rules, every location' },
          ].map((item, i, arr) => (
            <React.Fragment key={i}>
              <div className="aud-chain-item">
                <span className="aud-chain-label">{item.label}</span>
                <span className="aud-chain-sub">{item.sub}</span>
              </div>
              {i < arr.length - 1 && <span className="aud-chain-arrow">→</span>}
            </React.Fragment>
          ))}
        </section>

        {/* ── § How it works (Diagnostic Timeline) ── */}
        <div ref={timelineContainerRef} id="how-it-works">
          <section className="intro" style={{ borderTop: 'none', padding: '130px 32px 64px' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeUp}
            >
              <h2>
                How an audit works<br />
                on <span className="aud-text-orange">Audiment.</span>
              </h2>
              <p>
                Every step from checklist creation to verified resolution is backed by proof and accountability.
              </p>
            </motion.div>
          </section>

          <section className="diagnostic-timeline-section patterned">
            <div className="diagnostic-timeline-wrap">
              <div ref={timelineRef} className="diagnostic-timeline-inner">
                {steps.map((item, index) => (
                  <div key={index} className="diagnostic-timeline-row">
                    <div className="diagnostic-timeline-sticky-col">
                      <div className="diagnostic-timeline-sticky-inner">
                        <div className="diagnostic-timeline-dot-container">
                          <div className="diagnostic-timeline-dot" />
                        </div>
                        <h3 className="diagnostic-timeline-title">
                          <span className="num">{item.num}</span>
                          <span className="text">{item.title}</span>
                        </h3>
                      </div>
                    </div>

                    <div className="diagnostic-timeline-content-col">
                      <div className="diagnostic-timeline-mobile-header">
                        <span className="num">{item.num}</span>
                        <h3>{item.title}</h3>
                      </div>

                      <div className="diagnostic-card">
                        <div className="diagnostic-card-body">
                          <h4 className="diagnostic-card-question">{item.question}</h4>
                          <p className="diagnostic-card-solution">{item.solution}</p>
                        </div>

                        <div className="diagnostic-card-sidebar">
                          <span className="sidebar-label">Key Capabilities</span>
                          <div className="diagnostic-card-tags">
                            {item.features.map((feat, i) => (
                              <span key={i} className="tag-chip">{feat}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    height: timelineHeight + 'px',
                  }}
                  className="diagnostic-timeline-line-container"
                >
                  <motion.div
                    style={{
                      height: timelineHeightTransform,
                      opacity: timelineOpacityTransform,
                    }}
                    className="diagnostic-timeline-progress-bar"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── § Three Roles / One Audit System ── */}
        <section className="aud-section aud-section--white">
          <div className="aud-inner">
            <InView>
              <div className="aud-head--center">
                <h2>
                  Three roles.<br />
                  <span className="muted">One audit system.</span>
                </h2>
              </div>
            </InView>
            <motion.div
              className="aud-roles-grid"
              initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={stagger(0.1)}
            >
              {[
                { iconKey: 'crown' as const, role: 'Leadership', subtitle: 'HQ & Executive', headBg: '#111111', items: ['Know which locations are failing – and why', 'Spot repeat issues before they become patterns', 'Set the same audit standards across every branch'] },
                { iconKey: 'users' as const, role: 'Branch Managers', subtitle: 'Area & Regional', headBg: '#2e2e2e', items: ["See which branches passed and which didn't", 'Review and close corrective actions with proof', 'Track which auditors are completing their assignments'] },
                { iconKey: 'clipboardList' as const, role: 'Auditors', subtitle: 'On the ground', headBg: '#444444', items: ['Complete checklists with required photo evidence', 'Get corrective action tasks assigned automatically', 'Submit proof of the fix before the deadline'] },
              ].map((r) => (
                <motion.div key={r.role} className="aud-role-card" variants={fadeUp}>
                  <div className="aud-role-head" style={{ background: r.headBg }}>
                    <div className="aud-role-icon"><SVG d={I[r.iconKey]} /></div>
                    <h3>{r.role}</h3>
                    <p>{r.subtitle}</p>
                  </div>
                  <div className="aud-role-body">
                    <ul>{r.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── § Sticky Feature Cards ("Everything you need to enforce standards") ── */}
        <StickyFeaturesSection />

        {/* ── § Operational Problems Showcase ── */}
        <AudimentProblemsSection />

        {/* ── § Industry Use Cases ── */}
        <section id="use-cases" className="aud-section aud-section--paper">
          <div className="aud-inner">
            <InView>
              <div className="aud-usecases-header-split">
                <h2>
                  Built for every<br />
                  <span className="aud-text-orange">multi-location operation.</span>
                </h2>
                <p className="aud-usecases-subtext">
                  Audit workflows, compliance checks, and evidence gates configured for the specific operational demands of your industry.
                </p>
              </div>
            </InView>
            <div className="aud-usecases-hatched-container">
              <motion.div
                className="aud-usecases-grid-v2"
                initial="hidden" whileInView="visible"
                viewport={{ once: true, amount: 0.06 }}
                variants={stagger(0.06)}
              >
                {useCases.map((uc) => (
                  <motion.div key={uc.title} className="aud-usecase-card-v2" variants={fadeUp}>
                    <div className="aud-usecase-card-body">
                      <div className="aud-card-icon aud-usecase-icon-v2">
                        <SVG d={I[uc.iconKey]} />
                      </div>
                      <div className="aud-usecase-card-content">
                        <h3>{uc.title}</h3>
                        <p>{uc.desc}</p>
                      </div>
                    </div>
                    <Link href={uc.href} className="aud-usecase-action-link">
                      {uc.linkText} <span className="aud-arrow">→</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── § Comparison Table ── */}
        <section id="comparison" className="aud-section aud-section--stone">
          <div className="aud-inner">
            <InView>
              <div className="aud-head--center">
                <h2>
                  What changes when you<br />
                  <span className="muted">stop auditing on paper</span>
                </h2>
                <p style={{ marginTop: 14 }}>
                  Paper checklists, generic tools, and Audiment – compared on the things that actually matter.
                </p>
              </div>
            </InView>
            <InView>
              <div className="aud-comparison-table">
                <div className="aud-comparison-head">
                  <div>Capability</div>
                  <div>Paper / Excel</div>
                  <div>Generic Tools</div>
                  <div>Audiment</div>
                </div>
                {comparisonRows.map((row, i) => (
                  <div key={i} className="aud-comparison-row">
                    <div><span className="aud-comparison-cap">{row.capability}</span></div>
                    <div>
                      <span className="aud-comparison-sym" style={{ color: row.paper.red ? '#dc2626' : '#d97706' }}>{row.paper.sym}</span>
                      <span className="aud-comparison-val">{row.paper.label}</span>
                    </div>
                    <div>
                      <span className="aud-comparison-sym" style={{ color: (row.generic as any).amber ? '#d97706' : '#dc2626' }}>{row.generic.sym}</span>
                      <span className="aud-comparison-val">{row.generic.label}</span>
                    </div>
                    <div>
                      <span className="aud-comparison-sym" style={{ color: '#16a34a' }}>{row.audiment.sym}</span>
                      <span className="aud-comparison-val aud-comparison-val--good">{row.audiment.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </InView>
          </div>
        </section>

        {/* ── § Technical Summary / Field Architecture ── */}
        <section id="field-ready" className="field-ready-section">
          <div className="field-ready-header">
            <div className="aud-inner">
              <InView>
                <div className="aud-head--center">
                  <h2>
                    Designed for the field<br />
                    Ready on <span className="aud-text-orange">day one.</span>
                  </h2>
                  <p style={{ marginTop: 14 }}>A lightweight, reliable architecture built for friction-free field execution.</p>
                </div>
              </InView>
            </div>
          </div>

          <div className="field-ready-cards patterned">
            <div className="aud-inner">
              <motion.div
                className="process-grid"
                style={{ padding: 0, background: 'transparent' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                variants={stagger(0.1)}
              >
                {[
                  {
                    iconKey: 'smartphone' as const,
                    title: 'No app download',
                    desc: 'Open a direct link, log in, and start auditing immediately. Works smoothly on any smartphone or tablet without app store downloads or IT setup.',
                  },
                  {
                    iconKey: 'wifi' as const,
                    title: 'Works offline',
                    desc: 'Audits keep running smoothly without internet in basements and walk-in chillers. Everything syncs automatically the moment connectivity returns.',
                  },
                  {
                    iconKey: 'zap' as const,
                    title: 'Zero training curve',
                    desc: 'Floor staff and field inspectors master the interface in under two minutes with clean, tap-friendly checklist workflows.',
                  },
                  {
                    iconKey: 'shield' as const,
                    title: 'Your data stays yours',
                    desc: "Every organisation's data is completely separated at the database level with automated daily backups. No other client can access yours – ever.",
                  },
                ].map((step) => (
                  <motion.article
                    key={step.title}
                    variants={fadeUp}
                    whileHover={{ y: -4, borderColor: '#bbbbbb' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  >
                    <div className="aud-tech-icon">
                      <SVG d={I[step.iconKey]} />
                    </div>
                    <h3 style={{ marginTop: 0 }}>{step.title}</h3>
                    <p>{step.desc}</p>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── § Customer Testimonials ── */}
        <section className="aud-testimonials-section" id="testimonials">
          <div className="aud-inner">
            <InView>
              <div className="aud-head--center">
                <h2>
                  What operations leaders say<br />
                  about <span className="aud-text-orange">Audiment.</span>
                </h2>
                <p style={{ marginTop: 14 }}>
                  Real feedback from hospitality groups, retail chains, and franchise operators auditing daily.
                </p>
              </div>
            </InView>
            <div className="aud-testimonials-scroll-wrap">
              <TestimonialsColumn testimonials={testimonials.slice(0, 3)} duration={22} />
              <TestimonialsColumn testimonials={testimonials.slice(3, 6)} duration={28} className="col-mid" />
              <TestimonialsColumn testimonials={testimonials.slice(6, 9)} duration={25} className="col-end" />
            </div>
          </div>
        </section>

        {/* ── § Operational Scenarios ── */}
        <section className="aud-section aud-section--paper">
          <div className="aud-inner">
            <InView>
              <div className="aud-head--center">
                <h2>
                  Field proof from<br />
                  <span className="muted">real operations</span>
                </h2>
                <p style={{ marginTop: 14 }}>
                  How multi-location operators eliminate audit delays and operational blind spots.
                </p>
              </div>
            </InView>

            <motion.div
              className="aud-scenarios-grid"
              initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.06 }}
              variants={stagger(0.08)}
            >
              {scenarios.map((cs, i) => (
                <motion.div key={i} className="aud-scenario-card" variants={fadeUp}>
                  <span className="aud-scenario-industry">{cs.industry}</span>
                  <h3>{cs.headline}</h3>
                  <p>{cs.story}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── § Frequently Asked Questions ── */}
        <section className="faq" id="faq">
          <div className="faq-left">
            <h2>Frequently asked<br />questions.</h2>
            <p>Clear, honest answers<br />about how Audiment works.</p>
          </div>
          <div className="accordions">
            {faqs.map((item, i) => (
              <details key={i}>
                <summary>
                  <span>{item.q}</span>
                  <span className="faq-icon">+</span>
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer service="general" />
    </>
  );
}
