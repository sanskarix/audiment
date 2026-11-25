import { observeDotBorderButtons } from '@/lib/dotBorder';
import { observeAnimations } from '@/lib/animations';
import { initCalEmbed } from '@/lib/cal';

export interface SmoothScrollHandle {
  resize: () => void;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; immediate?: boolean }) => void;
}

interface InitSmoothScrollOptions {
  idleTimeout?: number;
  onReady?: (handle: SmoothScrollHandle) => void;
}

/**
 * Universal smooth-scroll & marketing runtime initializer.
 * Dynamically loads Lenis during idle time (no GSAP/ScrollTrigger overhead),
 * configures native autoRaf + reduced-motion support, and pauses RAF when tab is hidden.
 */
export function initSmoothScroll(options: InitSmoothScrollOptions = {}): () => void {
  if (typeof window === 'undefined') return () => {};

  const { idleTimeout = 1000, onReady } = options;

  let destroyed = false;
  let lenisInstance: {
    resize: () => void;
    scrollTo: (target: any, opts?: any) => void;
    stop: () => void;
    start: () => void;
    destroy: () => void;
  } | null = null;
  let idleId: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;

  const handleVisibilityChange = () => {
    if (!lenisInstance) return;
    if (document.hidden) {
      lenisInstance.stop();
    } else {
      lenisInstance.start();
    }
  };

  const handleLoad = () => {
    lenisInstance?.resize();
  };

  const initRuntime = async () => {
    if (destroyed) return;

    // Run lightweight DOM observers & Cal embed setup first
    observeDotBorderButtons();
    observeAnimations();
    initCalEmbed();

    // Respect user reduced-motion preference without spinning up a RAF loop
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      try {
        const { default: Lenis } = await import('lenis');
        if (destroyed) return;

        const lenis = new Lenis({
          lerp: 0.085,
          smoothWheel: true,
          autoRaf: true,
          autoResize: true,
          stopInertiaOnNavigate: true,
          respectReducedMotion: true,
        });

        lenisInstance = lenis;
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('load', handleLoad, { once: true });

        const handle: SmoothScrollHandle = {
          resize: () => lenis.resize(),
          scrollTo: (target, opts) => lenis.scrollTo(target, opts),
        };

        onReady?.(handle);

        resizeTimer = setTimeout(() => {
          if (!destroyed) lenis.resize();
        }, 300);
      } catch {
        // Fallback gracefully to native scrolling if Lenis fails to load
      }
    }
  };

  if ('requestIdleCallback' in window) {
    idleId = (window as any).requestIdleCallback(initRuntime, { timeout: idleTimeout });
  } else {
    timeoutId = setTimeout(initRuntime, 250);
  }

  return () => {
    destroyed = true;
    if (idleId !== null && 'cancelIdleCallback' in window) {
      (window as any).cancelIdleCallback(idleId);
    }
    if (timeoutId !== null) clearTimeout(timeoutId);
    if (resizeTimer !== null) clearTimeout(resizeTimer);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('load', handleLoad);
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
    }
  };
}
