/**
 * Scroll Reveal & Animation Observer Utility
 * Provides lightweight, 60fps IntersectionObserver-based animations across all pages.
 */

const REVEAL_SELECTOR =
  '.reveal-on-scroll, section:not(.hero):not(.aud-article-body-section):not(.aud-article-header-section):not(.aud-legal-body-section):not(.aud-legal-section), .faq, .accordions details, .scenarios-grid article, .testimonials-grid article';

let sharedObserver: IntersectionObserver | null = null;

function getRevealObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return null;
  }

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Stop observing once revealed to avoid redundant intersection checks on scroll
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px -20px 0px',
      }
    );
  }

  return sharedObserver;
}

export function initScrollReveals() {
  if (typeof document === 'undefined') return;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elements = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
  const observer = prefersReducedMotion ? null : getRevealObserver();

  elements.forEach((el) => {
    if (el.dataset.revealObserved === '1' || el.classList.contains('is-visible')) {
      return;
    }
    el.dataset.revealObserved = '1';

    if (!el.classList.contains('reveal-on-scroll')) {
      el.classList.add('reveal-on-scroll');
    }

    if (prefersReducedMotion || !observer) {
      el.classList.add('is-visible');
      return;
    }

    // Subtle stagger calculation if in a grid
    const parent = el.parentElement;
    if (
      parent &&
      (parent.classList.contains('scenarios-grid') ||
        parent.classList.contains('testimonials-grid') ||
        parent.classList.contains('accordions'))
    ) {
      const childIndex = Array.prototype.indexOf.call(parent.children, el);
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
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        initScrollReveals();
        handleHashScroll();
      },
      { once: true }
    );
  } else {
    initScrollReveals();
    handleHashScroll();
  }

  // Run once more after a short delay to catch late-mounted client components,
  // skipping already-observed elements.
  setTimeout(() => initScrollReveals(), 1500);
}
