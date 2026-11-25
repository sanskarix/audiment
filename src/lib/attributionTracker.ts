"use client";

/**
 * First-Touch Marketing & Device Attribution Tracker for Audiment
 * Preserves initial UTMs, referrer, landing page, and device profile across session navigation.
 */

const STORAGE_KEY = "audiment_signup_attribution_v1";

export interface StoredAttribution {
  landingPage: string;
  signupPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  adClickId: string;
  deviceType: "Mobile" | "Tablet" | "Desktop";
  device: string;
  os: string;
  browser: string;
  screenResolution: string;
  browserLanguage: string;
  timezone: string;
  pagesBeforeSignup: number;
  firstSeenAt: number;
}

function detectClientEnvironment(): {
  deviceType: "Mobile" | "Tablet" | "Desktop";
  os: string;
  browser: string;
  deviceSummary: string;
} {
  if (typeof window === "undefined") {
    return {
      deviceType: "Desktop",
      os: "Other",
      browser: "Other",
      deviceSummary: "Desktop",
    };
  }

  const ua = navigator.userAgent || "";
  let deviceType: "Mobile" | "Tablet" | "Desktop" = "Desktop";
  let os = "Other";
  let browser = "Other";

  // Device Type
  const isMobile = /iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad|tablet/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isTablet) {
    deviceType = "Tablet";
  } else if (isMobile) {
    deviceType = "Mobile";
  } else {
    deviceType = "Desktop";
  }

  // Operating System
  if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Browser
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";

  const deviceSummary = `${deviceType} (${os} / ${browser})`;

  return { deviceType, os, browser, deviceSummary };
}

export function initAttributionTracker(): void {
  if (typeof window === "undefined") return;

  try {
    const now = Date.now();
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const env = detectClientEnvironment();

    // Ad Click IDs (Google, Facebook, Microsoft, TikTok)
    const adClickId =
      params.get("gclid") ||
      params.get("fbclid") ||
      params.get("msclkid") ||
      params.get("ttclid") ||
      "";

    const existingRaw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);

    if (!existingRaw) {
      // First touch on the site
      let ref = document.referrer || "";
      if (ref) {
        try {
          const parsedRef = new URL(ref);
          if (parsedRef.hostname === window.location.hostname) {
            ref = "Direct / Internal";
          }
        } catch {
          // ignore
        }
      } else {
        ref = "Direct";
      }

      // Fallback UTM Source if direct or organic search
      let utmSource = params.get("utm_source") || "";
      if (!utmSource && ref && ref !== "Direct" && ref !== "Direct / Internal") {
        try {
          const refHost = new URL(ref).hostname.replace(/^www\./, "");
          if (refHost.includes("google.")) utmSource = "google_organic";
          else if (refHost.includes("linkedin.")) utmSource = "linkedin_organic";
          else if (refHost.includes("twitter.") || refHost.includes("x.com")) utmSource = "twitter_organic";
          else if (refHost.includes("youtube.")) utmSource = "youtube";
          else utmSource = refHost;
        } catch {
          utmSource = "referral";
        }
      }
      if (!utmSource) {
        utmSource = "direct";
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

      const initial: StoredAttribution = {
        landingPage: window.location.pathname + window.location.search,
        signupPage: window.location.pathname,
        referrer: ref,
        utmSource,
        utmMedium: params.get("utm_medium") || (utmSource === "direct" ? "direct" : "organic"),
        utmCampaign: params.get("utm_campaign") || "",
        utmTerm: params.get("utm_term") || "",
        utmContent: params.get("utm_content") || "",
        adClickId,
        deviceType: env.deviceType,
        device: env.deviceSummary,
        os: env.os,
        browser: env.browser,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        browserLanguage: navigator.language || "en",
        timezone,
        pagesBeforeSignup: 1,
        firstSeenAt: now,
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } else {
      // Subsequent pageview: increment page counter and record current page
      try {
        const parsed: StoredAttribution = JSON.parse(existingRaw);
        parsed.pagesBeforeSignup = (parsed.pagesBeforeSignup || 1) + 1;
        parsed.signupPage = window.location.pathname;

        // If user arrived with new campaign parameters, overwrite if previously direct
        if (parsed.utmSource === "direct" && params.get("utm_source")) {
          parsed.utmSource = params.get("utm_source")!;
          parsed.utmMedium = params.get("utm_medium") || "referral";
          parsed.utmCampaign = params.get("utm_campaign") || "";
          parsed.utmTerm = params.get("utm_term") || "";
          parsed.utmContent = params.get("utm_content") || "";
        }

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch {}
    }
  } catch (err) {
    console.warn("[AttributionTracker] Failed to record attribution:", err);
  }
}

export function getStoredAttribution(): Partial<StoredAttribution> {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    const env = detectClientEnvironment();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    if (!raw) {
      // Fallback: construct instant attribution if user hit signup directly
      const params = new URLSearchParams(window.location.search);
      const ref = document.referrer || "Direct";
      const utmSource = params.get("utm_source") || "direct";

      return {
        landingPage: window.location.pathname + window.location.search,
        signupPage: window.location.pathname,
        referrer: ref,
        utmSource,
        utmMedium: params.get("utm_medium") || "direct",
        utmCampaign: params.get("utm_campaign") || "",
        utmTerm: params.get("utm_term") || "",
        utmContent: params.get("utm_content") || "",
        deviceType: env.deviceType,
        device: env.deviceSummary,
        os: env.os,
        browser: env.browser,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        browserLanguage: navigator.language || "en",
        timezone,
        pagesBeforeSignup: 1,
        firstSeenAt: Date.now(),
      };
    }

    const data: StoredAttribution = JSON.parse(raw);
    data.signupPage = window.location.pathname;
    return data;
  } catch {
    return {};
  }
}
