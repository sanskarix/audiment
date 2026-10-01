"use client";

/**
 * Standard DataLayer Utility & Analytics Helper for Audiment
 * Pushes structured analytics events to window.dataLayer without overwriting.
 */

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

export interface AnalyticsEventPayload {
  event: string;
  [key: string]: any;
}

/**
 * Safely pushes an event object into window.dataLayer.
 */
export function pushAnalyticsEvent(payload: AnalyticsEventPayload): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (process.env.NODE_ENV === "development") {
    console.debug("[Analytics DataLayer Event]", payload);
  }
}

export interface BlogArticleMetadata {
  category: string;
  slug: string;
}

type BlogMetadataListener = (meta: BlogArticleMetadata | null) => void;

// Client-side store for structured blog metadata published by BlogMetadataPublisher
let activeBlogMetadata: BlogArticleMetadata | null = null;
const blogMetadataListeners: Set<BlogMetadataListener> = new Set();

export function setActiveBlogMetadata(metadata: BlogArticleMetadata | null): void {
  activeBlogMetadata = metadata;
  blogMetadataListeners.forEach((listener) => listener(metadata));
}

export function getActiveBlogMetadata(): BlogArticleMetadata | null {
  return activeBlogMetadata;
}

export function subscribeBlogMetadata(listener: BlogMetadataListener): () => void {
  blogMetadataListeners.add(listener);
  return () => {
    blogMetadataListeners.delete(listener);
  };
}

const ALLOWED_QUERY_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "wbraid",
  "gbraid",
  "fbclid",
  "msclkid",
]);

/**
 * Validates query values to prevent obvious PII (emails, phone numbers, oversized text)
 * from being included in analytics URLs.
 */
function isSafeAttributionValue(val: string): boolean {
  if (!val || val.length > 128) return false;

  // Reject email addresses
  if (val.includes("@") && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val)) {
    return false;
  }

  // Reject obvious phone numbers (numeric sequence of 7 to 15 digits)
  const digitsOnly = val.replace(/[\s\-\(\)\+]/g, "");
  if (/^\d{7,15}$/.test(digitsOnly)) {
    return false;
  }

  return true;
}

/**
 * Sanitizes URLs:
 * - sanitizedPath contains ONLY the URL pathname (no query params or fragments)
 * - sanitizedLocation contains full URL with allowed, PII-filtered campaign params
 */
export function getSanitizedUrl(rawUrl?: string): { sanitizedLocation: string; sanitizedPath: string } {
  if (typeof window === "undefined") {
    return { sanitizedLocation: "", sanitizedPath: "" };
  }

  const url = new URL(rawUrl || window.location.href, window.location.origin);
  const cleanParams = new URLSearchParams();

  url.searchParams.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (ALLOWED_QUERY_PARAMS.has(lowerKey) && isSafeAttributionValue(value)) {
      cleanParams.set(key, value);
    }
  });

  const queryString = cleanParams.toString();
  const sanitizedPath = url.pathname;
  const sanitizedLocation = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}${url.pathname}${queryString ? `?${queryString}` : ""}`;

  return { sanitizedLocation, sanitizedPath };
}

/**
 * Strips query params and PII from referrer URLs.
 */
export function getSafeReferrer(rawReferrer: string): string {
  if (!rawReferrer) return "";
  try {
    const refUrl = new URL(rawReferrer);
    const { sanitizedLocation } = getSanitizedUrl(refUrl.href);
    return sanitizedLocation;
  } catch {
    return "";
  }
}

export interface PageTaxonomyContext {
  page_type: string;
  industry?: string;
  competitor_name?: string;
  content_type?: string;
  article_slug?: string;
  article_category?: string;
}

/**
 * Maps pathname to standardized Audiment page taxonomy and context parameters.
 */
export function getPageTaxonomyContext(pathname: string): PageTaxonomyContext {
  if (pathname === "/") {
    return { page_type: "homepage" };
  }

  if (pathname === "/about") {
    return { page_type: "company" };
  }

  if (pathname === "/blog") {
    return { page_type: "blog_index" };
  }

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "").replace(/\/$/, "");
    const blogMeta = getActiveBlogMetadata();

    return {
      page_type: "blog_post",
      content_type: "blog_post",
      article_slug: (blogMeta && blogMeta.slug === slug) ? blogMeta.slug : slug,
      ...((blogMeta && blogMeta.slug === slug && blogMeta.category) ? { article_category: blogMeta.category } : {}),
    };
  }

  if (
    pathname === "/solutions" ||
    pathname.startsWith("/solutions/") ||
    pathname.includes("-audit-software")
  ) {
    let industry: string | undefined;
    if (pathname.includes("restaurant")) industry = "restaurant";
    else if (pathname.includes("retail")) industry = "retail";
    else if (pathname.includes("franchise")) industry = "franchise";
    else if (pathname.includes("manufacturing")) industry = "manufacturing";
    else if (pathname.includes("hotel")) industry = "hotel";
    else if (pathname.includes("qsr")) industry = "qsr";
    else if (pathname.includes("food-safety")) industry = "food_safety";
    else if (pathname.includes("healthcare")) industry = "healthcare";
    else if (pathname.includes("fssai")) industry = "fssai";
    else if (pathname.includes("multi-location")) industry = "multi_location";

    return {
      page_type: "solution",
      ...(industry ? { industry } : {}),
    };
  }

  if (pathname === "/compare" || pathname.startsWith("/compare/")) {
    let competitor_name: string | undefined;
    if (pathname.includes("safetyculture")) competitor_name = "safetyculture";
    else if (pathname.includes("goaudits")) competitor_name = "goaudits";
    else if (pathname.includes("zenput")) competitor_name = "zenput";
    else if (pathname.includes("jolt")) competitor_name = "jolt";
    else if (pathname.includes("checklist-apps")) competitor_name = "checklist_apps";

    return {
      page_type: "comparison",
      ...(competitor_name ? { competitor_name } : {}),
    };
  }

  if (pathname.startsWith("/platform/")) {
    return { page_type: "platform" };
  }

  if (pathname === "/use-cases" || pathname.startsWith("/use-cases/")) {
    return { page_type: "use_case" };
  }

  if (
    pathname === "/privacy-policy" ||
    pathname === "/cookie-policy" ||
    pathname === "/terms-of-service"
  ) {
    return { page_type: "legal" };
  }

  return { page_type: "company" };
}
