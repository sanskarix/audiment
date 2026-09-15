"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useConsent } from "@/components/ConsentProvider";
import {
  pushAnalyticsEvent,
  getSanitizedUrl,
  getSafeReferrer,
  getPageTaxonomyContext,
  getActiveBlogMetadata,
  subscribeBlogMetadata,
  type BlogArticleMetadata,
} from "@/lib/dataLayer";

function isPublicRoute(pathname: string | null): boolean {
  if (!pathname) return false;

  if (
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/test-recording" ||
    pathname.startsWith("/test-recording/")
  ) {
    return false;
  }

  return true;
}

function PageviewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { consent, hasDecision } = useConsent();

  const [blogMeta, setBlogMeta] = useState<BlogArticleMetadata | null>(() => getActiveBlogMetadata());

  const lastPushedUrlRef = useRef<string | null>(null);
  const initialExternalReferrerRef = useRef<string>("");
  const lastConsentedPageRef = useRef<string | null>(null);

  // Subscribe to blog metadata updates from BlogMetadataPublisher
  useEffect(() => {
    return subscribeBlogMetadata((meta) => {
      setBlogMeta(meta);
    });
  }, []);

  // Capture initial external referrer on client mount (if from an external domain)
  useEffect(() => {
    if (typeof document !== "undefined" && document.referrer) {
      const safeRef = getSafeReferrer(document.referrer);
      if (
        safeRef &&
        typeof window !== "undefined" &&
        !safeRef.includes(window.location.hostname)
      ) {
        initialExternalReferrerRef.current = safeRef;
      }
    }
  }, []);

  useEffect(() => {
    // 1. Exclude non-public routes (/dashboard/*, /login, /test-recording)
    if (!isPublicRoute(pathname)) {
      return;
    }

    // 2. Consent check: Must have decision AND analytics consent granted
    if (!hasDecision || !consent.analytics) {
      return;
    }

    // 3. Blog Metadata Readiness Check:
    // For blog article routes (/blog/[slug]), wait until matching metadata is published
    const isBlogPost = pathname.startsWith("/blog/") && pathname !== "/blog";
    const currentSlug = isBlogPost ? pathname.replace("/blog/", "").replace(/\/$/, "") : null;

    if (isBlogPost && currentSlug) {
      if (!blogMeta || blogMeta.slug !== currentSlug) {
        // Metadata for current article not ready yet; effect will re-run when blogMeta updates
        return;
      }
    }

    // 4. Compute sanitized location & path (page_path is pure pathname)
    const { sanitizedLocation, sanitizedPath } = getSanitizedUrl();

    // 5. Duplicate prevention check:
    if (lastPushedUrlRef.current === sanitizedLocation) {
      return;
    }

    const pageTitle = typeof document !== "undefined" ? document.title : "";
    const pageContext = getPageTaxonomyContext(pathname);

    // Determine page_referrer:
    // - First consented pageview uses initial external referrer (omitting pre-consent internal navigations)
    // - Subsequent consented pageviews use the last consented internal page
    let pageReferrer = "";
    if (lastConsentedPageRef.current) {
      pageReferrer = lastConsentedPageRef.current;
    } else if (initialExternalReferrerRef.current) {
      pageReferrer = initialExternalReferrerRef.current;
    }

    pushAnalyticsEvent({
      event: "audiment_page_view",
      page_title: pageTitle,
      page_location: sanitizedLocation,
      page_path: sanitizedPath,
      ...(pageReferrer ? { page_referrer: pageReferrer } : {}),
      ...pageContext,
    });

    if (process.env.NODE_ENV === "development") {
      console.debug("[Analytics Pageview Tracked]", {
        event: "audiment_page_view",
        page_path: sanitizedPath,
        page_location: sanitizedLocation,
        page_referrer: pageReferrer || "(none)",
        page_type: pageContext.page_type,
        ...(pageContext.article_category ? { article_category: pageContext.article_category } : {}),
      });
    }

    // Update refs: current page becomes lastConsentedPage for next transition
    lastConsentedPageRef.current = sanitizedLocation;
    lastPushedUrlRef.current = sanitizedLocation;
  }, [pathname, searchParams, hasDecision, consent.analytics, blogMeta]);

  return null;
}

export function PublicPageviewTracker() {
  return (
    <Suspense fallback={null}>
      <PageviewTrackerInner />
    </Suspense>
  );
}
