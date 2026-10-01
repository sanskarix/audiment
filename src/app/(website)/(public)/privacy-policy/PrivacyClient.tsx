"use client";

import { useEffect } from "react";

export function PrivacyInteractions() {
  useEffect(() => {
    // Theme toggle
    const t = document.querySelector('[data-theme-toggle]');
    const r = document.documentElement;
    let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
    
    // Fallback: If wait for mount to check, set the html attribute
    r.setAttribute('data-theme', d);
    
    const handleToggle = () => {
      d = d === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', d);
      if (t) {
        t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
        t.innerHTML = d === 'dark'
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      }
    };

    if (t) {
      t.addEventListener('click', handleToggle);
    }
    
    return () => {
      if (t) t.removeEventListener('click', handleToggle);
    };
  }, []);

  useEffect(() => {
    // TOC active highlight on scroll
    const sections = document.querySelectorAll('.policy-section[id]');
    const links = document.querySelectorAll('.toc-list a');
    
    if (sections.length > 0 && links.length > 0) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(l => l.classList.remove('active'));
            const active = document.querySelector('.toc-list a[href="#' + entry.target.id + '"]');
            if (active) active.classList.add('active');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      
      sections.forEach(s => obs.observe(s));
      
      return () => {
        sections.forEach(s => obs.unobserve(s));
        obs.disconnect();
      };
    }
  }, []);

  return null;
}
