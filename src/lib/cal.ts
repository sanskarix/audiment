import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export const CAL_CONFIGS = {
  growth: {
    namespace: "aeo",
    link: "sanskarix/aeo",
    config: '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}',
  },
  customDev: {
    namespace: "discovery-call",
    link: "sanskarix/discovery-call",
    config: '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}',
  },
  erp: {
    namespace: "erp-discovery-call",
    link: "sanskarix/erp-discovery-call",
    config: '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}',
  },
  demo: {
    namespace: "demo",
    link: "sanskarix/demo",
    config: '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}',
  },
  general: {
    namespace: "demo",
    link: "sanskarix/demo",
    config: '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}',
  },
} as const;

export type CalServiceType = keyof typeof CAL_CONFIGS;

export function getCalAttributes(service: CalServiceType = "general") {
  const cfg = CAL_CONFIGS[service];
  return {
    "data-cal-namespace": cfg.namespace,
    "data-cal-link": cfg.link,
    "data-cal-config": cfg.config,
  };
}

let calInitPromise: Promise<void> | null = null;

async function doInitCal() {
  try {
    // Only initialize namespaces actually used on this page
    const calButtons = document.querySelectorAll('[data-cal-namespace]');
    const namespacesOnPage = new Set<string>();
    calButtons.forEach((btn) => {
      const ns = btn.getAttribute('data-cal-namespace');
      if (ns) namespacesOnPage.add(ns);
    });

    if (namespacesOnPage.size === 0) return;

    await Promise.all(
      Array.from(namespacesOnPage).map(async (ns) => {
        const cal = await getCalApi({ namespace: ns });
        if (cal) {
          cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
        }
      })
    );
  } catch (err) {
    console.error("Error initializing Cal embed:", err);
  }
}

export function initCalEmbed() {
  if (typeof window === "undefined") return;
  if (calInitPromise) return;

  const triggerInit = () => {
    if (!calInitPromise) {
      calInitPromise = doInitCal();
    }
  };

  // Speculatively load when user hovers or focuses on any Cal button
  const attachTriggers = () => {
    const buttons = document.querySelectorAll('[data-cal-link]');
    buttons.forEach((btn) => {
      btn.addEventListener('pointerenter', triggerInit, { once: true, passive: true });
      btn.addEventListener('focus', triggerInit, { once: true, passive: true });
      btn.addEventListener('touchstart', triggerInit, { once: true, passive: true });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachTriggers, { once: true });
  } else {
    attachTriggers();
  }

  // Defer initialization to idle time so it never blocks FCP or TTI
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => triggerInit(), { timeout: 2000 });
  } else {
    setTimeout(triggerInit, 1200);
  }
}

export function useCalEmbed() {
  useEffect(() => {
    initCalEmbed();
  }, []);
}
