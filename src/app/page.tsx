"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, Quote, Zap, Shield, Globe2, LayoutTemplate } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section-3";
import { Footer } from "@/components/ui/modem-animated-footer";
import { StickyFeatureSection } from "@/components/ui/sticky-scroll-cards-section";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 21st magic Hero component */}
      <HeroSection />

      {/* Testimonials Section (Matching Dialog's post-hero quotes) */}
      <section className="py-24 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                quote: "We recently integrated this system into our 50+ locations, and it’s an easy quick win. By providing real-time oversight, it increases compliance and reduces operational friction.",
                author: "Ananya S.",
                role: "Operations Manager @BiryaniBlues"
              },
              {
                quote: "Providing consistent quality and decision-making support is a key priority. The results of the first quarter have fully lived up to our expectations, and we have great ambitions for deploying across upcoming sites.",
                author: "Vikram R.",
                role: "Head of Growth @WowMomo"
              },
              {
                quote: "We are at the very beginning of our journey with Audiment, yet we can already see its transformative potential in reshaping how we monitor our outlets. A true game-changer.",
                author: "Neha K.",
                role: "Regional Director @Theobroma"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="flex flex-col gap-6 p-8 rounded-3xl bg-neutral-50/50 border border-neutral-100/50 hover:bg-neutral-50 transition-colors duration-300">
                <div className="flex gap-1 text-neutral-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg text-neutral-600 leading-relaxed font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-auto pt-4 flex flex-col">
                  <span className="font-semibold text-neutral-900">{testimonial.author}</span>
                  <span className="text-sm text-neutral-500">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Scroll Features (Matching Dialog's detailed feature breakdown) */}
      <StickyFeatureSection />

      {/* Large Comparison Section (Matching "Chatbot lives in a corner. Dialog lives in the experience.") */}
      <section className="py-32 md:py-48 bg-neutral-50 px-6 border-y border-neutral-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/40 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-neutral-900 leading-[1.1] mb-8">
            Other tools live in spreadsheets. <br />
            <span className="text-neutral-400">Audiment lives in the operations.</span>
          </h2>
          <p className="text-xl md:text-3xl text-neutral-500 max-w-3xl mx-auto leading-relaxed font-medium">
            Replace clunky manual checklists with a centralized platform that understands every branch, every operation, and every compliance need in the moment.
          </p>
        </div>
      </section>

      {/* Secondary Features (Matching "Study conversations. Find insights" & "AI-to-AI") */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Insights Block */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-semibold tracking-tight">Study operations.<br/>Find insights.</h3>
              <p className="text-xl text-neutral-500">Audiment gives you refined data to make operational and expansion decisions from real branch activity.</p>
              <ul className="space-y-6">
                {[
                  { title: "Get real-time feedback", desc: "Uncover trends from daily audits instead of running weekly manual checks." },
                  { title: "Clarify your standards", desc: "Use real incident reports to improve all staff guidelines, keeping them clear and relevant." },
                  { title: "Identify opportunities", desc: "Spot recurring bottlenecks to prioritize targeted training and structural improvements." }
                ].map((item, i) => (
                  <li key={i} className="flex flex-col gap-2">
                    <span className="text-lg font-semibold text-neutral-900">{item.title}</span>
                    <span className="text-neutral-500">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-square rounded-[2.5rem] bg-neutral-50 border border-neutral-100 flex items-center justify-center relative overflow-hidden p-8">
               <div className="w-full h-full rounded-2xl border border-neutral-200/60 bg-white shadow-xl shadow-neutral-900/5 overflow-hidden flex flex-col">
                  {/* Faux UI Header */}
                  <div className="h-12 border-b border-neutral-100 bg-neutral-50/50 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  {/* Faux UI Body */}
                  <div className="flex-1 p-6 space-y-4 bg-white/50">
                    <div className="w-3/4 h-8 bg-neutral-100 rounded-lg animate-pulse" />
                    <div className="w-1/2 h-8 bg-neutral-100 rounded-lg animate-pulse" />
                    <div className="w-full h-32 bg-neutral-100/50 rounded-xl mt-8" />
                  </div>
               </div>
            </div>
          </div>

          {/* System Integration Block */}
          <div className="grid md:grid-cols-2 gap-16 items-center flex-col-reverse">
             <div className="aspect-square rounded-[2.5rem] bg-neutral-900 border border-neutral-800 flex items-center justify-center relative overflow-hidden order-2 md:order-1">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.white)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
               <div className="relative z-10 w-32 h-32 rounded-3xl bg-white flex items-center justify-center shadow-2xl shadow-black/50">
                 <LayoutTemplate className="w-12 h-12 text-neutral-900" />
               </div>
            </div>
            <div className="space-y-8 order-1 md:order-2">
              <h3 className="text-4xl font-semibold tracking-tight">Ecosystem Integration<br/>& POS Connectivity</h3>
              <p className="text-xl text-neutral-500">When regional managers ask about branch performance, they need a trusted source for inventory, compliance, and staff logs.</p>
              <p className="text-xl text-neutral-500">Audiment is that source. It connects with your existing Point of Sale systems and CCTV setups to track how your chain actually operates.</p>
              <Link href="#demo" className="inline-flex items-center gap-2 text-neutral-900 font-semibold hover:opacity-70 transition-opacity">
                Book a demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props & Quick Setup Grid */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-200/50 text-center px-6">
        <div className="max-w-4xl mx-auto space-y-6 mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 text-balance">
            Quick setup, secure audits,<br/>and total visibility
          </h2>
          <p className="text-xl text-neutral-500">Stay in control with robust guardrails and data protection, ensuring your operations always run smoothly.</p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Zap, title: "Set up in minutes", desc: "Connect your branches easily. Audiment is ready to go with no heavy integration required." },
            { icon: Shield, title: "Secure guardrails", desc: "Control exactly who sees what. Restrict access layers, and stay in full control." },
            { icon: Globe2, title: "Speaks all languages", desc: "Support your staff in their native language, wherever your branch is located." },
            { icon: LayoutTemplate, title: "Full customization", desc: "Make your audits feel native by aligning visuals, forms, and compliance behavior." },
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-neutral-100 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:shadow-neutral-200/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mb-2 text-neutral-900">
                <feature.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-semibold text-neutral-900">{feature.title}</h4>
              <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-neutral-100 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-200/60">
            {[
              { value: "3–25", label: "Outlets Managed per Account", suffix: "+" },
              { value: "48h", label: "Average Launch Time", suffix: "" },
              { value: "100%", label: "FSSAI Compliance Rate", suffix: "" },
            ].map((stat) => (
              <div key={stat.label} className="pt-8 md:pt-0 flex flex-col items-center">
                <div className="text-5xl md:text-6xl font-semibold tracking-tighter text-neutral-900 mb-3">
                  {stat.value}<span className="text-neutral-400 font-medium">{stat.suffix}</span>
                </div>
                <p className="text-neutral-500 font-medium text-lg text-balance">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6 bg-white flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.neutral.100)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_100%)"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.1]">
            Ready for <br className="hidden md:block"/>
            <span className="text-neutral-400">Total Control?</span>
          </h2>
          <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Join the fastest-growing restaurant brands leveraging Audiment to standardize operations and guarantee quality.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link
              href="#contact"
              className="inline-flex h-14 items-center gap-2 px-8 bg-neutral-900 hover:bg-neutral-800 text-white text-lg font-medium rounded-full transition-all hover:scale-[1.02] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              Get started free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-neutral-500 font-medium pb-2 sm:pb-0">
              <CheckCircle2 className="w-5 h-5 text-neutral-400" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* 21st magic Footer component */}
      <div className="py-20 bg-white" />
      <Footer 
        brandName="Audiment"
        socialLinks={[
          {
            icon: <Globe2 className="h-5 w-5" />,
            href: "https://audiment.com",
            label: "Website"
          },
        ]}
      />
    </div>
  );
}