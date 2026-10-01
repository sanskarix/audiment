"use client";

import dynamic from "next/dynamic";

export const DeferredStickyFeatureSection = dynamic(
  () =>
    import("@/components/ui/sticky-scroll-cards-section").then(
      (mod) => mod.StickyFeatureSection
    ),
  {
    ssr: false,
    loading: () => <div className="min-h-[960px] bg-white" aria-hidden />,
  }
);

export const DeferredFAQAccordion = dynamic(
  () => import("@/components/ui/faq-accordion").then((mod) => mod.FAQAccordion),
  {
    ssr: false,
    loading: () => <div className="min-h-[480px]" aria-hidden />,
  }
);

export const DeferredTestimonialsSection = dynamic(
  () =>
    import("@/components/ui/testimonial-v2").then(
      (mod) => mod.TestimonialsSection
    ),
  {
    ssr: false,
    loading: () => <div className="min-h-[720px]" aria-hidden />,
  }
);
