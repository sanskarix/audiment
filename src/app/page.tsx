"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  BarChart3,
  Zap,
  Menu,
  X,
  Check,
  AlertTriangle,
  TrendingUp,
  Star,
  MapPin,
  ShieldCheck,
  Eye,
  Clock,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
  useSpring,
} from "framer-motion";
import { WobbleCard } from "@/components/ui/wobble-card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LampContainer } from "@/components/ui/lamp";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Timeline } from "@/components/ui/timeline";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { cn } from "@/lib/utils";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── Dot Background (Grid/Dot pattern from Aceternity) ──────────────────── */
function DotBackground({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-full bg-white dark:bg-black", className)}>
      <div className="absolute inset-0 bg-dot-black/[0.12] dark:bg-dot-white/[0.12]" />
      <div className="absolute pointer-events-none inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   NAVBAR — floating pill, not over-designed
   ════════════════════════════════════════════════════════════════════════════ */
const NAV = [
  { label: "Features", id: "features" },
  { label: "How it works", id: "how-it-works" },
  { label: "Pricing", id: "pricing" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        initial={false}
        animate={{
          y: scrolled ? 12 : 16,
          backgroundColor: scrolled ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0)",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(0px)",
          boxShadow: scrolled
            ? "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06), inset 0 0.5px 0 rgba(255,255,255,0.9)"
            : "none",
          borderColor: scrolled ? "rgba(0,0,0,0.04)" : "transparent",
        }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="pointer-events-auto w-[95%] max-w-4xl flex items-center justify-between px-4 sm:px-5 py-2.5 rounded-2xl border"
      >
        {/* logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.2" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.4" />
              <rect x="2" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.4" />
              <rect x="9" y="9" width="5" height="5" rx="1.2" fill="white" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-neutral-950">Audiment</span>
        </Link>

        {/* center links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="px-3.5 py-1.5 text-[13px] font-medium text-neutral-500 rounded-lg hover:text-neutral-950 hover:bg-neutral-950/[0.04] transition-colors duration-200"
            >
              {label}
            </button>
          ))}
        </div>

        {/* right */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-[13px] font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold bg-neutral-950 text-white px-4 py-2 rounded-xl hover:bg-neutral-800 transition-colors active:scale-[0.97]"
          >
            Book a demo
          </Link>
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-[72px] inset-x-4 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-neutral-100 p-5 flex flex-col gap-1 md:hidden"
          >
            {NAV.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => { scrollTo(id); setOpen(false); }}
                className="text-left text-[15px] font-medium text-neutral-700 py-2.5 px-3 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                {label}
              </button>
            ))}
            <hr className="my-2 border-neutral-100" />
            <Link href="/login" onClick={() => setOpen(false)} className="text-[15px] font-medium text-neutral-700 py-2.5 px-3">
              Sign in
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-center text-[14px] font-semibold bg-neutral-950 text-white py-3 rounded-xl mt-1"
            >
              Book a demo
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HERO — clean, with a dot-background + text generate effect
   ════════════════════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <DotBackground className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center text-center px-6 pt-32 pb-24 max-w-4xl mx-auto">
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 border border-neutral-200 bg-white rounded-full px-4 py-1.5 mb-10 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="text-xs font-medium text-neutral-600">
            Now live — FSSAI-compliant audit platform
          </span>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] font-bold tracking-tighter text-neutral-950 leading-[0.9] mb-8"
        >
          Know what your
          <br />
          <span className="text-neutral-950/60">
            kitchens look like
          </span>
          <br />
          right now.
        </motion.h1>

        {/* sub */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base sm:text-lg text-neutral-500 max-w-md mx-auto mb-10 leading-relaxed"
        >
          Audiment gives multi-outlet restaurant owners verified, real-time
          visibility into every branch — without leaving the office.
        </motion.p>

        {/* ctas */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 bg-neutral-950 text-white text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-neutral-800 transition-all duration-200 shadow-lg shadow-neutral-950/10 active:scale-[0.97]"
          >
            Start free trial
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 border border-neutral-200 text-neutral-700 text-sm font-semibold px-6 py-3.5 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-200"
          >
            Book a demo
          </Link>
        </motion.div>

        {/* social proof line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-14 flex items-center gap-6 text-neutral-400"
        >
          <div className="flex -space-x-2.5">
            {["RM", "PS", "AV", "NK"].map((initials, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center"
              >
                <span className="text-[10px] font-bold text-neutral-500">{initials}</span>
              </div>
            ))}
          </div>
          <p className="text-xs font-medium">
            Trusted by 40+ restaurant chains across India
          </p>
        </motion.div>
      </div>
    </DotBackground>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MARQUEE — using the existing InfiniteMovingCards for brands
   ════════════════════════════════════════════════════════════════════════════ */
const brandItems = [
  "Biryani Blues", "Wow! Momo", "Chaayos", "Theobroma",
  "Faasos", "Behrouz Biryani", "Punjab Grill", "Haldirams",
].map((b) => ({ quote: b, name: "", title: "" }));

function BrandMarquee() {
  return (
    <section className="py-10 bg-white border-y border-neutral-100">
      <InfiniteMovingCards items={brandItems} speed="slow" direction="left" />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   WOBBLE-CARD FEATURES — the big visual section
   ════════════════════════════════════════════════════════════════════════════ */
function WobbleFeatures() {
  return (
    <section id="features" className="py-24 md:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">
            The Platform
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
            Everything you need to audit
            <br className="hidden sm:block" /> every outlet, every day.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Primary card — full width */}
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 bg-neutral-900 min-h-[320px]"
            className=""
          >
            <div className="max-w-sm">
              <h3 className="text-left text-balance text-xl md:text-2xl font-semibold tracking-[-0.015em] text-white">
                Scheduled & surprise audits across every outlet
              </h3>
              <p className="mt-4 text-left text-sm text-neutral-300 leading-relaxed">
                Create FSSAI-compliant checklists once, publish them to any branch.
                Run daily scheduled checks, surprise audits, or fully covert
                {"\""}Flashmob{"\""} inspections — all from one dashboard.
              </p>
            </div>

            {/* Floating mini-card */}
            <div className="absolute -right-4 lg:-right-[5%] -bottom-10 hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 w-56 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Score</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-medium">Live</span>
                  </span>
                </div>
                <div className="text-4xl font-black text-white leading-none">87</div>
                <div className="text-[11px] text-white/40 mt-1">Kitchen Hygiene · Branch 3</div>
                <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "87%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            </div>
          </WobbleCard>

          {/* Secondary — tall */}
          <WobbleCard containerClassName="col-span-1 bg-orange-800 min-h-[320px]">
            <h3 className="text-left text-balance text-xl md:text-2xl font-semibold tracking-[-0.015em] text-white">
              GPS + photo proof on every checkpoint
            </h3>
            <p className="mt-4 text-left text-sm text-neutral-200 leading-relaxed">
              No shortcuts. Every response is timestamped, geo-tagged, and comes
              with a live-capture-only photo. Tamper-proof by design.
            </p>
          </WobbleCard>

          {/* Third — wide */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-indigo-900 min-h-[280px]">
            <div className="max-w-lg">
              <h3 className="text-left text-balance text-xl md:text-2xl font-semibold tracking-[-0.015em] text-white">
                Every failure auto-creates a corrective action task
              </h3>
              <p className="mt-4 text-left text-sm text-neutral-300 leading-relaxed max-w-md">
                When a checkpoint fails, the system auto-assigns a time-bound task
                to the branch manager. The loop only closes when they upload photo
                evidence of the fix. No emails, no follow-ups, no dropped balls.
              </p>
            </div>

            {/* floating task card */}
            <div className="absolute -right-4 md:-right-[5%] bottom-4 hidden md:block">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 w-60 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Action Required</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-300" />
                </div>
                <div className="space-y-2.5">
                  {[
                    { t: "Fix pest trap — Storage B", due: "2h", urgent: true },
                    { t: "Restock sanitizer", due: "4h", urgent: false },
                    { t: "Clean hood filters", due: "EOD", urgent: false },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className={cn("w-2 h-2 rounded-full shrink-0", task.urgent ? "bg-red-400" : "bg-white/20")} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-white/80 truncate">{task.t}</div>
                        <div className="text-[10px] text-white/30">Due in {task.due}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </WobbleCard>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FLASHMOB — Lamp section (the dramatic dark section)
   ════════════════════════════════════════════════════════════════════════════ */
function FlashmobLamp() {
  return (
    <section className="bg-neutral-950">
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <Camera className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-medium text-white/50 uppercase tracking-widest">
              Flashmob Audit
            </span>
          </div>

          <h2 className="text-[2.5rem] sm:text-[3rem] md:text-[3.75rem] lg:text-[4.5rem] font-bold text-white tracking-tighter leading-[0.92] max-w-3xl mb-6">
            Your manager
            <br />
            <span className="text-neutral-400">
              never sees it coming.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-400 max-w-md mb-10 leading-relaxed">
            A credentialed auditor walks into your branch unannounced, records video,
            takes a geo-tagged selfie, and sends the report directly to you.
            The manager is completely blind to it.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 bg-white text-neutral-950 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              Learn more
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </LampContainer>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TIMELINE — "How It Works"
   ════════════════════════════════════════════════════════════════════════════ */
const timelineData = [
  {
    title: "Design",
    content: (
      <div>
        <h4 className="text-lg md:text-2xl font-semibold text-neutral-950 mb-3">
          Build your audit template in minutes
        </h4>
        <p className="text-sm text-neutral-500 mb-6 leading-relaxed max-w-lg">
          Choose from pre-built FSSAI-compliant checklists or create your own.
          Add photo checkpoints, temperature readings, or custom questions.
          Assign it to specific branches or roll it out chain-wide.
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {["FSSAI Templates", "Custom Questions", "Photo Checkpoints", "Branch Assignment"].map((f) => (
            <div key={f} className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-2.5 border border-neutral-100">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-xs font-medium text-neutral-700">{f}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Execute",
    content: (
      <div>
        <h4 className="text-lg md:text-2xl font-semibold text-neutral-950 mb-3">
          Staff walk the floor, phone in hand
        </h4>
        <p className="text-sm text-neutral-500 mb-6 leading-relaxed max-w-lg">
          One question at a time. Live-capture-only photos. GPS lock on submit.
          Works offline in basements and kitchens — syncs when back online with original timestamps.
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Smartphone, label: "Mobile-first" },
            { icon: MapPin, label: "GPS verified" },
            { icon: Camera, label: "Live photos only" },
            { icon: Clock, label: "Timestamped" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-2.5 border border-neutral-100">
              <Icon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="text-xs font-medium text-neutral-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Fix",
    content: (
      <div>
        <h4 className="text-lg md:text-2xl font-semibold text-neutral-950 mb-3">
          Every failure becomes a tracked task
        </h4>
        <p className="text-sm text-neutral-500 mb-6 leading-relaxed max-w-lg">
          Failed checkpoints auto-create corrective action tasks, assigned to the manager
          with a photo-resolution deadline. The loop only closes when the issue is fixed — with evidence.
        </p>
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Corrective Actions</span>
            <span className="text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">3 open</span>
          </div>
          {[
            { t: "Fix pest trap — Storage B", status: "overdue" },
            { t: "Restock sanitizer", status: "pending" },
            { t: "Clean hood filters", status: "done" },
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-neutral-100 last:border-0">
              <div className={cn(
                "w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                task.status === "done" ? "bg-emerald-100" : task.status === "overdue" ? "bg-red-100" : "bg-neutral-100"
              )}>
                {task.status === "done" ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : task.status === "overdue" ? (
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                ) : (
                  <Clock className="w-3 h-3 text-neutral-400" />
                )}
              </div>
              <span className={cn("text-xs font-medium", task.status === "done" ? "text-neutral-400 line-through" : "text-neutral-700")}>
                {task.t}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Improve",
    content: (
      <div>
        <h4 className="text-lg md:text-2xl font-semibold text-neutral-950 mb-3">
          Watch scores climb across all branches
        </h4>
        <p className="text-sm text-neutral-500 mb-6 leading-relaxed max-w-lg">
          Cross-branch ranking dashboards, trend alerts before crises, and WhatsApp
          notifications — so you always know where things stand before a visit.
        </p>
        <div className="flex gap-4 max-w-sm">
          {[
            { metric: "87→94", label: "Avg. score after 30 days" },
            { metric: "48h", label: "Avg. fix time" },
            { metric: "3.2x", label: "More audits/month" },
          ].map(({ metric, label }) => (
            <div key={label} className="flex-1 bg-neutral-50 rounded-xl p-3 border border-neutral-100 text-center">
              <div className="text-lg font-bold text-neutral-950">{metric}</div>
              <div className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white">
      <Timeline
        data={timelineData}
        title="How it works"
        description="From template to insight — a full audit cycle in four steps."
      />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FEATURE GRID — smaller supporting features
   ════════════════════════════════════════════════════════════════════════════ */
const supportingFeatures = [
  { icon: TrendingUp, title: "Trend alerts", desc: "Automatic flags when a branch shows consistent decline across audits." },
  { icon: Zap, title: "WhatsApp alerts", desc: "Notifications sent through the channel your team already lives on." },
  { icon: MapPin, title: "Works offline", desc: "Complete audits in basements and kitchens. Syncs when back online." },
  { icon: BarChart3, title: "Cross-branch ranking", desc: "Every branch scored and ranked. Data-driven, not trust-based." },
  { icon: ShieldCheck, title: "FSSAI compliant", desc: "Pre-built templates aligned with FSSAI guidelines out of the box." },
  { icon: Eye, title: "Owner dashboard", desc: "One screen to see every branch, every score, every open action." },
];

function FeatureGrid() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 bg-neutral-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">
            And more
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
            Built for every gap in multi-outlet ops.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {supportingFeatures.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group bg-white rounded-2xl p-6 border border-neutral-200/60 hover:border-neutral-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-5 group-hover:bg-neutral-950 transition-colors duration-300">
                <Icon className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-[15px] font-semibold text-neutral-950 mb-1.5">{title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS — using InfiniteMovingCards styled for quotes
   ════════════════════════════════════════════════════════════════════════════ */
const testimonials = [
  {
    quote: "I have 14 outlets. Before Audiment, I was flying blind. Now I get a full picture of every branch every single day — without visiting any of them.",
    name: "Rohan Mehta",
    role: "Owner, Spice Route Restaurants",
    initials: "RM",
  },
  {
    quote: "The Flashmob Audit alone is worth the subscription. The first time we used it, we found a hygiene issue that had been hidden from us for months.",
    name: "Priya Shankar",
    role: "Director, Cloud Kitchen Group",
    initials: "PS",
  },
  {
    quote: "Our FSSAI inspection went smoothly for the first time ever. We had a full digital audit trail to show them on the spot.",
    name: "Amit Verma",
    role: "Founder, Chai & More",
    initials: "AV",
  },
];

function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">
            What owners say
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
            Owners sleep better with Audiment.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 flex flex-col"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                ))}
              </div>
              <blockquote className="text-sm text-neutral-600 leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-neutral-600">{t.initials}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-950">{t.name}</div>
                  <div className="text-[11px] text-neutral-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PRICING
   ════════════════════════════════════════════════════════════════════════════ */
const plans = [
  {
    name: "Starter",
    price: "₹3,999",
    period: "per outlet / month",
    desc: "For chains with 3–8 outlets ready to replace WhatsApp chaos.",
    features: [
      "Unlimited scheduled audits",
      "Surprise audit mode",
      "GPS + photo verification",
      "Corrective action tracking",
      "WhatsApp alerts",
      "FSSAI-compliant templates",
    ],
    cta: "Start free trial",
    primary: false,
  },
  {
    name: "Growth",
    price: "₹2,999",
    period: "per outlet / month",
    desc: "For chains with 9+ outlets. Volume pricing + Flashmob unlocked.",
    features: [
      "Everything in Starter",
      "Flashmob Audits (covert)",
      "Trend alerts & predictive flags",
      "Cross-branch ranking",
      "Priority onboarding (48h)",
      "Dedicated account manager",
    ],
    cta: "Book a demo",
    primary: true,
    badge: "Most popular",
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-3">
            Simple pricing
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 mb-3">
            Scales with your chain.
          </h2>
          <p className="text-neutral-500">Pay per outlet. No hidden fees. Cancel anytime.</p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-5">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              "relative rounded-2xl p-7 border flex flex-col",
              plan.primary
                ? "bg-neutral-950 text-white border-neutral-800 shadow-2xl shadow-neutral-950/20"
                : "bg-white text-neutral-950 border-neutral-200"
            )}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-6 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {plan.badge}
              </div>
            )}

            <div className={cn("text-xs font-semibold uppercase tracking-wider mb-5", plan.primary ? "text-white/40" : "text-neutral-400")}>
              {plan.name}
            </div>

            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
            </div>
            <div className={cn("text-sm mb-5", plan.primary ? "text-white/40" : "text-neutral-400")}>
              {plan.period}
            </div>

            <p className={cn("text-sm leading-relaxed mb-7", plan.primary ? "text-white/50" : "text-neutral-500")}>
              {plan.desc}
            </p>

            <ul className="space-y-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className={cn("w-4 h-4 shrink-0 mt-0.5", plan.primary ? "text-orange-400" : "text-neutral-950")} />
                  <span className={cn("text-sm", plan.primary ? "text-white/70" : "text-neutral-600")}>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/login"
              className={cn(
                "block text-center text-sm font-semibold py-3 rounded-xl transition-all duration-200 active:scale-[0.97]",
                plan.primary
                  ? "bg-white text-neutral-950 hover:bg-neutral-100"
                  : "bg-neutral-950 text-white hover:bg-neutral-800"
              )}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FINAL CTA — with background beams
   ════════════════════════════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="px-4 sm:px-6 pb-16 bg-white">
      <div className="max-w-5xl mx-auto relative rounded-3xl bg-neutral-950 overflow-hidden min-h-[400px] flex items-center justify-center">
        <BackgroundBeams className="opacity-40" />

        <div className="relative z-10 text-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold text-white tracking-tight mb-5 leading-tight">
              Ready to see every branch
              <br />
              <span className="text-orange-400">
                without leaving your chair?
              </span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed">
              First live audit in 48 hours. Full FSSAI setup included.
              No commitment — cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 bg-white text-neutral-950 text-sm font-semibold px-7 py-3.5 rounded-xl hover:bg-neutral-100 transition-all active:scale-[0.97]"
              >
                Start free trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-white/15 text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all"
              >
                Book a demo
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-neutral-950 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" rx="1.2" fill="white" />
                  <rect x="9" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.4" />
                  <rect x="2" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.4" />
                  <rect x="9" y="9" width="5" height="5" rx="1.2" fill="white" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-neutral-950">Audiment</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-[14rem]">
              Audit management for Indian restaurant chains.
              FSSAI-compliant. Multi-outlet ready.
            </p>
          </div>
          {[
            { h: "Product", items: ["Platform", "Flashmob Audits", "Corrective Actions", "Reporting"] },
            { h: "Company", items: ["About", "Customers", "Careers", "Blog"] },
            { h: "Legal", items: ["Privacy Policy", "Terms of Service", "FSSAI Compliance"] },
          ].map(({ h, items }) => (
            <div key={h}>
              <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-4">{h}</div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-950 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-neutral-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
          <p className="text-[11px] text-neutral-300">© 2026 Audiment. All rights reserved.</p>
          <p className="text-[11px] text-neutral-300">FSSAI compliant · India-hosted data</p>
        </div>
        <div className="h-[20rem] flex items-center justify-center">
          <TextHoverEffect text="AUDIMENT" />
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Navbar />
      <Hero />
      <BrandMarquee />
      <WobbleFeatures />
      <FlashmobLamp />
      <HowItWorks />
      <FeatureGrid />
      <TestimonialsSection />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}