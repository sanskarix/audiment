"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Camera,
  BarChart3,
  ListChecks,
  Zap,
  Menu,
  X,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Star,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";

// ─── Utility ───────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Navbar ────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-5 py-5">
      <motion.div
        initial={false}
        animate={scrolled ? "scrolled" : "top"}
        variants={{
          top: { backgroundColor: "rgba(255,255,255,0)", backdropFilter: "blur(0px)", borderColor: "rgba(0,0,0,0)", boxShadow: "none" },
          scrolled: { backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderColor: "rgba(0,0,0,0.07)", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" },
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 rounded-full border"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-label="Audiment logo">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <span className="font-bold text-[15px] tracking-tight text-black">Audiment</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-7">
          {["Platform", "Pricing", "Customers", "Resources"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-neutral-500 hover:text-black transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block text-sm font-semibold text-neutral-600 hover:text-black transition-colors">
            Log in
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold bg-black text-white px-5 py-2 rounded-full hover:bg-neutral-800 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Book a demo
          </Link>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 mx-0 p-6 bg-white/90 backdrop-blur-xl border border-black/5 rounded-3xl shadow-xl flex flex-col gap-5 md:hidden"
          >
            {["Platform", "Pricing", "Customers", "Resources"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-lg font-bold text-black" onClick={() => setOpen(false)}>
                {item}
              </Link>
            ))}
            <div className="h-px bg-neutral-100" />
            <Link href="/login" className="text-lg font-bold text-black" onClick={() => setOpen(false)}>Log in</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── Floating Card Components (Dialog-style) ───────────────────────────────
const AuditScoreCard = () => (
  <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 w-52">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Live Score</span>
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] text-green-600 font-semibold">Live</span>
      </span>
    </div>
    <div className="text-4xl font-black text-black mb-1">87<span className="text-lg text-neutral-400 font-bold">/100</span></div>
    <div className="text-[11px] text-neutral-500 mb-3">Kitchen Hygiene — Branch 3</div>
    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "87%" }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="h-full bg-black rounded-full"
      />
    </div>
    <div className="flex justify-between mt-1">
      <span className="text-[10px] text-neutral-400">0</span>
      <span className="text-[10px] text-neutral-400">100</span>
    </div>
  </div>
);

const FlashmobCard = () => (
  <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 w-60">
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
        <Camera className="w-4 h-4 text-white" />
      </div>
      <div>
        <div className="text-[12px] font-bold text-black">Flashmob Audit</div>
        <div className="text-[10px] text-neutral-500">Unannounced · Branch 7</div>
      </div>
      <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
    </div>
    <div className="space-y-2">
      {[
        { label: "Staff compliance", val: "✓", green: true },
        { label: "Food storage temp", val: "✓", green: true },
        { label: "Washroom hygiene", val: "!", green: false },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-neutral-50 last:border-0">
          <span className="text-[11px] text-neutral-600">{row.label}</span>
          <span className={cn("text-[11px] font-bold", row.green ? "text-green-600" : "text-orange-500")}>{row.val}</span>
        </div>
      ))}
    </div>
    <div className="mt-3 text-[10px] text-neutral-400 text-center">Sent directly to owner · Manager blind</div>
  </div>
);

const CorrectiveCard = () => (
  <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-4 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-white/60 w-56">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Action Required</span>
      <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
    </div>
    <div className="space-y-2.5">
      {[
        { task: "Fix pest trap — Storage B", due: "2h", urgent: true },
        { task: "Restock sanitizer — Kitchen", due: "4h", urgent: false },
        { task: "Clean hood filters", due: "EOD", urgent: false },
      ].map((t, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className={cn("w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center", t.urgent ? "bg-red-100" : "bg-neutral-100")}>
            <div className={cn("w-1.5 h-1.5 rounded-full", t.urgent ? "bg-red-500" : "bg-neutral-400")} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-medium text-black leading-tight">{t.task}</div>
            <div className="text-[10px] text-neutral-400">Due in {t.due}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Hero ───────────────────────────────────────────────────────────────────
const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Floating card parallax
  const cardY1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const cardY2 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const cardY3 = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-24 px-6 overflow-hidden bg-white">
      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-50"
          style={{
            background: "radial-gradient(ellipse at 20% 20%, oklch(0.95 0.06 30) 0, transparent 50%), radial-gradient(ellipse at 80% 10%, oklch(0.93 0.05 280) 0, transparent 50%), radial-gradient(ellipse at 60% 70%, oklch(0.94 0.04 200) 0, transparent 50%), radial-gradient(ellipse at 30% 80%, oklch(0.96 0.07 60) 0, transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Main Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-black/8 text-neutral-600 text-[11px] font-bold uppercase tracking-[0.15em] mb-10 shadow-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-orange-500" />
          </span>
          Built for Indian restaurant chains
        </motion.div>

        {/* Hero headline — word-by-word reveal */}
        <div className="overflow-hidden mb-8">
          {["Every Branch.", "Total Control."].map((line, li) => (
            <motion.div
              key={li}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.1 + li * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "text-[clamp(3rem,8vw,7rem)] font-black tracking-tight leading-[0.92]",
                li === 0 ? "text-black" : "text-neutral-300"
              )}
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-neutral-500 max-w-xl mx-auto leading-relaxed mb-12"
        >
          Audiment gives restaurant owners verified, real-time visibility into every outlet — without leaving the office.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link
            href="/login"
            className="group flex items-center gap-2.5 px-8 py-4 bg-black text-white text-[15px] font-bold rounded-full transition-all duration-300 hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
          >
            Get started free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-8 py-4 bg-white border border-neutral-200 text-black text-[15px] font-bold rounded-full transition-all duration-300 hover:border-black hover:-translate-y-0.5"
          >
            Book a demo
          </Link>
        </motion.div>

        {/* Social proof numbers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center justify-center gap-8 mt-16"
        >
          {[
            { n: "3–25", label: "outlets supported" },
            { n: "48h", label: "onboarding to live" },
            { n: "100%", label: "FSSAI compliant" },
          ].map(({ n, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-black">{n}</div>
              <div className="text-[11px] text-neutral-400 font-medium">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating Cards — Dialog style */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Left card */}
        <motion.div
          style={{ y: cardY1 }}
          animate={{ y: [0, -18, 0], rotate: [-4, -2, -4] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[22%] left-[4%] hidden xl:block"
        >
          <AuditScoreCard />
        </motion.div>

        {/* Right card */}
        <motion.div
          style={{ y: cardY2 }}
          animate={{ y: [0, 16, 0], rotate: [5, 3, 5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[18%] right-[4%] hidden xl:block"
        >
          <FlashmobCard />
        </motion.div>

        {/* Bottom right card */}
        <motion.div
          style={{ y: cardY3 }}
          animate={{ y: [0, -12, 0], rotate: [-3, 0, -3] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[12%] right-[6%] hidden xl:block"
        >
          <CorrectiveCard />
        </motion.div>
      </div>
    </section>
  );
};

// ─── Logo Marquee ───────────────────────────────────────────────────────────
const brands = ["Biryani Blues", "Wow! Momo", "Chaayos", "Theobroma", "Faasos", "Haldirams", "Behrouz Biryani", "Punjab Grill"];

const LogoMarquee = () => (
  <section className="py-16 bg-white border-y border-neutral-100 overflow-hidden">
    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.25em] text-center mb-10">
      Trusted by India's fastest-growing chains
    </p>
    <div className="relative flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-white after:to-transparent">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex gap-16 items-center whitespace-nowrap"
      >
        {[...brands, ...brands].map((brand, i) => (
          <span
            key={i}
            className="text-2xl font-black text-neutral-200 hover:text-black transition-colors duration-500 cursor-default uppercase tracking-tight select-none"
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </div>
  </section>
);

// ─── Sticky Feature Panels (Dialog-style scroll stack) ──────────────────────
const features = [
  {
    step: "01",
    tag: "Publish",
    headline: "Design audits\nthat actually get done.",
    body: "Build FSSAI-compliant audit templates once. Publish to any branch instantly — as a scheduled recurring check, a same-day surprise, or a fully covert Flashmob audit.",
    accent: "bg-orange-50/40",
    visual: <AuditScoreCard />,
  },
  {
    step: "02",
    tag: "Verify",
    headline: "Geo-tagged proof.\nNo shortcuts.",
    body: "Staff walk the floor answering one question at a time on their phone. Live-capture-only photos. GPS location locked on submit. Every audit is timestamped and tamper-proof.",
    accent: "bg-blue-50/30",
    visual: <FlashmobCard />,
  },
  {
    step: "03",
    tag: "Fix",
    headline: "Every failure becomes\na tracked task.",
    body: "Failed checkpoints auto-create corrective action tasks assigned to the manager with a photo-resolution deadline. The loop only closes when the issue is fixed with evidence.",
    accent: "bg-neutral-50/60",
    visual: <CorrectiveCard />,
  },
];

const StickyFeaturePanel = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 * index }}
      className="sticky mb-6"
      style={{ top: `${120 + index * 24}px` }}
    >
      <div className={cn("max-w-6xl mx-auto rounded-[2.5rem] border border-black/5 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.07)]", feature.accent)}>
        <div className="grid md:grid-cols-2 gap-0 items-stretch">
          {/* Text side */}
          <div className="p-10 md:p-16 flex flex-col justify-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black text-black bg-white border border-black/8 rounded-full px-3 py-1 shadow-sm">
                {feature.step}
              </span>
              <span className="w-px h-4 bg-neutral-200" />
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                {feature.tag}
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight text-black leading-[1.05] whitespace-pre-line">
              {feature.headline}
            </h3>
            <p className="text-[15px] text-neutral-600 leading-relaxed max-w-sm">
              {feature.body}
            </p>
            <button className="group inline-flex items-center gap-1.5 text-sm font-bold text-black border-b-2 border-black pb-0.5 self-start hover:gap-3 transition-all duration-200">
              See how it works
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Visual side */}
          <div className="bg-white/40 flex items-center justify-center p-12 md:p-16 min-h-[320px]">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5 + index * 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {feature.visual}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StickyFeatures = () => (
  <section className="py-32 bg-white">
    <div className="max-w-3xl mx-auto px-6 text-center mb-28">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl md:text-7xl font-black tracking-tight text-black leading-[0.95] mb-6"
      >
        From publish<br />to fixed.
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-xl text-neutral-500"
      >
        Three steps. Zero paperwork. Full accountability.
      </motion.p>
    </div>
    <div className="px-6 relative">
      {features.map((f, i) => (
        <StickyFeaturePanel key={i} feature={f} index={i} />
      ))}
      {/* Spacer so last card un-sticks cleanly */}
      <div className="h-20" />
    </div>
  </section>
);

// ─── Flashmob Feature Highlight (Dialog "chatbot lives in a corner" section) ─
const FlashmobHighlight = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 bg-black overflow-hidden relative">
      {/* Subtle mesh on dark */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 10% 50%, oklch(0.3 0.1 280) 0, transparent 60%), radial-gradient(ellipse at 90% 50%, oklch(0.3 0.08 30) 0, transparent 60%)",
        }}
      />
      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 text-white/60 text-[11px] font-bold uppercase tracking-widest mb-8">
                <Camera className="w-3.5 h-3.5" />
                Flashmob Audit
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
                Your manager<br />
                <span className="text-neutral-500">never sees it.</span>
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-10 max-w-sm">
                A credentialed auditor walks into your branch unannounced, records a 20-second video, takes a geo-tagged selfie, and sends the report directly to you. The manager is completely blind to it.
              </p>
              <p className="text-sm text-neutral-500 mb-8 italic">
                "The ability to see what a kitchen looks like at 11am on a Tuesday — with no manager influence — is unprecedented at this price point."
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-100 transition-all hover:-translate-y-0.5"
              >
                Learn about Flashmob <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right — animated phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 bg-white/8 backdrop-blur-xl border border-white/12 rounded-3xl p-5 shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">Flashmob Report</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <div className="aspect-video bg-white/5 border border-white/10 rounded-xl mb-4 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white/50" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {[
                  { label: "Location verified", ok: true },
                  { label: "Identity confirmed", ok: true },
                  { label: "Kitchen — visible issue", ok: false },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-white/50">{row.label}</span>
                    <span className={cn("text-[11px] font-bold", row.ok ? "text-green-400" : "text-red-400")}>
                      {row.ok ? "✓" : "!"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-white/25 text-center">Delivered to owner · Manager not notified</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Bento Grid ─────────────────────────────────────────────────────────────
const bentoItems = [
  {
    col: "md:col-span-7",
    title: "Trend alerts before crises.",
    body: "Automatic alerts fire when a branch shows consistent decline across multiple audits — weeks before the problem is visible to the naked eye.",
    icon: TrendingUp,
    bg: "bg-neutral-50",
  },
  {
    col: "md:col-span-5",
    title: "WhatsApp-native alerts.",
    body: "Notifications delivered through the channel your team already uses all day.",
    icon: Zap,
    bg: "bg-orange-50",
  },
  {
    col: "md:col-span-5",
    title: "Works offline.",
    body: "Auditors in kitchens and basements complete the checklist offline. Everything syncs when back online, with original timestamps preserved.",
    icon: MapPin,
    bg: "bg-blue-50",
  },
  {
    col: "md:col-span-7",
    title: "Cross-branch ranking.",
    body: "Every branch ranked and scored side-by-side. Objective, data-driven conversations with your managers — not trust-based ones.",
    icon: BarChart3,
    bg: "bg-neutral-50",
  },
];

const BentoGrid = () => {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-black tracking-tight text-black mb-4"
          >
            Built for every gap<br />in multi-outlet ops.
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {bentoItems.map(({ col, title, body, icon: Icon, bg }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={cn("rounded-3xl p-8 border border-black/5 cursor-default", col, bg)}
            >
              <div className="mb-6">
                <Icon className="w-6 h-6 text-black" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
              <p className="text-[14px] text-neutral-600 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Pricing Section ─────────────────────────────────────────────────────────
const Pricing = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="py-32 px-6 bg-neutral-50" ref={ref}>
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black mb-4">
          Scales with your chain.
        </h2>
        <p className="text-lg text-neutral-500">Pay per outlet. No hidden fees. Cancel anytime.</p>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {[
          {
            name: "Starter",
            price: "₹3,999",
            period: "/ outlet / month",
            description: "For chains with 3–8 outlets ready to move beyond WhatsApp management.",
            features: ["Unlimited scheduled audits", "Surprise audit mode", "GPS + photo verification", "Corrective action tracking", "WhatsApp alerts", "FSSAI-compliant templates"],
            cta: "Start free trial",
            highlight: false,
          },
          {
            name: "Growth",
            price: "₹2,999",
            period: "/ outlet / month",
            description: "For chains with 9+ outlets. Volume pricing + Flashmob Audits unlocked.",
            features: ["Everything in Starter", "Flashmob Audits (covert)", "Trend alerts & predictive flags", "Cross-branch ranking dashboard", "Priority onboarding (48h)", "Dedicated account manager"],
            cta: "Book a demo",
            highlight: true,
          },
        ].map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "rounded-3xl p-8 border",
              plan.highlight
                ? "bg-black text-white border-black shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
                : "bg-white text-black border-black/8"
            )}
          >
            <div className="mb-6">
              <div className={cn("text-[11px] font-bold uppercase tracking-widest mb-3", plan.highlight ? "text-white/50" : "text-neutral-400")}>
                {plan.name}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className={cn("text-sm", plan.highlight ? "text-white/50" : "text-neutral-400")}>{plan.period}</span>
              </div>
              <p className={cn("text-sm mt-2 leading-relaxed", plan.highlight ? "text-white/60" : "text-neutral-500")}>
                {plan.description}
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <CheckCircle2 className={cn("w-4 h-4 shrink-0", plan.highlight ? "text-white/70" : "text-black")} />
                  <span className={cn("text-sm", plan.highlight ? "text-white/80" : "text-neutral-700")}>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className={cn(
                "block text-center text-sm font-bold py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5",
                plan.highlight
                  ? "bg-white text-black hover:bg-neutral-100"
                  : "bg-black text-white hover:bg-neutral-800"
              )}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ─── Testimonials ────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "I have 14 outlets. Before Audiment, I was flying blind. Now I get a full picture of every branch every single day — without visiting any of them.",
    name: "Rohan Mehta",
    role: "Owner, Spice Route Restaurants",
    outlets: "14 outlets",
  },
  {
    quote: "The Flashmob Audit feature alone is worth the subscription. The first time we used it, we found a hygiene issue that had been hidden from us for months.",
    name: "Priya Shankar",
    role: "Director, Cloud Kitchen Group",
    outlets: "9 outlets",
  },
  {
    quote: "Our FSSAI inspection went smoothly for the first time ever. We had a full digital audit trail to show them on the spot.",
    name: "Amit Verma",
    role: "Founder, Chai & More",
    outlets: "6 outlets",
  },
];

const Testimonials = () => (
  <section className="py-32 px-6 bg-white overflow-hidden">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black mb-4">
          Owners sleep better.
        </h2>
        <p className="text-lg text-neutral-500">What restaurant chains say after switching to Audiment.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="bg-neutral-50 rounded-3xl p-8 border border-black/5 flex flex-col gap-6"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star key={si} className="w-4 h-4 fill-black text-black" />
              ))}
            </div>
            <p className="text-[15px] text-neutral-700 leading-relaxed flex-1">"{t.quote}"</p>
            <div>
              <div className="font-bold text-sm text-black">{t.name}</div>
              <div className="text-[12px] text-neutral-400">{t.role} · {t.outlets}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Final CTA ───────────────────────────────────────────────────────────────
const FinalCTA = () => (
  <section className="py-32 px-6 bg-white">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto bg-black rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, oklch(0.4 0.12 30) 0, transparent 60%), radial-gradient(ellipse at 70% 50%, oklch(0.3 0.1 280) 0, transparent 60%)" }}
      />
      <div className="relative z-10">
        <div className="text-[11px] font-bold text-white/40 uppercase tracking-[0.25em] mb-6">Ready to start?</div>
        <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.92] tracking-tight mb-6">
          See every branch.<br />Trust nothing else.
        </h2>
        <p className="text-lg text-white/50 mb-12 max-w-md mx-auto leading-relaxed">
          First live audit within 48 hours of sign-up. Full FSSAI-compliant setup. Cancel anytime.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black text-[15px] font-bold rounded-full hover:bg-neutral-100 transition-all hover:-translate-y-0.5"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white text-[15px] font-bold rounded-full hover:border-white/40 transition-all hover:-translate-y-0.5"
          >
            Book a demo
          </Link>
        </div>
      </div>
    </motion.div>
  </section>
);

// ─── Footer ──────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-neutral-100 py-16 px-6 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
                <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-black">Audiment</span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-[16rem]">
            Audit management for Indian restaurant chains. FSSAI-compliant. Multi-outlet ready.
          </p>
        </div>
        {[
          { heading: "Product", links: ["Platform", "Flashmob Audits", "Corrective Actions", "Reporting", "Integrations"] },
          { heading: "Company", links: ["About", "Customers", "Careers", "Blog"] },
          { heading: "Legal", links: ["Privacy Policy", "Terms of Service", "FSSAI Compliance"] },
        ].map(({ heading, links }) => (
          <div key={heading}>
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-4">{heading}</div>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-neutral-600 hover:text-black transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[12px] text-neutral-400">© 2026 Audiment. All rights reserved.</p>
        <p className="text-[12px] text-neutral-400">FSSAI compliant · India-hosted data</p>
      </div>
    </div>
  </footer>
);

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <StickyFeatures />
      <FlashmobHighlight />
      <BentoGrid />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}