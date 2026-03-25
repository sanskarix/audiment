"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  BarChart3, 
  Smartphone, 
  Clock, 
  ArrowRight,
  Menu,
  X,
  Play,
  ArrowUpRight,
  ClipboardCheck,
  ZapOff,
  Users,
  Building2,
  ChevronRight,
  TrendingUp,
  FileText,
  ShieldAlert
} from "lucide-react";

// --- Components ---

const FadeInSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};


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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-black">Audiment</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">How it Works</Link>
          <Link href="#who-it-is-for" className="text-sm font-medium text-neutral-600 hover:text-black transition-colors">Who it's for</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/auth/signin" 
            className="text-sm font-medium text-neutral-600 hover:text-black transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-black"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-neutral-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300 md:hidden shadow-xl">
          <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-2">Features</Link>
          <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-2">How it Works</Link>
          <Link href="#who-it-is-for" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-2">Who it's for</Link>
          <div className="h-px bg-neutral-100 my-2" />
          <Link href="/auth/signin" className="text-lg font-medium py-2">Sign In</Link>
          <Link href="/auth/signup" className="bg-black text-white text-center rounded-xl py-4 font-bold">Get Started</Link>
        </div>
      )}
    </nav>
  );
};

const Marquee = () => {
  return (
    <div className="py-20 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">Trusted by fast-moving teams</p>
      </div>
      <div className="relative flex whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <div className="flex animate-infinite-slider gap-20 items-center [--slide-offset:-50%] shrink-0 py-4">
          {[1,2,3].map((set) => (
            <React.Fragment key={set}>
              <span className="text-2xl font-bold text-neutral-300 grayscale hover:grayscale-0 transition-all cursor-default flex items-center gap-2">
                <Building2 className="w-6 h-6" /> QSR GROUP
              </span>
              <span className="text-2xl font-bold text-neutral-300 grayscale hover:grayscale-0 transition-all cursor-default flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> RELIANCE
              </span>
              <span className="text-2xl font-bold text-neutral-300 grayscale hover:grayscale-0 transition-all cursor-default flex items-center gap-2">
                <Zap className="w-6 h-6" /> FASTPACE
              </span>
              <span className="text-2xl font-bold text-neutral-300 grayscale hover:grayscale-0 transition-all cursor-default flex items-center gap-2">
                <Users className="w-6 h-6" /> PEOPLEWARE
              </span>
              <span className="text-2xl font-bold text-neutral-300 grayscale hover:grayscale-0 transition-all cursor-default flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" /> SAFEGUARD
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon: Icon, className = "", children }: any) => (
  <FadeInSection className={`bg-neutral-50 rounded-[32px] overflow-hidden border border-neutral-100 flex flex-col p-8 ${className}`}>
    <div className="flex flex-col gap-4 mb-8">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100">
        <Icon className="w-6 h-6 text-black" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
        <p className="text-neutral-500 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
    <div className="mt-auto relative w-full aspect-video rounded-2xl overflow-hidden bg-white border border-neutral-100 shadow-sm flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
      {children}
    </div>
  </FadeInSection>
);

// --- Main Page ---

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neutral-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neutral-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <FadeInSection className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Trusted by 500+ managers
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-black mb-8 leading-[0.9]">
              Operations <br/>
              <span className="text-neutral-300">Simplified.</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Ditch the spreadsheets. Audiment is the all-in-one platform for recurring, surprise, and flashmob audits that actually drive results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/auth/signup" 
                className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#how-it-works" 
                className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg border border-neutral-200 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
              >
                Learn More
              </Link>
            </div>
          </FadeInSection>

          {/* Hero Visual */}
          <FadeInSection className="mt-24 relative max-w-6xl mx-auto" >
            <div className="relative rounded-[40px] overflow-hidden border border-neutral-200 shadow-2xl skew-x-[-1deg] rotate-x-[5deg] transition-transform duration-700 hover:rotate-0 hover:skew-0">
               {/* Mockup Content */}
               <div className="bg-neutral-50 aspect-[16/9] w-full p-8 flex flex-col gap-6">
                 {/* Mockup Header */}
                 <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-neutral-200" />
                       <div className="w-3 h-3 rounded-full bg-neutral-200" />
                       <div className="w-3 h-3 rounded-full bg-neutral-200" />
                    </div>
                    <div className="h-6 w-32 bg-neutral-200 rounded-md" />
                 </div>
                 {/* Mockup Body */}
                 <div className="flex-1 grid grid-cols-12 gap-6">
                    <div className="col-span-3 flex flex-col gap-3">
                       <div className="h-4 w-full bg-neutral-200 rounded" />
                       <div className="h-4 w-4/5 bg-neutral-100 rounded" />
                       <div className="mt-4 h-32 w-full bg-neutral-200/50 rounded-xl" />
                    </div>
                    <div className="col-span-9 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm flex flex-col gap-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-neutral-100 animate-pulse" />
                          <div className="flex flex-col gap-2">
                             <div className="h-4 w-48 bg-neutral-200 rounded" />
                             <div className="h-3 w-32 bg-neutral-100 rounded" />
                          </div>
                       </div>
                       <div className="grid grid-cols-3 gap-4">
                          {[1,2,3].map(i => (
                            <div key={i} className="h-24 rounded-xl bg-neutral-50 border border-neutral-100" />
                          ))}
                       </div>
                       <div className="h-32 w-full bg-neutral-50 rounded-xl border border-neutral-100 p-4">
                          <div className="flex flex-col gap-3">
                             <div className="h-2 w-full bg-neutral-200 rounded" />
                             <div className="h-2 w-full bg-neutral-200 rounded" />
                             <div className="h-2 w-2/3 bg-neutral-100 rounded" />
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
               {/* Decorative floating elements */}
               <div className="absolute top-20 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-neutral-100 animate-bounce transition-all duration-3000">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase">Audit Completed</p>
                        <p className="text-sm font-bold">98.5% Score</p>
                     </div>
                  </div>
               </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <Marquee />

      {/* Problem Section */}
      <section className="py-32 bg-neutral-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection className="max-w-3xl mb-24">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-8 leading-tight">
              Standard auditing is fixed, fake, and expensive.
            </h2>
            <p className="text-xl text-neutral-500 leading-relaxed">
              Relying on quarterly manual audits or "friend checks" doesn't give you the truth. You need a system that captures the reality of your operations.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-2 gap-16">
            <FadeInSection className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Slow Feedback Loops</h3>
                <p className="text-neutral-500 leading-relaxed">It takes weeks to compile reports from paper forms or basic spreadsheets, by then the data is old.</p>
              </div>
            </FadeInSection>
            <FadeInSection className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Predictable Checks</h3>
                <p className="text-neutral-500 leading-relaxed">Auditors show up at the same time every month. Staff prepare, then lapse as soon as they leave.</p>
              </div>
            </FadeInSection>
            <FadeInSection className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Zero Accountability</h3>
                <p className="text-neutral-500 leading-relaxed">Issues are flagged but never fixed. There's no automated follow-up or escalation for critical failures.</p>
              </div>
            </FadeInSection>
            <FadeInSection className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Fragmented Data</h3>
                <p className="text-neutral-500 leading-relaxed">Manual audits make it impossible to compare branches or track improvement over time at scale.</p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">Built for scale.</h2>
            <p className="text-xl text-neutral-500">Every tool you need to maintain 100% compliance across all locations.</p>
          </FadeInSection>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Scheduled Audits" 
              description="Standardize compliance with recurring checks on daily, weekly, or monthly cycles."
              icon={Calendar}
              className="md:col-span-2 group"
            >
              <div className="flex flex-col gap-4 p-6 w-full h-full bg-neutral-50/50 group-hover:bg-white transition-colors">
                 <div className="flex items-center justify-between px-4 py-3 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all transform group-hover:translate-x-2">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                       <span className="text-sm font-medium">Daily Hygiene Check</span>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">Completed</span>
                 </div>
                 <div className="flex items-center justify-between px-4 py-3 bg-white border border-neutral-100 rounded-xl shadow-sm transition-all transform group-hover:translate-x-4">
                    <div className="flex items-center gap-3">
                       <Clock className="w-5 h-5 text-blue-500" />
                       <span className="text-sm font-medium">Weekly Safety Audit</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">In Progress</span>
                 </div>
                 <div className="flex items-center justify-between px-4 py-3 bg-white border border-neutral-100 rounded-xl shadow-sm opacity-50 transition-all transform group-hover:translate-x-6">
                    <div className="flex items-center gap-3">
                       <Calendar className="w-5 h-5 text-neutral-400" />
                       <span className="text-sm font-medium">Monthly Quality Review</span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded-full uppercase">Scheduled</span>
                 </div>
              </div>
            </FeatureCard>

            <FeatureCard 
              title="Surprise Audits" 
              description="Keep teams on their toes with unscheduled, instant random checks."
              icon={Zap}
              className="group"
            >
              <div className="relative flex items-center justify-center h-full">
                 <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center animate-pulse transition-transform group-hover:scale-125">
                    <Zap className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                 </div>
                 <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md text-[8px] font-bold border border-yellow-100 text-yellow-600 shadow-sm">INSTANT AI SELECTION</div>
                 <div className="absolute bottom-4 left-4 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce delay-200" />
                 </div>
              </div>
            </FeatureCard>

            <FeatureCard 
              title="Flashmob Audit" 
              description="Immediate video evidence from the field. Real-time visual compliance."
              icon={Smartphone}
            >
               <div className="p-4 w-full h-full flex flex-col gap-3">
                  <div className="aspect-[9/16] w-24 mx-auto bg-neutral-900 rounded-2xl overflow-hidden border-4 border-white shadow-xl flex flex-col items-center justify-center text-white p-2">
                     <Play className="w-6 h-6 fill-white opacity-50 mb-2" />
                     <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-1/3 animate-[progress_3s_infinite]" />
                     </div>
                  </div>
                  <div className="text-[10px] text-center font-bold text-neutral-400">REC 00:04</div>
               </div>
            </FeatureCard>

            <FeatureCard 
              title="Corrective Actions" 
              description="Auto-generate tasks for failed audits and track them to completion."
              icon={ClipboardCheck}
              className="md:col-span-2"
            >
               <div className="flex flex-col gap-4 p-6 w-full h-full">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                     </div>
                     <div className="flex flex-col gap-1 w-full">
                        <div className="h-3 w-1/3 bg-neutral-200 rounded" />
                        <div className="h-2 w-full bg-neutral-100 rounded" />
                     </div>
                  </div>
                  <div className="ml-14 flex flex-col gap-2">
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-blue-500 bg-blue-50 rounded flex items-center justify-center">
                           <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        </div>
                        <span className="text-[10px] text-neutral-600">Re-upload photo proof</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-neutral-200 rounded" />
                        <span className="text-[10px] text-neutral-400">Review branch manager</span>
                     </div>
                  </div>
               </div>
            </FeatureCard>

            <FeatureCard 
              title="Reports & Scoring" 
              description="Compare performance across locations with detailed analytics."
              icon={BarChart3}
            >
               <div className="p-6 w-full h-full flex flex-col gap-4">
                  <div className="flex items-end gap-1 h-32 justify-around">
                     <div className="w-4 bg-black rounded-t-sm h-[40%]" />
                     <div className="w-4 bg-black rounded-t-sm h-[70%]" />
                     <div className="w-4 bg-neutral-200 rounded-t-sm h-[30%]" />
                     <div className="w-4 bg-black rounded-t-sm h-[90%]" />
                     <div className="w-4 bg-black rounded-t-sm h-[60%]" />
                  </div>
                  <div className="h-px bg-neutral-100" />
                  <div className="flex justify-between text-[8px] font-bold text-neutral-400">
                     <span>MON</span><span>WED</span><span>FRI</span>
                  </div>
               </div>
            </FeatureCard>

            <FeatureCard 
              title="Escalation Alerts" 
              description="Real-time notifications for critical failures and missed audits."
              icon={ShieldAlert}
              className="md:col-span-2"
            >
               <div className="flex items-center justify-center h-full p-8">
                  <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in zoom-in duration-500">
                     <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-7 h-7 text-red-600" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-red-600 uppercase">Critical Alert</p>
                        <p className="text-sm font-bold">Hygiene failure at Location B</p>
                     </div>
                     <ArrowUpRight className="text-neutral-300 w-5 h-5 ml-4" />
                  </div>
               </div>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Role Section */}
      <section id="who-it-is-for" className="py-32 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">Built for everyone.</h2>
            <p className="text-xl text-neutral-500">A unified platform for every level of your organization.</p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
             <FadeInSection className="bg-white p-10 rounded-[40px] border border-neutral-100 flex flex-col gap-6 hover:shadow-xl transition-all duration-500">
                <Users className="w-12 h-12 text-black" />
                <h3 className="text-2xl font-bold">Managers</h3>
                <p className="text-neutral-500 leading-relaxed">Centralize oversight. View all branches, track compliance trends, and manage corrective actions from one dashboard.</p>
                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-black group cursor-pointer">
                   View Features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
             </FadeInSection>
             <FadeInSection className="bg-white p-10 rounded-[40px] border border-neutral-100 flex flex-col gap-6 hover:shadow-xl transition-all duration-500">
                <Building2 className="w-12 h-12 text-black" />
                <h3 className="text-2xl font-bold">Branch In-charge</h3>
                <p className="text-neutral-500 leading-relaxed">Stay on top of daily operations. Receive clear task lists, proof requirements, and instant feedback on site safety.</p>
                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-black group cursor-pointer">
                   View Features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
             </FadeInSection>
             <FadeInSection className="bg-white p-10 rounded-[40px] border border-neutral-100 flex flex-col gap-6 hover:shadow-xl transition-all duration-500">
                <ShieldCheck className="w-12 h-12 text-black" />
                <h3 className="text-2xl font-bold">Auditors</h3>
                <p className="text-neutral-500 leading-relaxed">Efficiency first. Powerful mobile tools for rapid audit submission, video evidence capture, and scoring.</p>
                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-black group cursor-pointer">
                   View Features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
             </FadeInSection>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">Three steps away.</h2>
            <p className="text-xl text-neutral-500">Get your organization up and running in minutes, not days.</p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-16 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-neutral-100 z-0" />
             
             {[
               {
                 step: "01",
                 title: "Define your audits",
                 desc: "Create audit types (Standard, Surprise, Flashmob) and assign them to your locations and staff."
               },
               {
                 step: "02",
                 title: "Staff submits proof",
                 desc: "Branch staff or auditors complete checks via the mobile app, providing photos, video, and notes."
               },
               {
                 step: "03",
                 title: "Analyze & Act",
                 desc: "Review scores instantly. If a critical check fails, corrective tasks are auto-generated for follow-up."
               }
             ].map((item, idx) => (
                <FadeInSection key={idx} className="relative z-10 flex flex-col items-center text-center gap-6">
                   <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
                      {item.step}
                   </div>
                   <h3 className="text-2xl font-bold">{item.title}</h3>
                   <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
                </FadeInSection>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_70%)] opacity-50" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <FadeInSection className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-10 leading-tight">
              Ready to take control <br/>of your operations?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link 
                href="/auth/signup" 
                className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-full font-bold text-xl hover:bg-neutral-100 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
              >
                Get Started Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/auth/signin" 
                className="w-full sm:w-auto px-10 py-5 rounded-full font-bold text-xl text-white border border-neutral-800 hover:bg-neutral-900 transition-all flex items-center justify-center gap-2"
              >
                Sign In
              </Link>
            </div>
            <p className="mt-10 text-neutral-500 font-medium">No credit card required • Unlimited free trial • Setup in 5 minutes</p>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div className="flex flex-col gap-4">
               <Link href="/" className="flex items-center gap-2 group">
                <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-lg tracking-tight text-black">Audiment</span>
              </Link>
              <p className="text-neutral-400 text-sm max-w-xs">The modern standard for operational excellence and automated compliance.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-32">
               <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-sm text-black">Product</h4>
                  <nav className="flex flex-col gap-2">
                     <Link href="#features" className="text-sm text-neutral-500 hover:text-black transition-colors">Features</Link>
                     <Link href="#how-it-works" className="text-sm text-neutral-500 hover:text-black transition-colors">How it works</Link>
                     <Link href="/auth/signup" className="text-sm text-neutral-500 hover:text-black transition-colors">Pricing</Link>
                  </nav>
               </div>
               <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-sm text-black">Company</h4>
                  <nav className="flex flex-col gap-2">
                     <a href="#" className="text-sm text-neutral-500 hover:text-black transition-colors">About Us</a>
                     <a href="#" className="text-sm text-neutral-500 hover:text-black transition-colors">Careers</a>
                     <a href="#" className="text-sm text-neutral-500 hover:text-black transition-colors">Contact</a>
                  </nav>
               </div>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-xs text-neutral-400">© 2026 Audiment Inc. All rights reserved.</p>
             <div className="flex gap-8">
                <a href="#" className="text-xs text-neutral-400 hover:text-black transition-colors">Privacy Policy</a>
                <a href="#" className="text-xs text-neutral-400 hover:text-black transition-colors">Terms of Service</a>
                <a href="#" className="text-xs text-neutral-400 hover:text-black transition-colors">Cookie Policy</a>
             </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
