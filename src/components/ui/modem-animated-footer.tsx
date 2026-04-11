"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

export const Footer = ({
  brandName = "Audiment",
  brandDescription = "High-trust audit software for multi-location operations. Enforce truth and stop pencil-whipping with photo evidence and flash verification.",
  socialLinks = [],
  navLinks = [],
  className,
}: FooterProps) => {
  return (
    <section id="footer" className={cn("relative w-full overflow-hidden bg-background", className)}>
      <footer className="border-t border-border relative pt-20 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto relative px-8 z-10 flex flex-col gap-16">
          <div className="flex flex-row justify-between items-start text-sm text-neutral-500 w-full mb-16">
            {/* Brand Column */}
            <div className="flex flex-col gap-6 max-w-xs">
              <span className="text-heading text-3xl md:text-4xl font-semibold tracking-tighter">
                {brandName}
              </span>
              <p className="text-muted-text text-sm font-medium">
                © {new Date().getFullYear()} {brandName}. All rights reserved.
              </p>
              {socialLinks.length > 0 && (
                <div className="flex gap-4 pt-2">
                  {socialLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="text-muted-text hover:text-heading transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-5 h-5 hover:scale-110 duration-200">
                        {link.icon}
                      </div>
                      <span className="sr-only">{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Links Columns */}
            <div className="flex flex-row gap-8 flex-wrap lg:gap-16">
              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-heading mb-2">Solutions</h3>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/solutions/restaurant-operations">Restaurant Operations</Link>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/solutions/retail-operations">Retail Operations</Link>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/solutions/franchise-operations">Franchise Operations</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-heading mb-2">Platform</h3>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/#features">Features</Link>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/#how-it-works">How it works</Link>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/#use-cases">Use cases</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-heading mb-2">Company</h3>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/blog">Blog</Link>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/#contact">Contact</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-heading mb-2">Legal</h3>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/privacy-policy">Privacy policy</Link>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/cookie-policy">Cookie policy</Link>
                <Link className="hover:text-heading transition-colors duration-200 text-muted-text" href="/terms-of-service">Terms of service</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Large background text */}
        <div className="w-full flex justify-center overflow-hidden">
          <div
            className="bg-gradient-to-t from-foreground/20 via-foreground/10 to-transparent bg-clip-text text-transparent leading-none font-medium tracking-tighter pointer-events-none select-none text-center px-4"
            style={{
              fontSize: 'clamp(3rem, 16vw, 20rem)',
              maxWidth: '95vw'
            }}
          >
            {brandName.toUpperCase()}
          </div>
        </div>

        {/* Bottom shadow base */}
        <div className="bg-gradient-to-t from-background via-background/70 blur-[1em] to-background/40 absolute bottom-0 w-full h-24 z-0 pointer-events-none"></div>
      </footer>
    </section>
  );
};
