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
  CheckCircle2,
  Menu,
  X,
  Plus,
  ArrowUpRight,
  ChevronDown,
  Play
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6",
      isScrolled ? "py-4" : "py-8"
    )}>
      <div className={cn(
        "max-w-6xl mx-auto flex items-center justify-between px-6 py-3 transition-all duration-500",
        isScrolled ? "glass rounded-full" : "bg-transparent"
      )}>
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-8 h-8 bg-black rounded-lg flex items-center justify-center"
          >
            <ShieldCheck className="text-white w-5 h-5" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight text-black uppercase">Audiment</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          {['Platform', 'Enterprise', 'Pricing', 'Resources'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="group flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-black transition-colors"
            >
              {item}
              {item === 'Platform' && <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-bold text-neutral-600 hover:text-black transition-colors">
            Login
          </Link>
          <Link href="/login" className="text-sm font-bold bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Book a demo
          </Link>
          <button 
            className="md:hidden p-2 text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-6 right-6 mt-4 p-6 glass rounded-3xl md:hidden flex flex-col gap-6"
          >
            {['Platform', 'Enterprise', 'Pricing', 'Resources'].map((item) => (
              <Link 
                key={item} 
                href="#"
                className="text-lg font-bold text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <hr className="border-neutral-100" />
            <Link href="/login" className="text-lg font-bold text-black">Login</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-white">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150vh] opacity-60">
          <div className="absolute inset-x-0 top-0 h-full animate-mesh bg-[radial-gradient(at_0%_0%,var(--mesh-1)_0px,transparent_50%),radial-gradient(at_50%_0%,var(--mesh-2)_0px,transparent_50%),radial-gradient(at_100%_0%,var(--mesh-3)_0px,transparent_50%),radial-gradient(at_50%_50%,var(--mesh-4)_0px,transparent_50%)] bg-[length:200%_200%]" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      <motion.div style={{ y, opacity, scale }} className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-neutral-200/50 text-neutral-600 text-[11px] font-bold uppercase tracking-[0.15em] mb-10 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          The standard for multi-outlet retail
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-[110px] font-bold tracking-tight text-black leading-[0.9] mb-10"
        >
          Every Branch. <br/>
          <span className="text-neutral-300">Total Operational Control.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-12 text-balance"
        >
          Audiment transforms messy operations into automated compliance, giving you a 360° view of every outlet in real-time.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-5 items-center justify-center"
        >
          <Link 
            href="/login" 
            className="group relative px-10 py-5 rounded-full bg-black text-white text-lg font-bold transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start for free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link 
            href="/login" 
            className="group px-10 py-5 rounded-full bg-white border border-neutral-200 text-black text-lg font-bold transition-all duration-300 hover:border-black hover:-translate-y-1 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-black" /> Watch demo
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Elements - Inspired by Dialog */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[10%] hidden xl:block"
        >
          <div className="glass p-4 rounded-2xl w-56 transform -rotate-6 shadow-2xl scale-90 opacity-80 backdrop-blur-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="h-2 w-16 bg-neutral-200 rounded-full mb-1" />
                <div className="h-2 w-24 bg-neutral-100 rounded-full" />
              </div>
            </div>
            <div className="h-20 w-full bg-neutral-50 rounded-xl" />
          </div>
        </motion.div>

        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [5, 1, 5]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] hidden xl:block"
        >
          <div className="glass p-5 rounded-3xl w-64 transform rotate-6 shadow-2xl backdrop-blur-2xl border-white/40">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">Live Audit</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-full bg-neutral-200 rounded-full" />
                  <div className="h-2 w-2/3 bg-neutral-100 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const LogoMarquee = () => {
  const logos = [
    "Marriott", "Starbucks", "Nike", "Apple", "Walmart", "Zara", "Decathlon", "Subway"
  ];

  return (
    <section className="py-20 bg-white border-y border-neutral-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-10 overflow-visible">
        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-center mb-10">
          Trusted by world-class retailers
        </p>
      </div>
      <div className="flex relative overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 after:bg-gradient-to-l after:from-white after:to-transparent">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center whitespace-nowrap min-w-full"
        >
          {[...logos, ...logos].map((logo, i) => (
            <span key={i} className="text-3xl lg:text-4xl font-black text-neutral-200 hover:text-black transition-colors duration-500 cursor-default uppercase tracking-tight">
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description, step, icon: Icon, color }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="sticky top-40 w-full mb-20 px-6"
    >
      <div className={cn(
        "max-w-6xl mx-auto glass rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 border-none shadow-[0_24px_80px_rgba(0,0,0,0.06)]",
        color
      )}>
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-sm border border-neutral-100">
            <span className="text-xs font-black text-black">{step}</span>
            <div className="w-px h-4 bg-neutral-200" />
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Operational Phase</span>
          </div>
          <div className="space-y-6">
            <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-black leading-tight">
              {title}
            </h3>
            <p className="text-lg md:text-xl text-neutral-600 font-medium leading-relaxed max-w-md">
              {description}
            </p>
          </div>
          <button className="group inline-flex items-center gap-2 font-bold text-black border-b-2 border-black pb-1 hover:gap-4 transition-all">
            See how it works <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 w-full aspect-square md:aspect-video rounded-[2rem] bg-neutral-50/50 border border-neutral-100 overflow-hidden relative group">
          <div className="absolute inset-x-8 top-8 bottom-0 bg-white rounded-t-2xl shadow-2xl border border-neutral-100 transform group-hover:translate-y-[-10px] transition-transform duration-700">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-neutral-100 rounded-full" />
                <div className="h-5 w-5 rounded-full bg-neutral-50" />
              </div>
              <div className="h-px w-full bg-neutral-50" />
              <div className="space-y-2 pt-2">
                <div className="h-2 w-full bg-neutral-50 rounded-full" />
                <div className="h-2 w-2/3 bg-neutral-50 rounded-full" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-neutral-100/50 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white">
                <Icon className="w-6 h-6" />
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StickyFeatures = () => {
  const steps = [
    {
      step: "01",
      title: "Design Audits That Scale.",
      description: "Create complex audit workflows for hygiene, safety, or inventory. Deploy to 1000s of locations instantly.",
      icon: ListChecks,
      color: "bg-orange-50/20"
    },
    {
      step: "02",
      title: "Real-time Verification.",
      description: "Staff capture geo-tagged proof directly in-app. AI verifies images to eliminate fraud and human error.",
      icon: Camera,
      color: "bg-blue-50/20"
    },
    {
      step: "03",
      title: "Automated Fixes.",
      description: "Instantly trigger corrective tasks on failures. Track resolution benchmarks across your entire region.",
      icon: Zap,
      color: "bg-neutral-50/30"
    }
  ];

  return (
    <section className="relative py-40 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center mb-40">
        <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-black mb-10">
          Simplify complexity. <br/>Drive compliance.
        </h2>
        <p className="text-xl text-neutral-500 font-medium leading-relaxed">
          From the store room to the boardroom, Audiment provides the single source of truth for your physical operations.
        </p>
      </div>
      <div className="relative">
        {steps.map((step, i) => (
          <FeatureCard key={i} {...step} />
        ))}
      </div>
    </section>
  );
};

const BentoGridFeatures = () => {
  return (
    <section className="py-40 px-6 bg-neutral-50/50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">Built for the future of retail.</h2>
          <p className="text-lg text-neutral-500 font-medium">Powering the next generation of physical commerce operation.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-white glass-border p-10 rounded-[2.5rem] border border-neutral-200/50 flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all duration-500"
          >
             <div>
                <BarChart3 className="w-10 h-10 mb-6 text-black" />
                <h3 className="text-3xl font-bold tracking-tight mb-4">Deep Trend Analysis</h3>
                <p className="text-neutral-500 font-medium max-w-md">Spot performance gaps before they become liabilities. AI analyzes audit data to predict future issues.</p>
             </div>
             <div className="flex items-end gap-3 h-20 opacity-40 group-hover:opacity-100 transition-opacity">
                {[40, 70, 45, 90, 65, 80, 50, 100, 60, 85].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    className="flex-1 bg-neutral-100 group-hover:bg-black transition-colors rounded-t-lg" 
                  />
                ))}
             </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-black p-10 rounded-[2.5rem] flex flex-col justify-between text-white group shadow-xl hover:shadow-2xl transition-all duration-500"
          >
             <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
             </div>
             <div>
                <h3 className="text-2xl font-bold tracking-tight mb-4">Flash Audit</h3>
                <p className="text-neutral-400 font-medium leading-relaxed">One-click surprise verification sent to all branches.</p>
             </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-white p-10 rounded-[2.5rem] border border-neutral-200/50 flex flex-col items-center justify-center text-center group shadow-sm hover:shadow-xl transition-all duration-500"
          >
             <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all duration-500">
                <MapPin className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold tracking-tight mb-2">Geo-fencing</h3>
             <p className="text-neutral-500 font-medium">Verify audits occur on-site.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-8 bg-white p-10 rounded-[2.5rem] border border-neutral-200/50 flex flex-col md:flex-row gap-12 items-center group shadow-sm hover:shadow-xl transition-all duration-500"
          >
             <div className="flex-1">
                <ShieldCheck className="w-10 h-10 mb-6 text-black" />
                <h3 className="text-3xl font-bold tracking-tight mb-4">Enterprise Security</h3>
                <p className="text-neutral-500 font-medium">SOC2 Compliant infrastructure with bank-grade encryption for all data.</p>
             </div>
             <div className="flex-1 relative h-full w-full bg-neutral-50/50 rounded-3xl overflow-hidden border border-neutral-100 flex items-center justify-center">
                <div className="flex gap-1.5">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-1.5 h-8 bg-black rounded-full animate-mesh" style={{ animationDelay: `${i * 0.1}s` }} />
                   ))}
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-20 bg-white">
       <div className="max-w-6xl mx-auto px-6">
          <div className="relative bg-neutral-900 rounded-[4rem] p-12 md:p-32 overflow-hidden">
             <div className="absolute inset-0 opacity-40 animate-mesh bg-[radial-gradient(at_0%_0%,#333_0px,transparent_50%),radial-gradient(at_100%_100%,#222_0px,transparent_50%)]" />
             
             <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-[0.9] mb-12">
                  Ready to scale your excellence?
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                   <Link 
                    href="/login" 
                    className="w-full sm:w-auto bg-white text-black px-12 py-6 rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                  >
                    Start free trial
                  </Link>
                  <Link 
                    href="/login" 
                    className="w-full sm:w-auto px-12 py-6 rounded-full font-bold text-xl text-white border border-neutral-700 hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
                  >
                    Contact sales <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-8 text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
                  <span>No credit card</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <span>Setup in minutes</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                  <span>Cloud based</span>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-40 pb-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-20 mb-32">
          <div className="max-w-sm space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tighter text-black uppercase">Audiment</span>
            </Link>
            <p className="text-neutral-500 text-lg font-medium leading-relaxed">
              The world's most advanced operational compliance platform for retailers.
            </p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <h4 className="text-xs font-black text-black uppercase tracking-widest">Product</h4>
              <nav className="flex flex-col gap-4">
                <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-black transition-colors">Features</Link>
                <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-black transition-colors">Integrations</Link>
                <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-black transition-colors">Enterprise</Link>
                <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-black transition-colors">Pricing</Link>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black text-black uppercase tracking-widest">Company</h4>
              <nav className="flex flex-col gap-4">
                <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-black transition-colors">About</Link>
                <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-black transition-colors">Blog</Link>
                <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-black transition-colors">Careers</Link>
                <Link href="#" className="text-sm font-bold text-neutral-400 hover:text-black transition-colors">Contact</Link>
              </nav>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-neutral-100">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">© 2026 Audiment Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">Privacy</Link>
            <Link href="#" className="text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">Terms</Link>
            <Link href="#" className="text-xs font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest">Security</Link>
          </div>
        </div>
      </div>
      
      {/* Massive Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.02] transform translate-y-1/2">
        <span className="text-[25vw] font-black tracking-tighter text-black leading-none">AUDIMENT</span>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white font-sans antialiased">
      <Navbar />
      <Hero />
      <LogoMarquee />
      <StickyFeatures />
      <BentoGridFeatures />
      <CTA />
      <Footer />
    </main>
  );
}

