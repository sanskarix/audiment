"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section-3";
import { Footer } from "@/components/ui/modem-animated-footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* 21st magic Hero component */}
      <HeroSection />

      {/* Spacing above footer */}
      <div className="py-20" />

      {/* 21st magic Footer component */}
      <Footer 
        brandName="Audiment"
        brandDescription="Audiment gives restaurant owners verified, real-time visibility into every outlet — without leaving the office."
        navLinks={[
          { label: "Platform", href: "#platform" },
          { label: "Pricing", href: "#pricing" },
          { label: "Customers", href: "#customers" },
        ]}
      />
    </div>
  );
}