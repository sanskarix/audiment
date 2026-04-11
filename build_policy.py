import re

with open("audiment-privacy-policy.html", "r", encoding="utf-8") as f:
    html = f.read()

# Extract intro section and 12 sections
sections_html = re.findall(r'(<section\b[^>]*>[\s\S]*?</section>)', html)

def process_section(sec):
    # replace strong
    sec = re.sub(r'<strong>(.*?)</strong>', r'<strong className="font-semibold text-neutral-900">\1</strong>', sec)
    # replace a
    sec = re.sub(r'<a href="([^"]+)"(?:[^>]*)>(.*?)</a>', r'<a href="\1" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline underline-offset-4">\2</a>', sec)
    
    # classes mapping
    sec = re.sub(r'<section[^>]*>', r'<section className="mt-16 scroll-mt-24">', sec)
    sec = re.sub(r'<span class="[^"]*section-number[^"]*".*?>(.*?)</span>', r'<span className="text-sm font-bold tracking-widest text-emerald-600 block mb-3 uppercase">\1</span>', sec)
    sec = re.sub(r'<h2 class="[^"]*section-title[^"]*".*?>(.*?)</h2>', r'<h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 mb-6">\1</h2>', sec)
    sec = re.sub(r'<h3 class="[^"]*section-subtitle[^"]*".*?>(.*?)</h3>', r'<h3 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">\1</h3>', sec)
    sec = re.sub(r'<p class="[^"]*section-intro[^"]*".*?>(.*?)</p>', r'<p className="text-lg text-neutral-600 mb-6 italic">\1</p>', sec)
    
    # generic tags
    sec = re.sub(r'<p>', r'<p className="text-lg text-neutral-500 leading-relaxed mb-6">', sec)
    # the replace for p might not catch `<p style="...">` from original but we will remove styles first.
    sec = re.sub(r'<p style="[^"]*">', r'<p className="text-lg text-neutral-500 leading-relaxed mb-6">', sec)
    
    # lists
    sec = re.sub(r'<ul>', r'<ul className="space-y-3 mb-6">', sec)
    # ul li -> add bullet icon? "The user wants exact look and feel of landing page" which uses CheckCircle2 for list items. 
    # but to be safe, just standard bullet points or simple checkmarks.
    sec = re.sub(r'<li>(.*?)</li>', r'<li className="flex items-start gap-3 text-neutral-600 text-lg leading-relaxed"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-2.5"></div><span className="flex-1">\1</span></li>', sec)
    
    # clean up any remaining weird class names
    sec = re.sub(r'class="[^"]*"', '', sec)
    
    return sec

processed = [process_section(s) for s in sections_html]

# Replace specific DSAR links and text
for i in range(len(processed)):
    processed[i] = processed[i].replace('https://app.termly.io/dsar/b4027388-0475-41b2-9028-bb74d14e2e4b', 'mailto:privacy@audiment.io?subject=Data%20Request&body=Please%20describe%20your%20request%3A')
    processed[i] = processed[i].replace('Submit a Request', 'Email a Data Request')
    processed[i] = processed[i].replace('Submit a Data Request →', 'Email a Data Request')
    
    # Button styling (DSAR)
    processed[i] = re.sub(r'<a href="mailto:privacy@audiment\.io\?subject=Data%20Request&amp;body=Please%20describe%20your%20request%3A"[^>]*className="text-emerald-600[^"]*"[^>]*>(Email a Data Request[^<]*)</a>', 
                          r'<a href="mailto:privacy@audiment.io?subject=Data%20Request&body=Please%20describe%20your%20request%3A" className="inline-flex h-14 items-center justify-center px-8 bg-neutral-900 hover:bg-neutral-800 text-white text-base font-semibold rounded-full transition-all mt-4">\1</a>', 
                          processed[i])

