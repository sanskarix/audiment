/**
 * Scroll Reveal & Animation Observer Utility
 * Provides lightweight, 60fps IntersectionObserver-based animations across all pages.
 */

export function initScrollReveals() {
  const elements = document.querySelectorAll<HTMLElement>(
    '.reveal-on-scroll, section:not(.hero):not(.aud-article-body-section):not(.aud-article-header-section):not(.aud-legal-body-section):not(.aud-legal-section), .faq, .accordions details, .scenarios-grid article, .testimonials-grid article'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      threshold: 0.01,
      rootMargin: '0px 0px -20px 0px',
    }
  );

  elements.forEach((el) => {
    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
    }
    // Subtle stagger calculation if in a grid
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('scenarios-grid') || parent.classList.contains('testimonials-grid') || parent.classList.contains('accordions'))) {
      const childIndex = Array.from(parent.children).indexOf(el);
      el.style.transitionDelay = `${(childIndex % 4) * 0.08}s`;
    }
    observer.observe(el);
  });
}

export function handleHashScroll() {
  if (typeof window === 'undefined' || !window.location.hash) return;
  const targetId = window.location.hash.substring(1);
  const targetEl = document.getElementById(targetId);
  if (targetEl) {
    setTimeout(() => {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
}

export function observeAnimations() {
  if (typeof window === 'undefined') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollReveals();
      handleHashScroll();
    });
  } else {
    initScrollReveals();
    handleHashScroll();
  }

  // Run once more after a short delay to catch late-mounted client components,
  // instead of a MutationObserver which causes forced reflow on every DOM change.
  setTimeout(() => initScrollReveals(), 1500);
}

