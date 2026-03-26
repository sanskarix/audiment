"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Zap, 
  Video, 
  CheckCircle, 
  BarChart3, 
  Bell, 
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Timeline } from "@/components/ui/timeline";
import { Spotlight } from "@/components/ui/spotlight";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled 
          ? "bg-[#0a0a0a]/80 backdrop-blur-md border-white/10 py-4" 
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white tracking-tighter">
          AUDIMENT
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">How it works</Link>
          <Link 
            href="/login" 
            className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold border border-white hover:bg-transparent hover:text-white transition-all duration-300"
          >
            Login
          </Link>
        </div>

        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0a0a0a] border-b border-white/10 flex flex-col p-6 gap-6 md:hidden"
          >
            <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg font-medium">Features</Link>
            <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-lg font-medium">How it works</Link>
            <Link href="/login" className="bg-white text-black py-4 rounded-xl text-center font-bold">Login</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeader = ({ badge, title, subline }: { badge?: string; title: string; subline?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="flex flex-col items-center text-center gap-4 mb-16"
  >
    {badge && (
      <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">
        {badge}
      </span>
    )}
    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter max-w-3xl leading-[0.95]">
      {title}
    </h2>
    {subline && (
      <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed mt-4">
        {subline}
      </p>
    )}
  </motion.div>
);

// --- Content Data ---

const marqueeItems = [
  "Scheduled Audits",
  "Surprise Audits",
  "Flashmob Audit",
  "Corrective Actions",
  "Trend Alerts",
  "PDF Reports",
  "Geo-Tagged Evidence",
  "Real-Time Dashboards"
];

const bentoFeatures = [
  {
    title: "Scheduled Audits",
    description: "Publish recurring audits for any branch on any cadence — automated and consistent.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden border border-white/5 flex flex-col gap-2 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-8 w-full bg-white/5 rounded-lg flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <div className="h-2 w-16 bg-white/10 rounded" />
          </div>
          <div className="h-2 w-8 bg-white/5 rounded" />
        </div>
      ))}
    </div>,
    icon: <Calendar className="h-4 w-4 text-white/50" />,
    className: "md:col-span-2",
  },
  {
    title: "Surprise Audits",
    description: "Send unannounced audits with same-day deadlines.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-[#0a0a0a] border border-white/5 group-hover:scale-[1.02] transition-transform duration-500 items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full animate-ping absolute" />
        <Zap className="w-8 h-8 text-emerald-500 relative z-10" />
      </div>
    </div>,
    icon: <Zap className="h-4 w-4 text-white/50" />,
    className: "md:col-span-1",
  },
  {
    title: "Flashmob Audit",
    description: "Deploy covert auditors who capture 20-second live videos from the field.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-zinc-900 border border-white/5 group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <Video className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-2 left-2 bg-red-500 text-[8px] font-bold px-1.5 py-0.5 rounded text-white italic tracking-tighter">LIVE • COVERT</div>
    </div>,
    icon: <Video className="h-4 w-4 text-white/50" />,
    className: "md:col-span-1",
  },
  {
    title: "Corrective Actions",
    description: "Failed checkpoints automatically become assigned tasks — they get fixed.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/10 group-hover:scale-[1.02] transition-transform duration-500 flex flex-col p-4 gap-2">
      <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400">ASSIGNED TO: BRANCH 04</div>
      <div className="h-8 w-full bg-white/5 rounded-lg flex items-center gap-3 px-3">
        <div className="w-4 h-4 rounded-md border-2 border-indigo-500/50" />
        <div className="h-2 w-32 bg-white/10 rounded" />
      </div>
      <div className="h-8 w-full bg-indigo-500/10 rounded-lg flex items-center gap-3 px-3">
        <CheckCircle className="w-4 h-4 text-indigo-500" />
        <div className="h-2 w-24 bg-white/20 rounded" />
      </div>
    </div>,
    icon: <CheckCircle className="h-4 w-4 text-white/50" />,
    className: "md:col-span-2",
  },
  {
    title: "Scoring and Reports",
    description: "Track trends and compare performance instantly with automated PDF reports.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-zinc-900/90 border border-white/5 group-hover:scale-[1.02] transition-transform duration-500 p-4 relative">
      <div className="flex items-end gap-1 h-20">
        {[40, 70, 45, 90, 65, 85].map((h, i) => (
          <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-white/10 rounded-t-md hover:bg-white/20 transition-all cursor-pointer" />
        ))}
      </div>
      <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-black px-2 py-1 rounded">SCORE: 88%</div>
    </div>,
    icon: <BarChart3 className="h-4 w-4 text-white/50" />,
    className: "md:col-span-1",
  },
  {
    title: "Escalation Alerts",
    description: "Get notified automatically when a branch scores low or misses an audit.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-orange-500/5 border border-orange-500/10 group-hover:scale-[1.02] transition-transform duration-500 flex items-center justify-center">
       <div className="relative">
          <Bell className="w-10 h-10 text-orange-500" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
          </div>
       </div>
    </div>,
    icon: <Bell className="h-4 w-4 text-white/50" />,
    className: "md:col-span-1",
  },
];