# Fix Data chips
for i in range(len(processed)):
    # Original HTML had <div class="data-chips">... <span class="chip">Names</span> ... </div>
    # My regex dropped class="" so it's just <div> <span>Names</span> </div>
    # Actually, we need to style them properly.
    if 'Names</span>' in processed[i] and 'Email addresses</span>' in processed[i]:
        processed[i] = processed[i].replace('<div>', '<div className="flex flex-wrap gap-3 mb-8">')
        processed[i] = re.sub(r'<span>(.*?)</span>', r'<span className="inline-flex items-center px-4 py-2 rounded-full bg-neutral-100 text-neutral-700 font-medium text-sm border border-neutral-200">\1</span>', processed[i])

# Fix Provider Grid
for i in range(len(processed)):
    if 'Google Cloud Platform</p>' in processed[i]:
        # we need to style the provider grid
        processed[i] = processed[i].replace('<div>', '<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">')
        # The cards
        processed[i] = re.sub(r'<div>\s*<p className="[^"]*">(.*?)</p>\s*<p className="[^"]*">(.*?)</p>\s*</div>', 
                              r'<div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100"><p className="font-semibold text-neutral-900">\1</p><p className="text-sm text-neutral-500 mt-1">\2</p></div>', processed[i])

# Put it all together
jsx = "\n".join(processed)

page_tsx = f"""import React from "react";
import {{ Metadata }} from "next";
import {{ Footer }} from "@/components/ui/modem-animated-footer";
import {{ HeroHeader }} from "@/components/ui/hero-section-3";
import {{ MapPinIcon, CameraIcon, RefreshCw, FileCheck2, Shield, Smartphone, AlertTriangle }} from "lucide-react";

export const metadata: Metadata = {{
  title: "Privacy Policy – Audiment",
  description: "How Audiment collects, uses, and protects your personal information.",
  robots: "index, follow"
}};

export default function PrivacyPolicyPage() {{
  return (
    <main id="main-content" className="relative text-neutral-900 bg-white font-sans selection:bg-neutral-900 selection:text-white">
      <HeroHeader />
      
      {{/* Hero Section */}}
      <section className="pt-40 pb-20 md:pt-48 md:pb-24 bg-neutral-50 border-b border-neutral-200/60 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6">
                Legal Document
            </span>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.1] mb-6">
                Privacy Policy
            </h1>
            <p className="text-xl text-neutral-500">
                Last updated: April 11, 2026
            </p>
        </div>
      </section>

      {{/* Content Section */}}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-3xl mx-auto">
            {jsx}
        </div>
      </section>

      <Footer
        brandName="Audiment"
        socialLinks={{[]}}
        navLinks={{[
          {{ label: "Features", href: "/#features" }},
          {{ label: "How it works", href: "/#how-it-works" }},
          {{ label: "Use cases", href: "/#use-cases" }},
          {{ label: "Blog", href: "/blog" }},
          {{ label: "Contact", href: "/#contact" }},
          {{ label: "Privacy policy", href: "/privacy-policy" }},
          {{ label: "Terms of service", href: "/terms-of-service" }},
        ]}}
      />
    </main>
  );
}}
"""

# Ensure br and hr are self closing
page_tsx = page_tsx.replace('<br>', '<br />').replace('<hr>', '<hr />')

# Write output
with open("src/app/(public)/privacy-policy/page.tsx", "w", encoding="utf-8") as out:
    out.write(page_tsx)

print("Generated tailwind page.tsx")

import sys

with open("src/app/(public)/privacy-policy/page.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Fix Contact Box
text = text.replace('<h3>Audiment – Privacy Team</h3>', '<h3 className="text-xl font-semibold mb-4 text-neutral-900 border-b border-neutral-200 pb-4">Audiment – Privacy Team</h3>')
# But wait, I've already lost the contact-box `<div>` styling. Let's fix that too.
import re
text = re.sub(r'<div>\s*<h3 className="text-xl font-semibold mb-4[^>]*>Audiment – Privacy Team</h3>', r'<div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 mt-8">\n<h3 className="text-xl font-semibold mb-4 text-neutral-900 border-b border-neutral-200 pb-4">Audiment – Privacy Team</h3>', text)

with open("src/app/(public)/privacy-policy/page.tsx", "w", encoding="utf-8") as f:
    f.write(text)
print("Finished!")