const timelineData = [
  {
    title: "Step 1",
    content: (
      <div>
        <p className="text-white text-xl md:text-2xl font-black mb-4 tracking-tight uppercase">Admin publishes an audit</p>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
          Choose a template, pick a branch, set a deadline. Done in 30 seconds. One central control, unlimited locations.
        </p>
      </div>
    ),
  },
  {
    title: "Step 2",
    content: (
      <div>
        <p className="text-white text-xl md:text-2xl font-black mb-4 tracking-tight uppercase">Manager assigns it</p>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
          The right auditor gets notified instantly on their mobile and knows exactly what needs to be checked. No fumbling with paper.
        </p>
      </div>
    ),
  },
  {
    title: "Step 3",
    content: (
      <div>
        <p className="text-white text-xl md:text-2xl font-black mb-4 tracking-tight uppercase">Owner sees everything</p>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
          Photo-backed results, scores, and alerts land on your dashboard in real time. Replace gut feel with verified ground truth.
        </p>
      </div>
    ),
  },
];

// --- Main Page ---

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 px-6">
        <Spotlight 
          className="-top-40 left-0 md:left-60 md:-top-20" 
          fill="white"
        />
        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            Audit Management for Multi-Outlet Businesses
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase"
          >
            Every Branch.<br />
            Every Audit.<br />
            Total Control.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-neutral-400 max-w-2xl text-lg md:text-xl font-medium leading-relaxed"
          >
            Audiment replaces guesswork with verified, photo-backed audit data from every outlet — so you always know what's really happening on the ground.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Link 
              href="/login" 
              className="px-10 py-5 rounded-full bg-white text-black text-lg font-black uppercase hover:bg-neutral-200 transition-all duration-300"
            >
              Get Started
            </Link>
            <Link 
              href="/login" 
              className="px-10 py-5 rounded-full bg-transparent text-white text-lg font-black uppercase border border-white/20 hover:bg-white/5 transition-all duration-300"
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
        <BackgroundBeams />
      </section>

      {/* Marquee Strip */}
      <section className="py-20 bg-[#0a0a0a] border-y border-white/5 relative overflow-hidden">
        <InfiniteMovingCards
          items={marqueeItems.map(item => ({ quote: item, name: "Feature", title: "" }))}
          direction="right"
          speed="slow"
          className="font-black text-3xl md:text-5xl text-white/10"
        />
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            badge="Features" 
            title="Everything you need to audit smarter." 
            subline="One platform. Complete visibility across every branch, every day."
          />
          <BentoGrid className="max-w-6xl mx-auto">
            {bentoFeatures.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={cn("bg-[#0a0a0a] border border-white/5", item.className)}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="how-it-works" className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
           <Timeline 
             data={timelineData} 
             title="Simple for everyone. Powerful for owners."
             description="Audiment works across every branch, every day — providing absolute ground-level honesty."
           />
        </div>
      </section>

      {/* Spotlight CTA */}
      <section className="relative py-40 flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0 opacity-40">
           <Spotlight className="-bottom-80 left-0" fill="white" />
        </div>
        <div className="relative z-10 max-w-4xl px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.9] uppercase"
          >
            Stop hoping.<br />Start knowing.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
             <Link 
              href="/login" 
              className="px-16 py-8 rounded-full bg-white text-black text-2xl font-black uppercase hover:scale-105 transition-transform duration-300 flex items-center gap-4 mx-auto w-fit"
            >
              Get Started Today <ArrowRight className="w-8 h-8" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/5 pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <Link href="/" className="text-3xl font-black text-white tracking-tighter mb-4 block">
                AUDIMENT
              </Link>
              <p className="text-neutral-500 max-w-xs text-sm leading-relaxed">
                Audit smarter. Manage better. The transparency layer for multi-outlet businesses.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-tight">PLATFORM</h4>
              <ul className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-6 tracking-tight">LEGAL</h4>
              <ul className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Watermark Section */}
          <div className="relative w-full overflow-hidden mb-10 h-40 md:h-80 select-none">
             <TextHoverEffect text="AUDIMENT" />
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:row items-center justify-between gap-4">
            <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
               © 2026 Audiment. All rights reserved.
            </p>
            <div className="flex gap-6">
               {/* Social placeholders if needed */}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
